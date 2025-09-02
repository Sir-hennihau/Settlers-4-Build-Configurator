// All civilization production configurations
import { CivilizationProductionRate } from "../types/production";
import { romansProductionConfig } from "./romansConfig";
import { vikingsProductionConfig } from "./vikingsConfig";
import { mayaProductionConfig } from "./mayaConfig";
import { trojansProductionConfig } from "./trojansConfig";

export type CivilizationType = "romans" | "vikings" | "maya" | "trojans";

export const civilizationsConfig: Record<
  CivilizationType,
  CivilizationProductionRate
> = {
  romans: romansProductionConfig,
  vikings: vikingsProductionConfig,
  maya: mayaProductionConfig,
  trojans: trojansProductionConfig,
};

export const CIVILIZATION_DISPLAY_NAMES: Record<CivilizationType, string> = {
  romans: "Romans",
  vikings: "Vikings",
  maya: "Maya",
  trojans: "Trojans",
};
