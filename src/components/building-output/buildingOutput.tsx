import { Box, Stack } from "@mui/material";
import { BUILDING_DISPLAY_NAMES } from "../../domain/model/buildings";
import { useSolution } from "../../state/useSolution";
import { accent, buildingsOf, CHAINS } from "../../theme/chains";
import { AccentSection } from "../accent-section/accentSection";
import { OutputItem } from "./components/outputItem";

/**
 * Displays the sized build, one card per production chain, in the same colours
 * as the inputs that drive them. Labels come from a total
 * `Record<Building, string>` so a missing one is a compile error rather than a
 * raw key leaking into the UI.
 */
export const BuildingOutput = () => {
  const solution = useSolution();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        alignItems: "start",
        gap: 1.5,
        marginTop: 2,
      }}
    >
      {CHAINS.map((chain) => {
        const buildings = buildingsOf(chain.id);
        if (chain.optional && buildings.every((b) => solution.buildings[b].count <= 0)) {
          return null;
        }
        const colors = accent(chain.hue);
        return (
          <AccentSection key={chain.id} chain={chain.id} sx={{ paddingBottom: 1 }}>
            <Stack sx={{ gap: 0.5 }}>
              {buildings.map((building) => {
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
                    color={colors.strong}
                  />
                );
              })}
            </Stack>
          </AccentSection>
        );
      })}
    </Box>
  );
};
