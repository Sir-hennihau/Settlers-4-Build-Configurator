import { Grid } from "@mui/material";
import { OutputItem } from "./components/outputItem";
import { BUILDINGS } from "../../data/buildings";
import { useAppSelector } from "../../store/hooks";
import { selectBuildingSelection } from "../../store/building-selection/buildingSelectionSlice";
import { selectConfig } from "../../store/config-store/configSlice";
import { calculateProductionRequirements } from "../../helpers/calculateProductionRequirements";

export const BuildingOutput = () => {
  const { selectedBuilding, buildingAmount } = useAppSelector(
    selectBuildingSelection
  );
  const { productionChain } = useAppSelector(selectConfig);

  // Calculate required amounts for each building
  const requirements = selectedBuilding
    ? calculateProductionRequirements(
        selectedBuilding,
        buildingAmount,
        productionChain
      )
    : {};

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      {BUILDINGS.map((building) => {
        const requiredAmount = requirements[building.type] || 0;
        return (
          <OutputItem
            building={building}
            requiredAmount={requiredAmount}
            key={building.type}
          />
        );
      })}
    </Grid>
  );
};
