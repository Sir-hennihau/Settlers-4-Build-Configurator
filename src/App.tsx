import { Container } from "@mui/material";
import { BuildingOutput } from "./components/building-output/buildingOutput";
import { BuildingInput } from "./components/building-input/buildingInput";
import { SoldiersPerMinuteInfo } from "./components/soldiers-per-minute-info/soldiersPerMinuteInfo";
import { Headline } from "./components/headline/headline";
import { CivilizationSelector } from "./components/civilization-selector/civilizationSelector";

function App() {
  return (
    <Container maxWidth="sm" sx={{ marginBottom: 10 }}>
      <Headline />
      <CivilizationSelector />
      <BuildingInput />
      {/* The answer first, then the build that sustains it. */}
      <Container disableGutters>
        <SoldiersPerMinuteInfo />
        <BuildingOutput />
      </Container>
    </Container>
  );
}

export default App;
