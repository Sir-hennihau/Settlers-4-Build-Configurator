import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type NumberFieldProps = Omit<TextFieldProps, "value" | "onChange" | "type"> & {
  readonly value: number;
  /** Receives the raw text with a decimal comma normalised to a point. */
  readonly onValueChange: (value: string) => void;
};

/** Digits with at most one decimal separator; empty is allowed while typing. */
const ALLOWED = /^\d*[.,]?\d*$/;

const parse = (text: string): number => {
  const n = Number(text.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/**
 * A non-negative number input that keeps exactly what the user typed.
 *
 * It is deliberately a text input with a numeric keypad rather than
 * `type="number"`. A controlled number input only reports a number, so clearing
 * it snapped straight back to "0", intermediate text like "1," read as empty,
 * and browsers disagree on which keys it accepts. Here the draft text is local
 * state; the reducer still receives every edit and remains the single place
 * input is sanitised. The draft only resyncs when the stored value changes to
 * something the text does not already mean (reset, clamping elsewhere).
 */
export const NumberField = ({ value, onValueChange, inputProps, ...rest }: NumberFieldProps) => {
  const [draft, setDraft] = useState(() => String(value));

  useEffect(() => {
    setDraft((current) => (parse(current) === value ? current : String(value)));
  }, [value]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    if (!ALLOWED.test(text)) return;
    setDraft(text);
    onValueChange(text.replace(",", "."));
  };

  return (
    <TextField
      {...rest}
      type="text"
      value={draft}
      onChange={onChange}
      inputProps={{ inputMode: "decimal", autoComplete: "off", ...inputProps }}
    />
  );
};
