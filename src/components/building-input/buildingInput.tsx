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
  getT3SolderProductionPerMinutePerResourceType,
  getAllBuildingAmountsFromT3PerMinute,
  useAppDispatch,
  useAppSelector,
} from "../../store/hooks";
import { setBuildingRequirements } from "../../store/building-requirements/buildingRequirementsSlice";
import {
  setSoldiersPerMinute,
  selectConfig,
} from "../../store/config-store/configSlice";
import { Resource } from "../../types/production";

/** Mapping from building display labels to their produced resources */
const BUILDING_RESOURCE_MAP: { label: string; resource: Resource }[] = [
  { label: "Grain Farm", resource: "grain" },
  { label: "Animal Ranch", resource: "animal" },
  { label: "Waterworks", resource: "water" },
  { label: "Mill", resource: "weat" },
  { label: "Bakery", resource: "bread" },
  { label: "Butcher", resource: "meat" },
  { label: "Coal Mine", resource: "coal" },
  { label: "Iron Mine", resource: "ironOre" },
  { label: "Gold Mine", resource: "goldOre" },
  { label: "Iron Smelting Works", resource: "ironBar" },
  { label: "Weaponsmith's Works", resource: "weapon" },
  { label: "Gold Smelting Works", resource: "goldBar" },
];

/**
 * Component for selecting building type and amount to calculate production requirements
 * Updates soldiers per minute and building requirements based on user input
 */
export const BuildingInput = () => {
  const dispatch = useAppDispatch();
  const { selectedCivilization } = useAppSelector(selectConfig);
  const [buildingAmount, setBuildingAmount] = useState(1);
  const [selectedResource, setSelectedResource] = useState<Resource>("grain");

  useEffect(() => {
    const soldiersPerMinute = getT3SolderProductionPerMinutePerResourceType(
      selectedResource,
      buildingAmount,
      selectedCivilization
    );
    const allBuildingsConfig = getAllBuildingAmountsFromT3PerMinute(
      soldiersPerMinute || 0,
      selectedCivilization
    );

    dispatch(setSoldiersPerMinute(soldiersPerMinute || 0));
    dispatch(setBuildingRequirements(allBuildingsConfig));
  }, [selectedResource, buildingAmount, selectedCivilization, dispatch]);

  const onInputChange = (event: SelectChangeEvent) => {
    const selectedBuilding = BUILDING_RESOURCE_MAP.find(
      (building) => building.label === event.target.value
    );
    if (selectedBuilding) {
      setSelectedResource(selectedBuilding.resource);
    }
  };

  const onBuildingAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBuildingAmount = Number(event.target.value);
    if (newBuildingAmount >= 0) {
      setBuildingAmount(newBuildingAmount);
    }
  };

  const selectedBuilding = BUILDING_RESOURCE_MAP.find(
    (building) => building.resource === selectedResource
  );

  return (
    <Container>
      <Stack sx={{ flexDirection: "row" }}>
        <FormControl fullWidth>
          <InputLabel>Building</InputLabel>
          <Select
            value={selectedBuilding?.label || ""}
            label="Building"
            onChange={onInputChange}
          >
            {BUILDING_RESOURCE_MAP.map((building) => (
              <MenuItem key={building.label} value={building.label}>
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
          type="number"
        />
      </Stack>
    </Container>
  );
};
