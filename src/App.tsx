import { Container } from "@mui/material";
import { BuildingOutput } from "./components/building-output/buildingOutput";
import { BuildingInput } from "./components/building-input/buildingInput";
import { SoldiersPerMinuteInfo } from "./components/soldiers-per-minute-info/soldiersPerMinuteInfo";
import { Headline } from "./components/headline/headline";
import { ColorModeToggle } from "./components/color-mode-toggle/colorModeToggle";
import { CivilizationSelector } from "./components/civilization-selector/civilizationSelector";

function App() {
  return (
    <Container maxWidth="sm" sx={{ marginBottom: 10 }}>
      <ColorModeToggle />
      <Headline />
      <CivilizationSelector />
      <BuildingInput />
      <BuildingOutput />
      <SoldiersPerMinuteInfo />
    </Container>
  );
}

export default App;
