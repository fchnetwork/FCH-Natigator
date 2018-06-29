export function secondsToDate(secs: number): Date {
  const date = new Date(secs * 1000);
  return date;
}
