import { showPlacard } from './usePlacard'

/*
 * The Club forgets.
 *
 * A society devoted to unreliable perception keeps unreliable records, so
 * every so often a returning member finds no record of their admission. It
 * is the site declining to give the same answer twice, which is the thing
 * the About page claims about the subject.
 *
 * Nothing is destroyed. Only the `rvc-joined` flag goes: the name, the
 * signature and the number stay exactly where they are, because somebody
 * who does not find this funny should not lose their drawing over it. The
 * roll on the server never forgets either, which is what makes the joke
 * land rather than just annoy -- sign again and the Club finds you were a
 * member all along, with the same number you had before.
 *
 * sessionStorage is the whole detector: it clears when the tab closes, so
 * its absence beside a present `rvc-joined` means precisely "a member has
 * come back in a new session", which is the condition this is about.
 */

const SESSION_MARK = 'rvc-session'
const LAPSE_KEY = 'rvc-lapse'
const JOINED_KEY = 'rvc-joined'

// Reliably on the first return, so most people who come back at all see it
// once. After that it is a one-in-four, and never twice running: the first
// time it reads as a bug, the second as a joke, and the third as the point.
const ODDS_AFTER_FIRST = 0.25

// Long enough for the page to settle, so it reads as the Club speaking up
// rather than as something that failed to load.
const BEAT_MS = 1400

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(LAPSE_KEY)) || { returns: 0, lastLapsed: false }
  } catch {
    return { returns: 0, lastLapsed: false }
  }
}

const write = (state) => {
  try {
    localStorage.setItem(LAPSE_KEY, JSON.stringify(state))
  } catch {
    // private window; the Club's memory is even shorter than usual
  }
}

export function startLapse() {
  let fresh = false

  try {
    fresh = !sessionStorage.getItem(SESSION_MARK)
    sessionStorage.setItem(SESSION_MARK, '1')
  } catch {
    // no sessionStorage means no way to tell a return from a reload, and
    // forgetting somebody on every page load is not the joke
    return
  }

  if (!fresh) return

  let joined = false
  try {
    joined = !!localStorage.getItem(JOINED_KEY)
  } catch {
    return
  }
  if (!joined) return

  const state = read()
  state.returns += 1

  const lapses =
    state.returns === 1 ? true : !state.lastLapsed && Math.random() < ODDS_AFTER_FIRST

  state.lastLapsed = lapses
  write(state)

  if (!lapses) return

  try {
    // The flag, and only the flag.
    localStorage.removeItem(JOINED_KEY)
  } catch {
    return
  }

  setTimeout(() => {
    showPlacard(['Have we met?', 'The Club has no record of your admission.'], { hold: 4600 })
  }, BEAT_MS)
}
