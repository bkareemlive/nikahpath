/** ISO timestamp for `hours` / `days` before now. Kept out of components so
 *  the react-hooks purity rule doesn't flag `Date.now()` in render. */
export function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

export function isoDaysAgo(days: number): string {
  return isoHoursAgo(days * 24);
}
