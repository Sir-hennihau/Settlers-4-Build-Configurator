// All civilization production configurations
import { CivilizationProductionRate } from "../types/production";
import { romansProductionConfig } from "./romansConfig";
import { vikingsProductionConfig } from "./vikingsConfig";

export type CivilizationType = "romans" | "vikings";

export const civilizationsConfig: Record<
  CivilizationType,
  CivilizationProductionRate
> = {
  romans: romansProductionConfig,
  vikings: vikingsProductionConfig,
};

export const CIVILIZATION_DISPLAY_NAMES: Record<CivilizationType, string> = {
  romans: "Romans",
  vikings: "Vikings",
};
