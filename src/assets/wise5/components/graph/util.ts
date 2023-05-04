export function calculateMean(values: number[]): number {
  return values.reduce((a, b) => a + b) / values.length;
}
