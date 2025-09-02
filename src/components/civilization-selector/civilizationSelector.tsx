import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Container } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectConfig,
  setSelectedCivilization,
} from "../../store/config-store/configSlice";
import {
  CivilizationType,
  CIVILIZATION_DISPLAY_NAMES,
} from "../../data/civilizationsConfig";

export const CivilizationSelector = () => {
  const dispatch = useAppDispatch();
  const { selectedCivilization } = useAppSelector(selectConfig);

  const onCivilizationChange = (event: SelectChangeEvent) => {
    const civilization = event.target.value as CivilizationType;
    dispatch(setSelectedCivilization(civilization));
  };

  return (
    <Container sx={{ marginBottom: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Civilization</InputLabel>
        <Select
          value={selectedCivilization}
          label="Civilization"
          onChange={onCivilizationChange}
        >
          {Object.entries(CIVILIZATION_DISPLAY_NAMES).map(
            ([key, displayName]) => (
              <MenuItem key={key} value={key}>
                {displayName}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </Container>
  );
};
