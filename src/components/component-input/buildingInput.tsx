import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import React from "react";

interface BuildingInputProps {}

export const BuildingInput = ({}: BuildingInputProps) => {
  const onInputChange = () => {};

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
          sx={{ marginLeft: 2 }}
          variant="outlined"
        />
      </Stack>
    </Container>
  );
};
