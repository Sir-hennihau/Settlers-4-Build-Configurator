import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { ChangeEvent } from "react";
import { selectConfig, setAmount } from "../../store/config-store/configSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface BuildingInputProps {}

export const BuildingInput = ({}: BuildingInputProps) => {
  const { amount } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  const onInputChange = () => {};

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
          <Select value={1} label="Building" onChange={onInputChange}>
            <MenuItem value={1}>Grain Farm</MenuItem>
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
