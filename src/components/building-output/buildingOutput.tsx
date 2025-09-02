import { Grid } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectBuildingRequirements } from "../../store/building-requirements/buildingRequirementsSlice";
import { OutputItem } from "./components/outputItem";

// Define building display names
const BUILDING_DISPLAY_NAMES: { [key: string]: string } = {
  grainFarms: "Grain Farms",
  animalFarms: "Animal Farms",
  waterworks: "Waterworks",
  mills: "Mills",
  bakeries: "Bakeries",
  butchers: "Butchers",
  coalMines: "Coal Mines",
  ironMines: "Iron Mines",
  goldMines: "Gold Mines",
  goldSmelts: "Gold Smelts",
  ironSmelts: "Iron Smelts",
  weaponSmiths: "Weapon Smiths",
};

export const BuildingOutput = () => {
  const buildingRequirements = useAppSelector(selectBuildingRequirements);

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      {Object.entries(buildingRequirements).map(([buildingKey, amount]) => (
        <OutputItem
          key={buildingKey}
          building={{
            label: BUILDING_DISPLAY_NAMES[buildingKey] || buildingKey,
            multiplier: amount,
          }}
        />
      ))}
    </Grid>
  );
};
