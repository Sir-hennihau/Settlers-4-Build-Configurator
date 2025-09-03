/**
 * Formats a number to display with 1 decimal places maximum
 * @param value - The number to format
 * @returns Formatted number rounded to 1 decimal places
 */
export const getPreviewString = (value: number) => Math.round(value * 10) / 10;
