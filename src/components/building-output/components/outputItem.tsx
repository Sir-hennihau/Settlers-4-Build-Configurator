import { Grid } from "@mui/material";
import { getPreviewString } from "../../../helpers/getPreviewString";
import { selectConfig } from "../../../store/config-store/configSlice";
import { useAppSelector } from "../../../store/hooks";
import { BuildingProductionRate } from "../../../types/building";
import { getBuildingMultiplier } from "../../../helpers/buildingCalculations";

interface OutputItemProps {
  building: BuildingProductionRate;
}

export const OutputItem = ({ building }: OutputItemProps) => {
  // --- STATE ---

  const { soldiersPerMinute, selectedCivilization } =
    useAppSelector(selectConfig);

  // --- RENDER ---

  const multiplier = getBuildingMultiplier(
    building.label,
    selectedCivilization
  );
  const buildingAmountString = getPreviewString(multiplier * soldiersPerMinute);

  return (
    <>
      <Grid item xs={8}>
        {building.label}
      </Grid>
      <Grid item xs={4}>
        {buildingAmountString}
      </Grid>
    </>
  );
};
