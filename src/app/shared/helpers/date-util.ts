export function secondsToDate(secs: number): Date {
  const date = new Date(1970, 0, 1); // Epoch
  date.setSeconds(secs);
  return date;
}
