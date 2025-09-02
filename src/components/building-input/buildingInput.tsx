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
import {
  setSoldiersPerMinute,
  selectConfig,
} from "../../store/config-store/configSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { BuildingProductionRate } from "../../types/building";
import { getBuildingsForCivilization } from "../../data/civilizationBuildings";
import { getBuildingMultiplier } from "../../helpers/buildingCalculations";

export const BuildingInput = () => {
  // --- STATE ---

  const dispatch = useAppDispatch();
  const { selectedCivilization } = useAppSelector(selectConfig);
  const buildings = getBuildingsForCivilization(selectedCivilization);

  const [buildingAmount, setBuildingAmount] = useState(1);

  // Find Grain Farm as default, fallback to first building if not found
  const getDefaultBuilding = () => {
    const grainFarm = buildings.find((b) => b.label === "Grain Farm");
    return grainFarm
      ? JSON.stringify(grainFarm)
      : buildings.length > 0
      ? JSON.stringify(buildings[0])
      : "";
  };

  const [selectedBuilding, setSelectedBuilding] = useState(
    getDefaultBuilding()
  );

  // --- EFFECTS ---

  useEffect(() => {
    if (buildings.length > 0 && !selectedBuilding) {
      const grainFarm = buildings.find((b) => b.label === "Grain Farm");
      const defaultBuilding = grainFarm
        ? JSON.stringify(grainFarm)
        : buildings.length > 0
        ? JSON.stringify(buildings[0])
        : "";
      setSelectedBuilding(defaultBuilding);
    }
  }, [buildings, selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding) {
      const parsedSelectedBuilding = JSON.parse(
        selectedBuilding
      ) as BuildingProductionRate;
      const multiplier = getBuildingMultiplier(
        parsedSelectedBuilding.label,
        selectedCivilization
      );

      if (multiplier > 0) {
        const newSoldiersPerMinute = buildingAmount / multiplier;
        dispatch(setSoldiersPerMinute(newSoldiersPerMinute));
      }
    }
  }, [selectedBuilding, buildingAmount, selectedCivilization, dispatch]);

  // --- CALLBACKS ---

  const onInputChange = (event: SelectChangeEvent) => {
    setSelectedBuilding(event.target.value);
  };

  const onBuildingAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBuildingAmount = Number(event.target.value);
    if (!Number.isInteger(newBuildingAmount)) return;

    setBuildingAmount(newBuildingAmount);
  };

  // --- RENDER ---

  return (
    <Container>
      <Stack sx={{ flexDirection: "row" }}>
        <FormControl fullWidth>
          <InputLabel>Building</InputLabel>
          <Select
            value={selectedBuilding}
            label="Building"
            onChange={onInputChange}
          >
            {buildings.map((building) => (
              <MenuItem key={building.label} value={JSON.stringify(building)}>
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
          value={buildingAmount}
        />
      </Stack>
    </Container>
  );
};
