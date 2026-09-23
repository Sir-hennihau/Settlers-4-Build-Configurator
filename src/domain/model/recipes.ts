import { Building } from "./buildings";
import { Resource, RESOURCES, ResourceVector } from "./resources";

/**
 * One node of the production graph: what a building turns into what, as an
 * exact integer ratio.
 *
 * These ratios are *civilization-independent*. That is not an assumption; it is
 * verified against the game's ticks-per-resource table for all four civs, where
 * e.g. the Roman iron mine satisfies 4 x 1080 ticks-in = 15 x 288 ticks-out
 * exactly. Because the ratios are shared, a civilization needs only one number
 * per building (its cycle length) and every input rate is derived — see
 * `rates.ts`.
 *
 * `outputQty` is a ratio numerator, NOT a batch size. The coal mine's recipe is
 * 15 coal per 2 bread, but its production *cycle* yields one coal. Batch size
 * lives in `BuildingTiming.unitsPerCycle` and matters only for the animal ranch.
 */
export interface Recipe {
  readonly output: Resource;
  readonly outputQty: number;
  readonly inputs: Readonly<ResourceVector>;
  /** `null` for the virtual soldier recipe, which no building produces. */
  readonly building: Building | null;
}

export const RECIPES: Readonly<Record<Resource, Recipe>> = {
  // A fully equipped (T3) soldier is 1 weapon + 2 gold bars; when the map caps
  // gold, the soldier allocator withholds gold and the rest drop to level 1.
  // Modelling it as a recipe rather than a hand-rolled root is what lets the
  // graph code have no special cases.
  soldier: { output: "soldier", outputQty: 1, inputs: { weapon: 1, goldBar: 2 }, building: null },

  weapon: { output: "weapon", outputQty: 1, inputs: { ironBar: 1, coal: 1 }, building: "weaponSmith" },
  tool: { output: "tool", outputQty: 1, inputs: { ironBar: 1, coal: 1 }, building: "toolSmith" },
  ironBar: { output: "ironBar", outputQty: 1, inputs: { ironOre: 1, coal: 1 }, building: "ironSmelt" },
  goldBar: { output: "goldBar", outputQty: 1, inputs: { goldOre: 1, coal: 1 }, building: "goldSmelt" },

  coal: { output: "coal", outputQty: 15, inputs: { bread: 2 }, building: "coalMine" },
  ironOre: { output: "ironOre", outputQty: 15, inputs: { meat: 4 }, building: "ironMine" },
  goldOre: { output: "goldOre", outputQty: 45, inputs: { fish: 16 }, building: "goldMine" },
  stone: { output: "stone", outputQty: 15, inputs: { bread: 4 }, building: "stoneMine" },

  meat: { output: "meat", outputQty: 1, inputs: { animal: 1 }, building: "butcher" },
  bread: { output: "bread", outputQty: 1, inputs: { wheat: 1, water: 1 }, building: "bakery" },
  animal: { output: "animal", outputQty: 3, inputs: { grain: 4, water: 4 }, building: "animalRanch" },
  wheat: { output: "wheat", outputQty: 1, inputs: { grain: 1 }, building: "mill" },

  grain: { output: "grain", outputQty: 1, inputs: {}, building: "grainFarm" },
  water: { output: "water", outputQty: 1, inputs: {}, building: "waterworks" },
  fish: { output: "fish", outputQty: 1, inputs: {}, building: "fisher" },
};

export const inputsOf = (r: Resource): Resource[] =>
  Object.keys(RECIPES[r].inputs) as Resource[];

/** Resources whose recipe consumes `r` — i.e. everything that creates demand for it. */
const CONSUMERS: Readonly<Record<Resource, Resource[]>> = (() => {
  const out = Object.fromEntries(RESOURCES.map((r) => [r, [] as Resource[]])) as Record<
    Resource,
    Resource[]
  >;
  for (const r of RESOURCES) {
    for (const input of inputsOf(r)) out[input].push(r);
  }
  return out;
})();

export const consumersOf = (r: Resource): readonly Resource[] => CONSUMERS[r];

export const producerOf = (r: Resource): Building | null => RECIPES[r].building;

/** Maps each building back to the resource it produces. */
export const OUTPUT_OF: Readonly<Partial<Record<Building, Resource>>> = (() => {
  const out: Partial<Record<Building, Resource>> = {};
  for (const r of RESOURCES) {
    const b = RECIPES[r].building;
    if (b) out[b] = r;
  }
  return out;
})();
