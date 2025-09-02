import { Tooltip, Typography } from "@mui/material";

/**
 * Main headline component for the Settlers 4 Build Configurator
 * Displays the application title with tooltip information
 */
export const Headline = () => (
  <Tooltip title="Calculate building requirements for T3 soldier production across different civilizations. Buildings assume optimal work productivity.">
    <Typography component="h1" sx={{ marginY: 2 }} variant="h3">
      Settlers 4 Build Configurator
    </Typography>
  </Tooltip>
);
