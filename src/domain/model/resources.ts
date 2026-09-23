/**
 * Every resource in the soldier production chain.
 *
 * The declaration order is load-bearing: it is the deterministic tie-break for
 * the topological sort in `graph.ts`, so reordering this array changes the
 * solve order (though not the results). `graph.test.ts` pins the resulting order.
 */
export const RESOURCES = [
  "soldier",
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
] as const;

export type Resource = (typeof RESOURCES)[number];

export const RESOURCE_INDEX: Readonly<Record<Resource, number>> =
  Object.fromEntries(RESOURCES.map((r, i) => [r, i])) as Record<Resource, number>;

/** A sparse map of resource -> amount (units per minute unless stated otherwise). */
export type ResourceVector = Partial<Record<Resource, number>>;

export const zeroResourceRecord = (): Record<Resource, number> =>
  Object.fromEntries(RESOURCES.map((r) => [r, 0])) as Record<Resource, number>;
