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
import { useAppDispatch } from "../../store/hooks";
import { setBuildingRequirements } from "../../store/building-requirements/buildingRequirementsSlice";
import { getAllBuildingAmountsFromT3PerMinute } from "../../store/hooks";
import { Resource } from "../../types/production";
import { romasProductionConfig } from "../../data/romasConfig";

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

// Helper function to calculate soldiers per minute from resource
const getT3SolderProductionPerMinutePerResourceType = (
  resource: Resource,
  amount: number
): number => {
  const coalPerSoldier = 4;
  const ironOrePerSoldier = 1;
  const goldOrePerSoldier = 2;
  const ironBarsPerSoldier = 1;
  const goldBarsPerSoldier = 2;
  const meatPerSoldier = ironOrePerSoldier / 10;
  const breadPerSoldier = coalPerSoldier / 10;
  const fishPerSoldier = goldOrePerSoldier / 10;
  const animalPerSoldier = meatPerSoldier;
  const weatPerSoldier = breadPerSoldier;
  const waterPerSoldier = animalPerSoldier + weatPerSoldier;
  const grainPerSoldier = animalPerSoldier + weatPerSoldier;

  switch (resource) {
    case "coal":
      return (romasProductionConfig.coalMine.out / coalPerSoldier) * amount;
    case "ironOre":
      return (romasProductionConfig.ironMine.out / ironOrePerSoldier) * amount;
    case "goldOre":
      return (romasProductionConfig.goldMine.out / goldBarsPerSoldier) * amount;
    case "ironBar":
      return (
        (romasProductionConfig.ironSmelt.out / ironBarsPerSoldier) * amount
      );
    case "goldBar":
      return (
        (romasProductionConfig.goldSmelt.out / goldBarsPerSoldier) * amount
      );
    case "meat":
      return (romasProductionConfig.butcher.out / meatPerSoldier) * amount;
    case "bread":
      return (romasProductionConfig.bakery.out / breadPerSoldier) * amount;
    case "animal":
      return (romasProductionConfig.animalFarm.out / animalPerSoldier) * amount;
    case "weat":
      return (romasProductionConfig.mill.out / weatPerSoldier) * amount;
    case "grain":
      return (romasProductionConfig.grainFarm.out / grainPerSoldier) * amount;
    case "water":
      return (romasProductionConfig.waterworks.out / waterPerSoldier) * amount;
    default:
      return 0;
  }
};

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
    const allBuildingsConfig =
      getAllBuildingAmountsFromT3PerMinute(soldiersPerMinute);

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
