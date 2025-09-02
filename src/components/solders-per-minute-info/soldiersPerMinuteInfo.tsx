import { Divider, Grid } from "@mui/material";
import { getPreviewString } from "../../helpers/getPreviewString";
import { selectConfig } from "../../store/config-store/configSlice";
import { selectBuildingSelection } from "../../store/building-selection/buildingSelectionSlice";
import { useAppSelector } from "../../store/hooks";
import { calculateProductionRequirements } from "../../helpers/calculateProductionRequirements";
import { romasProductionConfig } from "../../data/romasConfig";

export const SoldiersPerMinuteInfo = () => {
  // --- STATE ---

  const { productionChain } = useAppSelector(selectConfig);
  const { selectedBuilding, buildingAmount } = useAppSelector(
    selectBuildingSelection
  );

  // Calculate soldiers per minute based on the production chain
  let soldiersPerMinute = 0;

  if (selectedBuilding) {
    const requirements = calculateProductionRequirements(
      selectedBuilding,
      buildingAmount,
      productionChain
    );

    // Find if weaponSmith and goldSmelt are in the requirements (needed for soldiers)
    const weaponSmithAmount = requirements["weaponSmith"] || 0;
    const goldSmeltAmount = requirements["goldSmelt"] || 0;

    if (weaponSmithAmount > 0 && goldSmeltAmount > 0) {
      // Calculate soldiers per minute based on weapon and gold production
      // 1 weapon + 2 gold bars = 1 soldier
      const weaponsPerMinute =
        weaponSmithAmount * romasProductionConfig.weaponSmith.out;
      const goldBarsPerMinute =
        goldSmeltAmount * romasProductionConfig.goldSmelt.out;

      // Limiting factor determines soldiers per minute
      soldiersPerMinute = Math.min(weaponsPerMinute, goldBarsPerMinute / 2);
    }
  }

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
