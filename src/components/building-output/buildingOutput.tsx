import { Grid } from "@mui/material";
import { OutputItem } from "./components/outputItem";
import { useAppSelector } from "../../store/hooks";
import { selectConfig } from "../../store/config-store/configSlice";
import { getBuildingsForCivilization } from "../../data/civilizationBuildings";

export const BuildingOutput = () => {
  const { selectedCivilization } = useAppSelector(selectConfig);
  const buildings = getBuildingsForCivilization(selectedCivilization);

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      {buildings.map((building) => (
        <OutputItem building={building} key={building.label} />
      ))}
    </Grid>
  );
};
