import { inputsOf } from "../model/recipes";
import { Resource } from "../model/resources";
import { KINKED_NODES, KINKED_RESOURCES } from "./allocators";
import { solveForward } from "./forward";
import { EPSILON, SolverInputs } from "./types";

/**
 * Soldier-per-minute values at which the forward map changes slope: where the
 * double-deposit mines of some resource run out and ordinary ones take over, or
 * where the gold cap is reached and further soldiers stop getting gold.
 *
 * A resource's own demand curve is unaffected by its own allocator, so it is
 * affine in the target and two samples pin it exactly — provided no *other*
 * kink bends it from upstream, which `assertNoKinkedAncestors` checks.
 */
export function breakpointsInSoldierRate(inputs: SolverInputs): number[] {
  const atZero = solveForward(0, inputs);
  const atOne = solveForward(1, inputs);
  const found: number[] = [];

  for (const resource of KINKED_RESOURCES) {
    const node = KINKED_NODES[resource];
    const kinkAt = node?.kinkAt(inputs) ?? null;
    if (kinkAt === null) continue;

    const fixed = atZero.demand[resource];
    const slope = atOne.demand[resource] - fixed;
    // Exogenous demand (stone) has zero slope, so it never kinks in the soldier rate.
    if (slope <= EPSILON) continue;

    const t = (kinkAt - fixed) / slope;
    if (t > EPSILON) found.push(t);
  }

  return Array.from(new Set(found)).sort((a, b) => a - b);
}

/** Every resource reachable from `roots` by following recipe inputs, roots included. */
function downstreamOf(roots: readonly Resource[]): Set<Resource> {
  const seen = new Set<Resource>();
  const stack = [...roots];
  while (stack.length > 0) {
    const next = stack.pop() as Resource;
    if (seen.has(next)) continue;
    seen.add(next);
    stack.push(...inputsOf(next));
  }
  return seen;
}

/**
 * The invariant the closed-form inverse rests on: no kink may bend the demand
 * of another kinked resource, or that demand would itself be piecewise and two
 * samples would no longer pin it.
 *
 * Only the inputs a kink actually bends count. The gold cap sits on the soldier
 * node, which is upstream of iron ore, but it bends only gold-bar demand — and
 * nothing below gold bars is kinked. Double iron and stone mines bend all their
 * inputs, and nothing below either of them is kinked either. If this ever
 * fires, either drop the offending allocator or switch the inverse to
 * `bisectForward`.
 */
export function assertNoKinkedAncestors(): void {
  const kinked = new Set<Resource>(KINKED_RESOURCES);
  for (const resource of KINKED_RESOURCES) {
    const node = KINKED_NODES[resource];
    if (!node) continue;
    for (const bent of Array.from(downstreamOf(node.bentInputs))) {
      if (kinked.has(bent)) {
        throw new Error(
          `${resource} bends the demand of ${bent}, which is itself kinked; ` +
            `its demand is no longer affine and the closed-form inverse is invalid`
        );
      }
    }
  }
}

assertNoKinkedAncestors();
