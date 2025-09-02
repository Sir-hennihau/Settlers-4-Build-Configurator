import { Divider, Grid } from "@mui/material";
import { getPreviewString } from "../../helpers/getPreviewString";
import { selectConfig } from "../../store/config-store/configSlice";
import { useAppSelector } from "../../store/hooks";

export const SoldiersPerMinuteInfo = () => {
  // --- STATE ---

  const { soldiersPerMinute } = useAppSelector(selectConfig);

  // --- RENDER ---

  const soldiersPerMinuteString = getPreviewString(soldiersPerMinute);

  return (
    <>
      <Divider sx={{ marginTop: 2 }} />
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item sx={{ fontWeight: "bold" }} xs={8}>
          Soldiers per minute
        </Grid>
        <Grid item sx={{ fontWeight: "bold" }} xs={4}>
          {soldiersPerMinuteString}
        </Grid>
      </Grid>
    </>
  );
};
