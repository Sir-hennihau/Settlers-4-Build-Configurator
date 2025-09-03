import { Container } from "@mui/material";
import { BuildingOutput } from "./components/building-output/buildingOutput";
import { BuildingInput } from "./components/building-input/buildingInput";
import { SoldiersPerMinuteInfo } from "./components/solders-per-minute-info/soldiersPerMinuteInfo";
import { Headline } from "./components/headline/headline";
import { CivilizationSelector } from "./components/civilization-selector/civilizationSelector";

function App() {
  return (
    <Container maxWidth="sm">
      <Headline />
      <CivilizationSelector />
      <BuildingInput />

      <BuildingOutput />

      <SoldiersPerMinuteInfo />
    </Container>
  );
}

export default App;
