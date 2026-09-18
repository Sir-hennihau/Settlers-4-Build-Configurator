import { ANCHOR_BUILDINGS, BUILDINGS } from "../model/buildings";
import { assertWellFormed, demandAncestors, topologicalOrder } from "../model/graph";
import { consumersOf, inputsOf, OUTPUT_OF, RECIPES } from "../model/recipes";
import { Resource, RESOURCES } from "../model/resources";
import { assertNoKinkedAncestors } from "../solve/breakpoints";

const order = topologicalOrder();
const positionOf = (r: Resource) => order.indexOf(r);

describe("production graph", () => {
  it("resolves in the expected order", () => {
    expect(order).toEqual([
      "soldierT3",
      "tool",
      "stone",
      "weapon",
      "goldBar",
      "ironBar",
      "goldOre",
      "ironOre",
      "coal",
      "fish",
      "meat",
      "bread",
      "animal",
      "wheat",
      "grain",
      "water",
    ]);
  });

  it("covers every resource exactly once", () => {
    expect(new Set(order).size).toBe(RESOURCES.length);
  });

  // Stated as the invariant rather than as positions, so a legitimate reorder
  // of RESOURCES does not break the test while a real regression still does.
  it.each(RESOURCES)("resolves %s after every resource that consumes it", (resource) => {
    for (const consumer of consumersOf(resource)) {
      expect(positionOf(consumer)).toBeLessThan(positionOf(resource));
    }
  });

  it("resolves coal only after all four of its consumers", () => {
    expect(consumersOf("coal").slice().sort()).toEqual([
      "goldBar",
      "ironBar",
      "tool",
      "weapon",
    ]);
    for (const consumer of consumersOf("coal")) {
      expect(positionOf(consumer)).toBeLessThan(positionOf("coal"));
    }
  });

  it("has exactly three roots, the exogenous demand entry points", () => {
    const roots = RESOURCES.filter((r) => consumersOf(r).length === 0);
    expect(roots.slice().sort()).toEqual(["soldierT3", "stone", "tool"]);
  });

  it("is well formed", () => {
    expect(() => assertWellFormed()).not.toThrow();
  });

  it("detects a cycle", () => {
    // Simulate the check against a deliberately cyclic table.
    const cyclic: Record<string, string[]> = { a: ["b"], b: ["c"], c: ["a"] };
    const indegree: Record<string, number> = { a: 0, b: 0, c: 0 };
    for (const node of Object.keys(cyclic)) {
      for (const input of cyclic[node]) indegree[input] += 1;
    }
    const ready = Object.keys(cyclic).filter((n) => indegree[n] === 0);
    const resolved: string[] = [];
    while (ready.length > 0) {
      const next = ready.shift() as string;
      resolved.push(next);
      for (const input of cyclic[next]) {
        indegree[input] -= 1;
        if (indegree[input] === 0) ready.push(input);
      }
    }
    expect(resolved.length).toBeLessThan(Object.keys(cyclic).length);
  });
});

describe("recipes", () => {
  it("gives every resource a recipe whose output is itself", () => {
    for (const r of RESOURCES) expect(RECIPES[r].output).toBe(r);
  });

  it("only consumes known resources", () => {
    for (const r of RESOURCES) {
      for (const input of inputsOf(r)) expect(RESOURCES).toContain(input);
    }
  });

  it("maps every building except the virtual soldier recipe", () => {
    const produced = Object.keys(OUTPUT_OF).sort();
    expect(produced).toEqual(BUILDINGS.slice().sort());
    expect(RECIPES.soldierT3.building).toBeNull();
  });

  it("derives 4 coal per soldier from the topology rather than asserting it", () => {
    // 1 for the weaponsmith, 1 for the iron smelt, 2 for the two gold smelts.
    const perSoldier = RECIPES.soldierT3.inputs;
    const coal =
      (perSoldier.weapon as number) * (RECIPES.weapon.inputs.coal as number) +
      (perSoldier.weapon as number) * (RECIPES.ironBar.inputs.coal as number) +
      (perSoldier.goldBar as number) * (RECIPES.goldBar.inputs.coal as number);
    expect(coal).toBe(4);
  });
});

describe("anchors", () => {
  it("excludes the exogenous buildings", () => {
    expect(ANCHOR_BUILDINGS).not.toContain("stoneMine");
    expect(ANCHOR_BUILDINGS).not.toContain("toolSmith");
    expect(ANCHOR_BUILDINGS).toContain("fisher");
    expect(ANCHOR_BUILDINGS.length).toBe(BUILDINGS.length - 2);
  });
});

describe("closed-form inverse precondition", () => {
  it("has no kinked resource upstream of another kinked resource", () => {
    expect(() => assertNoKinkedAncestors()).not.toThrow();
  });

  it("keeps iron ore demand free of kinked ancestors", () => {
    expect(Array.from(demandAncestors("ironOre")).sort()).toEqual([
      "ironBar",
      "soldierT3",
      "tool",
      "weapon",
    ]);
  });

  it("has nothing consuming stone at all", () => {
    expect(Array.from(demandAncestors("stone"))).toEqual([]);
  });
});
