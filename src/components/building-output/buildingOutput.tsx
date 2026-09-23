import { Grid, useTheme } from "@mui/material";
import {
  BUILDINGS,
  BUILDING_DISPLAY_NAMES,
} from "../../domain/model/buildings";
import { useSolution } from "../../state/useSolution";
import { buildingColor } from "../../theme/buildingColors";
import { OutputItem } from "./components/outputItem";

/**
 * Displays the sized build, coloured by part of the chain. Iteration order comes
 * from `BUILDINGS` rather than from object key order, and labels come from a
 * total `Record<Building, string>` so a missing one is a compile error rather
 * than a raw key leaking into the UI.
 */
export const BuildingOutput = () => {
  const solution = useSolution();
  const { mode } = useTheme().palette;

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      {BUILDINGS.map((building) => {
        const result = solution.buildings[building];
        const split =
          result.double > 0
            ? `${result.double.toFixed(1)} double + ${result.normal.toFixed(1)} normal`
            : undefined;
        return (
          <OutputItem
            key={building}
            label={BUILDING_DISPLAY_NAMES[building]}
            amount={result.count}
            detail={split}
            color={buildingColor(building, mode)}
          />
        );
      })}
    </Grid>
  );
};
