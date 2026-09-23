import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ColorModePreference, useColorMode } from "../../theme/ColorModeProvider";

/** System / Light / Dark switch, top right. */
export const ColorModeToggle = () => {
  const { preference, setPreference } = useColorMode();
  return (
    <Stack sx={{ alignItems: "flex-end", marginTop: 2 }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        aria-label="Colour mode"
        value={preference}
        onChange={(_event, next: ColorModePreference | null) => next && setPreference(next)}
      >
        <ToggleButton value="system">System</ToggleButton>
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};
