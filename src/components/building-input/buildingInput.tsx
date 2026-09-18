import {
  Alert,
  Collapse,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Container } from "@mui/system";
import { ChangeEvent, useState } from "react";
import {
  ANCHOR_BUILDINGS,
  Building,
  BUILDING_DISPLAY_NAMES,
} from "../../domain/model/buildings";
import { useInputs, useInputsDispatch } from "../../state/InputsContext";
import { useSolution } from "../../state/useSolution";

const numberField = { inputProps: { min: 0 }, type: "number" as const };

/**
 * Collects everything the user specifies. It holds no derived state of its own:
 * every value comes from the inputs reducer and every result from the solver.
 */
export const BuildingInput = () => {
  const inputs = useInputs();
  const dispatch = useInputsDispatch();
  const solution = useSolution();

  // Purely presentational, so it stays out of the inputs reducer.
  const [showStone, setShowStone] = useState(inputs.stone.kind !== "mineCount");
  const [showDoubleIron, setShowDoubleIron] = useState(false);

  const onAnchorBuildingChange = (event: SelectChangeEvent) => {
    dispatch({ type: "setAnchorBuilding", building: event.target.value as Building });
  };

  const onNumber =
    (action: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) =>
      action(event.target.value);

  const isBuildingAnchor = inputs.anchor.kind === "building";
  const showError = !solution.isSufficient;

  return (
    <Container>
      <Stack sx={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={inputs.anchor.kind}
          onChange={(_event, mode) => mode && dispatch({ type: "setAnchorMode", mode })}
        >
          <ToggleButton value="building">I have this many buildings</ToggleButton>
          <ToggleButton value="soldiers">I want this many T3/min</ToggleButton>
        </ToggleButtonGroup>

        {isBuildingAnchor ? (
          <Stack sx={{ flexDirection: "row", alignItems: "flex-start", gap: 2 }}>
            <FormControl sx={{ flex: "1 1 62%" }}>
              <InputLabel id="anchor-building-label">Building</InputLabel>
              <Select
                labelId="anchor-building-label"
                id="anchor-building"
                value={inputs.anchor.building}
                label="Building"
                onChange={onAnchorBuildingChange}
                error={showError}
              >
                {ANCHOR_BUILDINGS.map((building) => (
                  <MenuItem key={building} value={building}>
                    {BUILDING_DISPLAY_NAMES[building]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              {...numberField}
              id="anchor-count"
              label={
                inputs.anchor.building === "ironMine" ? "Amount (total)" : "Amount"
              }
              helperText={
                inputs.anchor.building === "ironMine" && inputs.doubleIronMines > 0
                  ? "Doubles are counted first"
                  : undefined
              }
              sx={{ flex: "1 1 38%" }}
              variant="outlined"
              value={inputs.anchor.count}
              onChange={onNumber((value) => dispatch({ type: "setAnchorCount", value }))}
              error={showError}
            />
          </Stack>
        ) : (
          <TextField
            {...numberField}
            id="soldiers-per-minute"
            label="T3 soldiers per minute"
            variant="outlined"
            value={inputs.anchor.soldiersPerMinute}
            onChange={onNumber((value) =>
              dispatch({ type: "setSoldiersPerMinute", value })
            )}
          />
        )}

        <TextField
          {...numberField}
          id="toolsmiths"
          label="Toolsmiths"
          variant="outlined"
          sx={{ maxWidth: { sm: "58%" } }}
          value={inputs.toolSmiths}
          onChange={onNumber((value) => dispatch({ type: "setToolSmiths", value }))}
        />

        <FormControlLabel
          control={
            <Switch
              checked={showDoubleIron}
              onChange={(_event, checked) => {
                setShowDoubleIron(checked);
                if (!checked) dispatch({ type: "setDoubleIronMines", value: 0 });
              }}
            />
          }
          label="I have double-deposit iron mines"
        />
        <Collapse in={showDoubleIron}>
          <TextField
            {...numberField}
            id="double-iron-mines"
            label="Double iron mines"
            helperText="Same meat, double the ore"
            variant="outlined"
            fullWidth
            value={inputs.doubleIronMines}
            onChange={onNumber((value) =>
              dispatch({ type: "setDoubleIronMines", value })
            )}
          />
        </Collapse>

        <FormControlLabel
          control={
            <Switch
              checked={showStone}
              onChange={(_event, checked) => {
                setShowStone(checked);
                if (!checked) {
                  dispatch({ type: "setStoneMode", mode: "mineCount" });
                  dispatch({ type: "setStoneValue", value: 0 });
                }
              }}
            />
          }
          label="Include stone mining"
        />
        <Collapse in={showStone}>
          <Stack sx={{ gap: 2 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={inputs.stone.kind}
              onChange={(_event, mode) => mode && dispatch({ type: "setStoneMode", mode })}
            >
              <ToggleButton value="mineCount">I have N mines</ToggleButton>
              <ToggleButton value="perMinute">I want N stone/min</ToggleButton>
            </ToggleButtonGroup>

            <Stack sx={{ flexDirection: "row", alignItems: "flex-start", gap: 2 }}>
              <TextField
                {...numberField}
                id="stone-value"
                label={inputs.stone.kind === "mineCount" ? "Stone mines" : "Stone per minute"}
                variant="outlined"
                sx={{ flex: 1 }}
                value={
                  inputs.stone.kind === "mineCount"
                    ? inputs.stone.count
                    : inputs.stone.value
                }
                onChange={onNumber((value) => dispatch({ type: "setStoneValue", value }))}
              />
              <TextField
                {...numberField}
                id="double-stone-mines"
                label={
                  inputs.stone.kind === "mineCount"
                    ? "Of which double"
                    : "Double mines available"
                }
                variant="outlined"
                sx={{ flex: 1 }}
                value={inputs.doubleStoneMines}
                onChange={onNumber((value) =>
                  dispatch({ type: "setDoubleStoneMines", value })
                )}
              />
            </Stack>

            {inputs.stone.kind === "mineCount" && inputs.doubleStoneMines > 0 && (
              <Alert severity="info">
                Double stone mines eat the same bread as ordinary ones, so with a fixed
                mine count they raise stone output without changing any other building.
                Switch to a stone/min target to see them cut the bread cost.
              </Alert>
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Container>
  );
};
