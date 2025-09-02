import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { ChangeEvent, useEffect, useState } from "react";
import { BUILDINGS, BuildingInfo } from "../../data/buildings";
import {
  setSelectedBuilding,
  setBuildingAmount,
} from "../../store/building-selection/buildingSelectionSlice";
import { useAppDispatch } from "../../store/hooks";
import { BuildingType } from "../../types/production";

export const BuildingInput = () => {
  // --- STATE ---

  const dispatch = useAppDispatch();

  const [localBuildingAmount, setLocalBuildingAmount] = useState(1);
  const [localSelectedBuilding, setLocalSelectedBuilding] =
    useState<BuildingType>("grainFarm");

  // --- EFFECTS ---

  useEffect(() => {
    // Initialize Redux state with default values
    dispatch(setSelectedBuilding("grainFarm"));
    dispatch(setBuildingAmount(1));
  }, [dispatch]);

  useEffect(() => {
    // Update Redux when local state changes
    dispatch(setSelectedBuilding(localSelectedBuilding));
    dispatch(setBuildingAmount(localBuildingAmount));
  }, [localSelectedBuilding, localBuildingAmount, dispatch]);

  // --- CALLBACKS ---

  const onInputChange = (event: SelectChangeEvent) => {
    const buildingType = event.target.value as BuildingType;
    setLocalSelectedBuilding(buildingType);
  };

  const onBuildingAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBuildingAmount = Number(event.target.value);
    if (!Number.isInteger(newBuildingAmount) || newBuildingAmount < 1) return;

    setLocalBuildingAmount(newBuildingAmount);
  };

  // --- RENDER ---

  return (
    <Container>
      <Stack sx={{ flexDirection: "row" }}>
        <FormControl fullWidth>
          <InputLabel>Building</InputLabel>
          <Select
            value={localSelectedBuilding}
            label="Building"
            onChange={onInputChange}
          >
            {BUILDINGS.map((building: BuildingInfo) => (
              <MenuItem key={building.type} value={building.type}>
                {building.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id="outlined-basic"
          label="Amount"
          onChange={onBuildingAmountChange}
          sx={{ marginLeft: 2 }}
          variant="outlined"
          value={localBuildingAmount}
        />
      </Stack>
    </Container>
  );
};
