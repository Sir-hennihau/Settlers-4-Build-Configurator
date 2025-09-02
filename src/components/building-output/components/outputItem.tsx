import { Grid } from "@mui/material";
import { getPreviewString } from "../../../helpers/getPreviewString";
import { selectConfig } from "../../../store/config-store/configSlice";
import { useAppSelector } from "../../../store/hooks";
import { Building } from "../../../types/building";

interface OutputItemProps {
  building: Building;
}

export const OutputItem = ({ building }: OutputItemProps) => {
  // --- STATE ---

  const { soldiersPerMinute } = useAppSelector(selectConfig);

  // --- RENDER ---

  const buildingAmountString = getPreviewString(
    building.multiplier * soldiersPerMinute
  );

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
