/*
 * Findings for the Watcher Test.
 *
 * Bands are read from the top down and the first one that matches wins, so
 * the overrides have to come first: a subject who presses continuously will
 * "hit" every window, and reporting that as sensitivity would be a lie the
 * instrument tells on their behalf.
 */

export const WINDOWS = 6
export const WINDOW_MS = 3200
export const GAP_MS = [2500, 6500]
export const SETTLE_MS = 2200

export const VERDICTS = [
  {
    match: ({ presses }) => presses > WINDOWS * 3,
    finding: 'Inconclusive — subject pressed continuously',
    note: 'The instrument records nothing but the subject.'
  },
  {
    match: ({ presses }) => presses === 0,
    finding: 'No response recorded',
    note: 'Either nothing was felt, or the subject declined to say so.'
  },
  {
    match: ({ hits, falseAlarms }) => hits >= WINDOWS - 1 && falseAlarms <= 2,
    finding: 'Marked sensitivity',
    note: 'The subject was aware of the observation on all but one occasion. This result is noted and will be reviewed.'
  },
  {
    match: ({ hits, falseAlarms }) => hits >= 4 && falseAlarms <= 3,
    finding: 'Suggestive',
    note: 'Above what the Club would expect from a subject guessing, though the Club has been wrong about this before.'
  },
  {
    match: ({ falseAlarms, hits }) => falseAlarms > hits * 2,
    finding: 'Sensitive to the wrong thing',
    note: 'The subject felt watched largely when they were not. This is still a finding.'
  },
  {
    match: ({ hits }) => hits >= 2,
    finding: 'Within chance',
    note: 'Consistent with a subject who felt nothing and pressed anyway.'
  },
  {
    match: () => true,
    finding: 'No sensitivity detected',
    // reached on 0 or 1 hits, so it cannot claim the run went wholly unnoticed
    note: 'Little or nothing registered. Most subjects are unaware they are being watched; this is usually a comfort.'
  }
]

export const verdictFor = (stats) => VERDICTS.find((v) => v.match(stats))
