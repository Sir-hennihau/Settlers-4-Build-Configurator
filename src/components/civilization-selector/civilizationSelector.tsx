import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  CIVILIZATIONS,
  CIVILIZATION_IDS,
  CivilizationId,
} from "../../domain/data/civilizations";
import { useInputs, useInputsDispatch } from "../../state/InputsContext";

/**
 * Picks the civilization. Every production rate in the app is keyed off this.
 */
export const CivilizationSelector = () => {
  const { civilization } = useInputs();
  const dispatch = useInputsDispatch();

  const onChange = (event: SelectChangeEvent) => {
    dispatch({
      type: "setCivilization",
      civilization: event.target.value as CivilizationId,
    });
  };

  return (
    <Container sx={{ marginBottom: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="civilization-label">Civilization</InputLabel>
        <Select
          labelId="civilization-label"
          id="civilization"
          value={civilization}
          label="Civilization"
          onChange={onChange}
        >
          {CIVILIZATION_IDS.map((id) => (
            <MenuItem key={id} value={id}>
              {CIVILIZATIONS[id].displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
};
