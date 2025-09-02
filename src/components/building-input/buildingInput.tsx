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

const BUILDING_RESOURCE_MAP: {
  label: string;
  resource: Resource;
  icon?: React.ReactNode;
}[] = [
  { label: "Grain Farm", resource: "grain" },
  { label: "Animal Ranch", resource: "animal" },
  { label: "Waterworks", resource: "water" },
  { label: "Mill", resource: "weat" },
  { label: "Bakery", resource: "bread" },
  { label: "Butcher", resource: "meat" },
  { label: "Coal Mine", resource: "coal" },
  { label: "Iron Mine", resource: "ironOre" },
  { label: "Gold Mine", resource: "goldOre" },
  {
    label: "Stone Mine",
    resource: "stone",
    icon: "Add stone mines (optional)",
  },
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
  const [showStoneMineInput, setShowStoneMineInput] = useState(false);
  const [stoneMineAmount, setStoneMineAmount] = useState<number | undefined>();

  useEffect(() => {
    const soldiersPerMinute = getT3SolderProductionPerMinutePerResourceType(
      selectedResource,
      buildingAmount,
      selectedCivilization
    );
    const allBuildingsConfig = getAllBuildingAmountsFromT3PerMinute(
      soldiersPerMinute || 0,
      selectedCivilization,
      stoneMineAmount
    );
    if (typeof stoneMineAmount === "number") {
      allBuildingsConfig.stoneMines = stoneMineAmount;
    }
    dispatch(setSoldiersPerMinute(soldiersPerMinute || 0));
    dispatch(setBuildingRequirements(allBuildingsConfig));
  }, [
    selectedResource,
    buildingAmount,
    selectedCivilization,
    stoneMineAmount,
    dispatch,
  ]);

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
      <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
        <FormControl fullWidth>
          <InputLabel>Building</InputLabel>
          <Select
            value={selectedBuilding?.label || ""}
            label="Building"
            onChange={onInputChange}
          >
            {BUILDING_RESOURCE_MAP.map((building) => (
              <MenuItem key={building.label} value={building.label}>
                {building.icon && (
                  <span style={{ verticalAlign: "middle", marginRight: 6 }}>
                    {building.icon}
                  </span>
                )}
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

        <button
          style={{
            marginLeft: 16,
            padding: "6px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => {
            if (showStoneMineInput) {
              setStoneMineAmount(0);
            }
            setShowStoneMineInput((v) => !v);
          }}
        >
          {showStoneMineInput
            ? "Hide stone mines input"
            : "Add stone mines (optional)"}
        </button>
        {showStoneMineInput && (
          <TextField
            id="stone-mine-amount"
            label="Stone Mines"
            onChange={(e) => setStoneMineAmount(Number(e.target.value))}
            sx={{ marginLeft: 2 }}
            variant="outlined"
            value={stoneMineAmount ?? ""}
            type="number"
            inputProps={{ min: 0 }}
          />
        )}
      </Stack>
    </Container>
  );
};
