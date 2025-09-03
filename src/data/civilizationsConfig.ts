import { CivilizationProductionRate } from "../types/production";
import { romansProductionConfig } from "./romansConfig";
import { vikingsProductionConfig } from "./vikingsConfig";
import { mayaProductionConfig } from "./mayaConfig";
import { trojansProductionConfig } from "./trojansConfig";

/** Available civilization types */
export type CivilizationType = "romans" | "vikings" | "maya" | "trojans";

/** Production configurations for all supported civilizations */
export const civilizationsConfig: Record<
  CivilizationType,
  CivilizationProductionRate
> = {
  romans: romansProductionConfig,
  vikings: vikingsProductionConfig,
  maya: mayaProductionConfig,
  trojans: trojansProductionConfig,
};

/** Display names for civilization types */
export const CIVILIZATION_DISPLAY_NAMES: Record<CivilizationType, string> = {
  romans: "Romans",
  vikings: "Vikings",
  maya: "Maya",
  trojans: "Trojans",
};
