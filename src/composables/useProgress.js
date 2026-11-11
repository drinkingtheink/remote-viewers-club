/*
 * What the Club has seen you do.
 *
 * Only sittings for now, and only that you began one -- not how it went.
 * The pen is issued on evidence of practice, not on being any good at it,
 * which is the right bar for a club whose own instruments disagree with
 * each other.
 *
 * Kept as a list of session ids rather than a count, so a reader cannot
 * open and abandon the same session six times and call it six sittings.
 */

const KEY = 'rvc-progress'

const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return { sat: Array.isArray(saved?.sat) ? saved.sat : [] }
  } catch {
    return { sat: [] }
  }
}

export function recordSitting(sessionId) {
  if (!sessionId) return

  const state = read()
  if (state.sat.includes(sessionId)) return

  state.sat = [...state.sat, sessionId]
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // private window; the pen will have to be earned again next visit
  }
}

export function sittings() {
  return read().sat
}

export function hasSat() {
  return read().sat.length > 0
}
