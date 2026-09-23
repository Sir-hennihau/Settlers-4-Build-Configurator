import { Building, BUILDINGS } from "../domain/model/buildings";
import { Hue, PALETTE } from "./palette";

/**
 * Buildings grouped the way a player builds them: each chain runs from the food
 * that feeds a mine to the smelter behind it. One hue per chain, used for the
 * matching input section and output card alike, so a colour always means the
 * same resource at a glance — gold is yellow wherever it appears.
 */
export type ChainId = "farming" | "coal" | "iron" | "gold" | "smiths" | "stone";

export interface Chain {
  readonly id: ChainId;
  readonly label: string;
  readonly hue: Hue;
  /** Hidden in the output while every building in it is zero. */
  readonly optional?: boolean;
}

export const CHAINS: readonly Chain[] = [
  { id: "farming", label: "Farming", hue: "lime" },
  { id: "coal", label: "Bread & coal", hue: "neutral" },
  { id: "iron", label: "Meat & iron", hue: "blue" },
  { id: "gold", label: "Fish & gold", hue: "yellow" },
  { id: "smiths", label: "Smiths", hue: "violet" },
  { id: "stone", label: "Stone", hue: "teal", optional: true },
];

/** Total over `Building`, so a new building without a chain is a compile error. */
export const CHAIN_OF: Readonly<Record<Building, ChainId>> = {
  grainFarm: "farming",
  waterworks: "farming",
  mill: "coal",
  bakery: "coal",
  coalMine: "coal",
  animalRanch: "iron",
  butcher: "iron",
  ironMine: "iron",
  ironSmelt: "iron",
  fisher: "gold",
  goldMine: "gold",
  goldSmelt: "gold",
  weaponSmith: "smiths",
  toolSmith: "smiths",
  stoneMine: "stone",
};

/** A chain's buildings in `BUILDINGS` order. */
export const buildingsOf = (chain: ChainId): Building[] =>
  BUILDINGS.filter((building) => CHAIN_OF[building] === chain);

export const chainById = (id: ChainId): Chain =>
  CHAINS.find((chain) => chain.id === id) as Chain;

/** The few shades each accent needs, picked so text stays readable on the tint. */
export const accent = (hue: Hue) => {
  const shades = PALETTE[hue];
  return {
    tint: shades[50],
    border: shades[200],
    bar: hue === "neutral" ? shades[700] : shades[500],
    text: shades[800],
    strong: shades[900],
  };
};
