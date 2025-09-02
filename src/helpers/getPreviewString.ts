/**
 * Formats a number to display with 2 decimal places maximum
 * @param value - The number to format
 * @returns Formatted number rounded to 2 decimal places
 */
export const getPreviewString = (value: number) =>
  Math.round(value * 100) / 100;
