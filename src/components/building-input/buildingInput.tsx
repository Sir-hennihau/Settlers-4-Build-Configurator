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
import { BUILDINGS } from "../../data/buildings";
import { setSoldiersPerMinute } from "../../store/config-store/configSlice";
import { useAppDispatch } from "../../store/hooks";
import { Building } from "../../types/building";

export const BuildingInput = () => {
  // --- STATE ---

  const dispatch = useAppDispatch();

  const [buildingAmount, setBuildingAmount] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState(
    JSON.stringify(BUILDINGS[0])
  );

  // --- EFFECTS ---

  useEffect(() => {
    const parsedSelectedBuilding = JSON.parse(selectedBuilding) as Building;

    const newSoldiersPerMinute =
      buildingAmount / parsedSelectedBuilding.multiplier;
    dispatch(setSoldiersPerMinute(newSoldiersPerMinute));
  }, [selectedBuilding, buildingAmount]);

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
            {BUILDINGS.map((building) => (
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
