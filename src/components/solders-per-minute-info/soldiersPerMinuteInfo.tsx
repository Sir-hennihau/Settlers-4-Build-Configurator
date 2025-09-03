import { Divider, Grid } from "@mui/material";
import { getPreviewString } from "../../helpers/getPreviewString";
import { selectConfig } from "../../store/config-store/configSlice";
import { useAppSelector } from "../../store/hooks";

/**
 * Component that displays the calculated T3 soldiers per minute production rate
 * Shows the result of the current building configuration
 */
export const SoldiersPerMinuteInfo = () => {
  const { soldiersPerMinute } = useAppSelector(selectConfig);
  const soldiersPerMinuteString = getPreviewString(soldiersPerMinute);

  return (
    <>
      <Divider sx={{ marginTop: 2 }} />
      <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 2 }}>
        <Grid item sx={{ fontWeight: "bold" }} xs={8}>
          T3 Soldiers per minute
        </Grid>
        <Grid item sx={{ fontWeight: "bold", textAlign: "right" }} xs={4}>
          {soldiersPerMinuteString}
        </Grid>
      </Grid>
    </>
  );
};
