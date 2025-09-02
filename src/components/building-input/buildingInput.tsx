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
  useAppDispatch,
} from "../../store/hooks";
import { setBuildingRequirements } from "../../store/building-requirements/buildingRequirementsSlice";
import { getAllBuildingAmountsFromT3PerMinute } from "../../store/hooks";
import { Resource } from "../../types/production";
import { romansProductionConfig } from "../../data/romansConfig";

// Define the mapping from building labels to their produced resources
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

export const BuildingInput = () => {
  // --- STATE ---
  const dispatch = useAppDispatch();
  const [buildingAmount, setBuildingAmount] = useState(1);
  const [selectedResource, setSelectedResource] = useState<Resource>("grain");

  // --- EFFECTS ---
  useEffect(() => {
    // Calculate soldiers per minute and building requirements
    const soldiersPerMinute = getT3SolderProductionPerMinutePerResourceType(
      selectedResource,
      buildingAmount
    );
    const allBuildingsConfig = getAllBuildingAmountsFromT3PerMinute(
      soldiersPerMinute || 0
    );
    console.log("soldiersPerMinute", soldiersPerMinute);
    console.log("allBuildingsConfig", allBuildingsConfig);

    // Update the store with calculated building requirements
    dispatch(setBuildingRequirements(allBuildingsConfig));
  }, [selectedResource, buildingAmount, dispatch]);

  // --- CALLBACKS ---
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

  // --- RENDER ---
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
