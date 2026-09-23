import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { accent, chainById, ChainId } from "../../theme/chains";
import { Hue } from "../../theme/palette";

type AccentSectionProps = {
  readonly children: ReactNode;
  readonly sx?: object;
} & (
  | { readonly chain: ChainId; readonly title?: string }
  | { readonly hue: Hue; readonly title: string }
);

/**
 * A panel tinted with one palette hue. Inputs and outputs for the same chain
 * share the look, so the eye can jump from a setting to what it affects.
 */
export const AccentSection = (props: AccentSectionProps) => {
  const chain = "chain" in props ? chainById(props.chain) : null;
  const hue = chain ? chain.hue : (props as { hue: Hue }).hue;
  const title = props.title ?? chain?.label ?? "";
  const colors = accent(hue);
  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        backgroundColor: colors.tint,
        border: 1,
        borderColor: colors.border,
        borderLeft: 6,
        borderLeftColor: colors.bar,
        borderRadius: 2,
        paddingX: 1.5,
        paddingTop: 0.5,
        paddingBottom: 1.5,
        // Fields stay white so their values read clearly on the tint.
        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
        ...props.sx,
      }}
    >
      <Typography
        variant="overline"
        component="h2"
        sx={{ display: "block", color: colors.text, fontWeight: 700, letterSpacing: 1, marginBottom: 1 }}
      >
        {title}
      </Typography>
      {props.children}
    </Box>
  );
};
