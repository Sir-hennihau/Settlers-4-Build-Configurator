export type CivilizationType = "romans" | "vikings" | "maya" | "trojans";

export interface Civilization {
  id: CivilizationType;
  name: string;
  displayName: string;
}

export const CIVILIZATIONS: Civilization[] = [
  { id: "romans", name: "romans", displayName: "Romans" },
  { id: "vikings", name: "vikings", displayName: "Vikings" },
  { id: "maya", name: "maya", displayName: "Maya" },
  { id: "trojans", name: "trojans", displayName: "Trojans" },
];
