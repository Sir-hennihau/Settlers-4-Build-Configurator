import { Container, Typography } from "@mui/material";
import { BuildingInput } from "./components/component-input/buildingInput";

function App() {
  return (
    <Container>
      <Typography component="h1" sx={{ margin: [0, 2] }} variant="h3">
        Settlers 4 Build Configurator
      </Typography>

      <BuildingInput />
    </Container>
  );
}

export default App;
