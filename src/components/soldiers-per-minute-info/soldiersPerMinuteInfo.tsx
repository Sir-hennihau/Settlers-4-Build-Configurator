import { Alert, Box, Stack, Typography } from "@mui/material";
import { BUILDING_DISPLAY_NAMES } from "../../domain/model/buildings";
import { getPreviewString } from "../../helpers/getPreviewString";
import { useInputs } from "../../state/InputsContext";
import { useSolution } from "../../state/useSolution";
import { accent } from "../../theme/chains";
import { Hue } from "../../theme/palette";

/** A label over a value; the value is always the label's last sibling. */
const Stat = ({
  label,
  value,
  hue,
  large = false,
}: {
  label: string;
  value: number | string;
  hue: Hue;
  large?: boolean;
}) => {
  const colors = accent(hue);
  return (
    <Box
      sx={{
        backgroundColor: large ? "transparent" : colors.tint,
        border: large ? 0 : 1,
        borderColor: colors.border,
        borderRadius: 2,
        paddingX: large ? 0 : 1.5,
        paddingY: large ? 0 : 0.75,
      }}
    >
      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color: colors.strong,
          fontWeight: 800,
          fontSize: large ? "2.5rem" : "1.5rem",
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

/**
 * The headline result, plus anything the solver wants to flag. Green is
 * reserved for the soldier rate; within the gold-cap split, level 3 takes the
 * gold chain's yellow and level 1 stays neutral, since it needs no gold.
 *
 * The bread split comes straight out of the solver's per-consumer
 * contributions, so it cannot drift from the numbers below it.
 */
export const SoldiersPerMinuteInfo = () => {
  const solution = useSolution();
  const { maxGoldMines } = useInputs();
  const hasGoldCap = maxGoldMines !== null;

  const bread = solution.contributions.bread;
  const fromCoal = bread.coal ?? 0;
  const fromStone = bread.stone ?? 0;
  const totalBread = fromCoal + fromStone;
  const stoneShare = totalBread > 0 ? (fromStone / totalBread) * 100 : 0;
  const coalShare = totalBread > 0 ? (fromCoal / totalBread) * 100 : 0;

  const stoneOutput = solution.buildings.stoneMine.outputPerMinute;
  const green = accent("green");

  return (
    <Stack sx={{ gap: 1.5, marginTop: 2 }}>
      <Box
        component="section"
        aria-label="Result"
        sx={{
          backgroundColor: green.tint,
          border: 2,
          borderColor: solution.isSufficient ? green.bar : "error.main",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1.5,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Stat
              large
              hue="green"
              label={hasGoldCap ? "Soldiers per minute" : "T3 Soldiers per minute"}
              value={getPreviewString(solution.soldiersPerMinute)}
            />
          </Box>
          {hasGoldCap && (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, flex: 1 }}>
              <Stat
                hue="yellow"
                label="Level 3 soldiers"
                value={getPreviewString(solution.soldierLevels.level3)}
              />
              <Stat
                hue="neutral"
                label="Level 1 soldiers"
                value={getPreviewString(solution.soldierLevels.level1)}
              />
            </Box>
          )}
        </Stack>

        <Stack
          sx={{
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 3,
            rowGap: 0.5,
            marginTop: 1.5,
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            Bread: {stoneShare.toFixed(0)}% stone / {coalShare.toFixed(0)}% coal
          </Typography>
          {stoneOutput > 0 && (
            <Typography variant="body2">
              Stone per minute: {getPreviewString(stoneOutput)}
            </Typography>
          )}
        </Stack>
      </Box>

      {solution.warnings.map((warning, index) => {
        if (warning.kind === "insufficientForOverhead") {
          return (
            <Alert severity="error" key={index}>
              {getPreviewString(warning.required)}{" "}
              {BUILDING_DISPLAY_NAMES[warning.building]} are needed just to feed the
              toolsmiths and stone mines, so {getPreviewString(warning.entered)}{" "}
              supports no soldiers at all.
            </Alert>
          );
        }
        if (warning.kind === "idleDoubleMines") {
          // Idle doubles consume nothing, so this is information, not an error.
          return (
            <Alert severity="info" key={index}>
              {getPreviewString(warning.idle)} of your double{" "}
              {BUILDING_DISPLAY_NAMES[warning.building].toLowerCase()} are not needed
              at this target — {getPreviewString(warning.spareOutputPerMinute)} spare
              output per minute.
            </Alert>
          );
        }
        return (
          <Alert severity="warning" key={index}>
            {BUILDING_DISPLAY_NAMES[warning.building]} do not constrain the soldier
            target{hasGoldCap ? " beyond the gold mine cap" : ""}, so no rate can be
            derived from them. Anchor on another building.
          </Alert>
        );
      })}
    </Stack>
  );
};
