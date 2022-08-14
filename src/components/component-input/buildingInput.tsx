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
import { ChangeEvent, useState } from "react";
import { BUILDINGS } from "../../data/buildings";
import { selectConfig, setAmount } from "../../store/config-store/configSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface BuildingInputProps {}

export const BuildingInput = ({}: BuildingInputProps) => {
  const { amount } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  const [selectedBuilding, setSelectedBuilding] = useState(
    JSON.stringify(BUILDINGS[0])
  );

  const onInputChange = (event: SelectChangeEvent) => {
    setSelectedBuilding(event.target.value);
  };

  const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(event.target.value);
    if (!Number.isInteger(newAmount)) return;

    dispatch(setAmount(newAmount));
  };

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
          onChange={onAmountChange}
          sx={{ marginLeft: 2 }}
          variant="outlined"
          value={amount}
        />
      </Stack>
    </Container>
  );
};
