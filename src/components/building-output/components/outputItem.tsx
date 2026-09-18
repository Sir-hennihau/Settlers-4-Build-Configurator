import { Grid, Typography } from "@mui/material";
import { getPreviewString } from "../../../helpers/getPreviewString";

interface OutputItemProps {
  label: string;
  amount: number;
  /** Optional second line, e.g. the double/normal split of a mine. */
  detail?: string;
}

/** One row of the sized build: building name and required quantity. */
export const OutputItem = ({ label, amount, detail }: OutputItemProps) => (
  <>
    <Grid item xs={8}>
      {label}
      {detail && (
        <Typography variant="caption" display="block" color="text.secondary">
          {detail}
        </Typography>
      )}
    </Grid>
    <Grid item xs={4} textAlign="right">
      {getPreviewString(amount)}
    </Grid>
  </>
);
