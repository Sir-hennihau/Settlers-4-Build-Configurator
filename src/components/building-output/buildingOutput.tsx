import { Grid } from "@mui/material";
import React from "react";
import { BUILDINGS } from "../../data/buildings";
import { OutputItem } from "./components/outputItem";

interface BuildingOutputProps {}

export const BuildingOutput = ({}: BuildingOutputProps) => {
  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      {BUILDINGS.map((building) => (
        <OutputItem building={building} />
      ))}
    </Grid>
  );
};
