import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { selectConfig } from "../../../store/config-store/configSlice";
import { useAppSelector } from "../../../store/hooks";
import { Building } from "../../../types/building";

interface OutputItemProps {
  building: Building;
}

export const OutputItem = ({ building }: OutputItemProps) => {
  const { amount } = useAppSelector(selectConfig);

  return (
    <>
      <Grid item xs={8}>
        {building.label}{" "}
      </Grid>
      <Grid item xs={4}>
        {building.multiplier * amount}
      </Grid>
    </>
  );
};
