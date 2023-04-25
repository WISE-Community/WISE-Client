/**
 * Convert milliseconds since the epoch to a pretty printed date time
 * @param milliseconds the milliseconds since the epoch
 * @return a string containing the pretty printed date time
 * example
 * Wed Apr 06 2016 9:05:38 AM
 */
export function millisecondsToDateTime(milliseconds: number): string {
  const date = new Date(milliseconds);
  return `${date.toDateString()} ${date.toLocaleTimeString()}`;
}
