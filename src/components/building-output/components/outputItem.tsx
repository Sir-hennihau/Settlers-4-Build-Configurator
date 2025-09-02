import { Grid } from "@mui/material";
import { getPreviewString } from "../../../helpers/getPreviewString";
import { BuildingInfo } from "../../../data/buildings";

interface OutputItemProps {
  building: BuildingInfo;
  requiredAmount: number;
}

export const OutputItem = ({ building, requiredAmount }: OutputItemProps) => {
  const buildingAmountString = getPreviewString(requiredAmount);

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
