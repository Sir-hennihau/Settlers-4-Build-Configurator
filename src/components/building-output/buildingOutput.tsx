import { Grid } from "@mui/material";
import { BUILDINGS } from "../../data/buildings";
import { OutputItem } from "./components/outputItem";

export const BuildingOutput = () => {
  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      {BUILDINGS.map((building) => (
        <OutputItem building={building} key={building.label} />
      ))}
    </Grid>
  );
};
