import { Container } from "@mui/material";
import { BuildingOutput } from "./components/building-output/buildingOutput";
import { BuildingInput } from "./components/building-input/buildingInput";
import { SoldiersPerMinuteInfo } from "./components/solders-per-minute-info/soldiersPerMinuteInfo";
import { Healdine } from "./components/headline/headline";

function App() {
  return (
    <Container>
      <Healdine />
      <BuildingInput />

      <BuildingOutput />

      <SoldiersPerMinuteInfo />
    </Container>
  );
}

export default App;
