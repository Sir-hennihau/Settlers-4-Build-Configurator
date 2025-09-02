import { Container } from "@mui/material";
import { BuildingOutput } from "./components/building-output/buildingOutput";
import { BuildingInput } from "./components/building-input/buildingInput";
import { SoldiersPerMinuteInfo } from "./components/solders-per-minute-info/soldiersPerMinuteInfo";
import { Healdine } from "./components/headline/headline";
import { CivilizationSelector } from "./components/civilization-selector/civilizationSelector";

function App() {
  return (
    <Container>
      <Healdine />
      <CivilizationSelector />
      <BuildingInput />

      <BuildingOutput />

      <SoldiersPerMinuteInfo />
    </Container>
  );
}

export default App;
