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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import {
  ANCHOR_BUILDINGS,
  Building,
  BUILDING_DISPLAY_NAMES,
} from "../../domain/model/buildings";
import { useInputs, useInputsDispatch } from "../../state/InputsContext";
import { useSolution } from "../../state/useSolution";
import { NumberField } from "../number-field/numberField";

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

  const onAnchorBuildingChange = (event: SelectChangeEvent) => {
    dispatch({ type: "setAnchorBuilding", building: event.target.value as Building });
  };

  const showError = !solution.isSufficient;
  const hasGoldCap = inputs.maxGoldMines !== null;

  return (
    <Container>
      <Stack sx={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
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

          <NumberField
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
            value={inputs.anchor.count}
            onValueChange={(value) => dispatch({ type: "setAnchorCount", value })}
            error={showError}
          />
        </Stack>

        <Stack sx={{ flexDirection: "row", alignItems: "flex-start", gap: 2 }}>
          <NumberField
            id="toolsmiths"
            label="Toolsmiths"
            sx={{ flex: 1 }}
            value={inputs.toolSmiths}
            onValueChange={(value) => dispatch({ type: "setToolSmiths", value })}
          />
          <NumberField
            id="double-iron-mines"
            label="Double iron mines"
            helperText="Same meat, double the ore"
            sx={{ flex: 1 }}
            value={inputs.doubleIronMines}
            onValueChange={(value) => dispatch({ type: "setDoubleIronMines", value })}
          />
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={hasGoldCap}
              onChange={(_event, checked) =>
                dispatch(
                  checked
                    ? {
                        type: "setMaxGoldMines",
                        // Start from what the build needs now, so nothing jumps.
                        value: Math.ceil(solution.buildings.goldMine.count),
                      }
                    : { type: "clearMaxGoldMines" }
                )
              }
            />
          }
          label="The map limits gold mines"
        />
        <Collapse in={hasGoldCap}>
          <NumberField
            id="max-gold-mines"
            label="Max gold mines"
            helperText="Gold goes to level 3 soldiers first; the rest are level 1 soldiers"
            fullWidth
            value={inputs.maxGoldMines ?? 0}
            onValueChange={(value) => dispatch({ type: "setMaxGoldMines", value })}
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
              <NumberField
                id="stone-value"
                label={inputs.stone.kind === "mineCount" ? "Stone mines" : "Stone per minute"}
                sx={{ flex: 1 }}
                value={
                  inputs.stone.kind === "mineCount"
                    ? inputs.stone.count
                    : inputs.stone.value
                }
                onValueChange={(value) => dispatch({ type: "setStoneValue", value })}
              />
              <NumberField
                id="double-stone-mines"
                label={
                  inputs.stone.kind === "mineCount"
                    ? "Of which double"
                    : "Double mines available"
                }
                sx={{ flex: 1 }}
                value={inputs.doubleStoneMines}
                onValueChange={(value) => dispatch({ type: "setDoubleStoneMines", value })}
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
