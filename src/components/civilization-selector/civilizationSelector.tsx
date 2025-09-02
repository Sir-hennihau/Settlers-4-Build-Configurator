import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSelectedCivilization,
  selectConfig,
} from "../../store/config-store/configSlice";
import { CIVILIZATIONS } from "../../types/civilization";
import { CivilizationType } from "../../types/civilization";

export const CivilizationSelector = () => {
  const dispatch = useAppDispatch();
  const { selectedCivilization } = useAppSelector(selectConfig);

  const handleCivilizationChange = (event: SelectChangeEvent) => {
    const newCivilization = event.target.value as CivilizationType;
    dispatch(setSelectedCivilization(newCivilization));
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>Civilization</InputLabel>
      <Select
        value={selectedCivilization}
        label="Civilization"
        onChange={handleCivilizationChange}
      >
        {CIVILIZATIONS.map((civilization) => (
          <MenuItem key={civilization.id} value={civilization.id}>
            {civilization.displayName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
