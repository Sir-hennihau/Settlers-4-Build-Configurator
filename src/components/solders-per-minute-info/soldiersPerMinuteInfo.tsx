import { Divider, Grid } from "@mui/material";
import { getPreviewString } from "../../helpers/getPreviewString";
import { selectConfig } from "../../store/config-store/configSlice";
import { useAppSelector } from "../../store/hooks";
import { selectBuildingRequirements } from "../../store/building-requirements/buildingRequirementsSlice";
import { getStoneMineRequirements } from "../../store/hooks";

/**
 * Component that displays the calculated T3 soldiers per minute production rate
 * Shows the result of the current building configuration
 */
export const SoldiersPerMinuteInfo = () => {
  const { soldiersPerMinute, selectedCivilization } =
    useAppSelector(selectConfig);
  const buildingRequirements = useAppSelector(selectBuildingRequirements);
  const soldiersPerMinuteString = getPreviewString(soldiersPerMinute);

  // Get stone mine and bakery info
  const stoneMineAmount = buildingRequirements.stoneMines;
  const totalBakeries = buildingRequirements.bakeries;

  const stoneMineReq = getStoneMineRequirements(
    stoneMineAmount,
    selectedCivilization
  );
  const stoneMineBakeries = stoneMineReq.bakeries;
  const coalMineBakeries = Math.max(totalBakeries - stoneMineBakeries, 0);

  // Calculate ratios
  const stoneRatio =
    totalBakeries > 0 ? (stoneMineBakeries / totalBakeries) * 100 : 0;
  const coalRatio =
    totalBakeries > 0 ? (coalMineBakeries / totalBakeries) * 100 : 0;

  return (
    <>
      <Divider sx={{ marginTop: 2 }} />
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item sx={{ fontWeight: "bold" }} xs={8}>
          T3 Soldiers per minute
        </Grid>
        <Grid item sx={{ fontWeight: "bold", textAlign: "right" }} xs={4}>
          {soldiersPerMinuteString}
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={8}>
          Bread usage ratio
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          {`${stoneRatio.toFixed(0)}% stone / ${coalRatio.toFixed(0)}% coal`}
        </Grid>
      </Grid>
    </>
  );
};
