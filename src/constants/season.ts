/**
 * Build-time switch for the homepage holiday guides line. The homepage is prerendered,
 * so a runtime date check would make the hydrated page differ from the static HTML.
 * Turn off around Jan 10.
 */
export const HOLIDAY_SEASON_ACTIVE = true;

/** Create-dialog title chips are client-only, so they use a runtime window: Nov 1 - Dec 31, local time. */
export function isTitleSuggestionSeason(date: Date): boolean {
  const month = date.getMonth();
  return month === 10 || month === 11;
}
