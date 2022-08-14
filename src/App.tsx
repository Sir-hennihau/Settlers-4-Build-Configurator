import { Container, Typography } from "@mui/material";
import { BuildingOutput } from "./components/building-output/buildingOutput";
import { BuildingInput } from "./components/component-input/buildingInput";

function App() {
  return (
    <Container>
      <Typography component="h1" sx={{ margin: [0, 2] }} variant="h3">
        Settlers 4 Build Configurator
      </Typography>

      <BuildingInput />

      <BuildingOutput />
    </Container>
  );
}

export default App;
