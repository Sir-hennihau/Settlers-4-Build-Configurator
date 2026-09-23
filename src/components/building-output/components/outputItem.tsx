import { Box, Typography } from "@mui/material";
import { getPreviewString } from "../../../helpers/getPreviewString";

interface OutputItemProps {
  label: string;
  amount: number;
  /** Optional second line, e.g. the double/normal split of a mine. */
  detail?: string;
  /** Colour of the count, from its chain. */
  color: string;
}

/**
 * One row of the sized build. The count is large and in fixed-width digits so
 * it can be read at a glance mid-game; zero is dimmed so the eye skips it.
 */
export const OutputItem = ({ label, amount, detail, color }: OutputItemProps) => {
  const shown = getPreviewString(amount);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 1,
        opacity: shown === 0 ? 0.45 : 1,
      }}
    >
      <Box>
        {label}
        {detail && (
          <Typography variant="caption" display="block" color="text.secondary">
            {detail}
          </Typography>
        )}
      </Box>
      <Typography
        component="span"
        sx={{
          color,
          fontSize: "1.25rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {shown}
      </Typography>
    </Box>
  );
};
