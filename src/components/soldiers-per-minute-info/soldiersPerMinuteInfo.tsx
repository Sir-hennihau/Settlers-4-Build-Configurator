import { Alert, Divider, Grid, Stack } from "@mui/material";
import { BUILDING_DISPLAY_NAMES } from "../../domain/model/buildings";
import { getPreviewString } from "../../helpers/getPreviewString";
import { useInputs } from "../../state/InputsContext";
import { useSolution } from "../../state/useSolution";

const Row = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <Grid container spacing={2} sx={{ marginTop: 1 }}>
    <Grid item xs={8} sx={{ fontWeight: bold ? "bold" : undefined }}>
      {label}
    </Grid>
    <Grid item xs={4} sx={{ textAlign: "right", fontWeight: bold ? "bold" : undefined }}>
      {value}
    </Grid>
  </Grid>
);

/**
 * The summary line, plus anything the solver wants to flag.
 *
 * The bread split used to be recomputed here from a second copy of the stone
 * chain. It now comes straight out of the solver's per-consumer contributions,
 * so it cannot drift from the numbers above it.
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

  return (
    <>
      <Divider sx={{ marginTop: 2 }} />

      {hasGoldCap ? (
        <>
          <Row
            label="Soldiers per minute"
            value={String(getPreviewString(solution.soldiersPerMinute))}
            bold
          />
          <Row
            label="Level 3 soldiers"
            value={String(getPreviewString(solution.soldierLevels.level3))}
          />
          <Row
            label="Level 1 soldiers"
            value={String(getPreviewString(solution.soldierLevels.level1))}
          />
        </>
      ) : (
        <Row
          label="T3 Soldiers per minute"
          value={String(getPreviewString(solution.soldiersPerMinute))}
          bold
        />
      )}
      <Row
        label="Bread usage ratio"
        value={`${stoneShare.toFixed(0)}% stone / ${coalShare.toFixed(0)}% coal`}
      />
      {stoneOutput > 0 && (
        <Row label="Stone per minute" value={String(getPreviewString(stoneOutput))} />
      )}

      <Stack sx={{ gap: 1, marginTop: 2 }}>
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
    </>
  );
};
