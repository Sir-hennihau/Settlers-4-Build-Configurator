import { inputsOf, consumersOf, RECIPES } from "./recipes";
import { Resource, RESOURCES, RESOURCE_INDEX } from "./resources";

/**
 * Resolution order for demand propagation, derived from `RECIPES` by Kahn's
 * algorithm rather than hardcoded.
 *
 * The invariant that matters — "coal may only be resolved once all four of its
 * consumers have registered their demand" — is not a rule to remember here. It
 * *is* `indegree(coal) === 4`, which Kahn enforces mechanically. A hardcoded
 * list would be a second source of truth for exactly that invariant, and would
 * rot silently when a node is added, producing plausible-but-wrong numbers.
 *
 * Edge direction: an edge runs from a recipe's output to each of its inputs,
 * meaning "resolve the output first". Indegree is therefore the number of
 * recipes consuming a resource, and the roots (indegree 0) are precisely the
 * exogenous demand entry points: soldierT3, tool and stone.
 *
 * Ties are broken by index into `RESOURCES`, so the order is a pure function of
 * the recipe table and can be pinned in a test.
 */
function computeTopologicalOrder(): Resource[] {
  const indegree = Object.fromEntries(RESOURCES.map((r) => [r, 0])) as Record<Resource, number>;
  for (const r of RESOURCES) {
    for (const input of inputsOf(r)) indegree[input] += 1;
  }

  const ready = RESOURCES.filter((r) => indegree[r] === 0);
  const order: Resource[] = [];

  while (ready.length > 0) {
    // Deterministic tie-break: lowest index into RESOURCES wins.
    let pick = 0;
    for (let i = 1; i < ready.length; i += 1) {
      if (RESOURCE_INDEX[ready[i]] < RESOURCE_INDEX[ready[pick]]) pick = i;
    }
    const next = ready.splice(pick, 1)[0];
    order.push(next);

    for (const input of inputsOf(next)) {
      indegree[input] -= 1;
      if (indegree[input] === 0) ready.push(input);
    }
  }

  if (order.length !== RESOURCES.length) {
    const stuck = RESOURCES.filter((r) => !order.includes(r));
    throw new Error(
      `RECIPES contains a cycle; could not resolve: ${stuck.join(", ")}`
    );
  }
  return order;
}

const ORDER = computeTopologicalOrder();

export const topologicalOrder = (): readonly Resource[] => ORDER;

/** Throws if `RECIPES` is cyclic. Runs at module load, so it cannot fail at render time. */
export function assertAcyclic(): void {
  computeTopologicalOrder();
}

/**
 * Every resource resolved before `r` that contributes demand to it, transitively.
 * Used to prove that a resource's demand curve is affine in the soldier target.
 */
export function demandAncestors(r: Resource): ReadonlySet<Resource> {
  const seen = new Set<Resource>();
  const stack = [...consumersOf(r)];
  while (stack.length > 0) {
    const next = stack.pop() as Resource;
    if (seen.has(next)) continue;
    seen.add(next);
    stack.push(...consumersOf(next));
  }
  return seen;
}

/** Sanity check that the recipe table and the resource list agree. */
export function assertWellFormed(): void {
  for (const r of RESOURCES) {
    const recipe = RECIPES[r];
    if (!recipe) throw new Error(`resource ${r} has no recipe`);
    if (recipe.output !== r) throw new Error(`recipe for ${r} declares output ${recipe.output}`);
    if (recipe.outputQty <= 0) throw new Error(`recipe for ${r} has non-positive outputQty`);
    for (const input of inputsOf(r)) {
      if (!RESOURCES.includes(input)) throw new Error(`recipe for ${r} consumes unknown ${input}`);
    }
  }
}

assertWellFormed();
