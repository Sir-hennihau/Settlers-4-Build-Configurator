import { Tooltip, Typography } from "@mui/material";

export const Healdine = () => (
  <Tooltip title="Info: 1. Only romans are supported for now. 2. Buildings assume optimal work productivity.">
    <Typography component="h1" sx={{ marginY: 2 }} variant="h3">
      Settlers 4 Build Configurator
    </Typography>
  </Tooltip>
);
