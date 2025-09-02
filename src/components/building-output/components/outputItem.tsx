import { Grid } from "@mui/material";
import { getPreviewString } from "../../../helpers/getPreviewString";
import { Building } from "../../../types/building";

interface OutputItemProps {
  building: Building;
}

/**
 * Component that displays a single building requirement item
 * Shows the building name and required quantity
 */
export const OutputItem = ({ building }: OutputItemProps) => {
  const buildingAmountString = getPreviewString(building.multiplier);

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
