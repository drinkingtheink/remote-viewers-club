/*
 * Whether anyone is still there.
 *
 * Two small observances, both about absence rather than decoration:
 *
 *   - leave the tab and the club notices, and says so in the title
 *   - stop moving for a while and the room settles: the vignette closes in
 *     and the candle gutters, through a data-idle flag the stylesheets read
 *
 * Idle is deliberately long. A page that reacts the moment you stop moving
 * reads as a screensaver; one that waits until you have genuinely gone still
 * reads as a room noticing.
 */

const IDLE_AFTER = 45000
const AWAY_TITLE = 'See you there.'

export function startPresence() {
  const root = document.documentElement
  const original = document.title
  let idleTimer = null

  // The title change is a message, not motion, so it stands whatever the
  // motion preference. The idle settling does not.
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? AWAY_TITLE : original
  })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const stir = () => {
    if (root.dataset.idle) delete root.dataset.idle
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      root.dataset.idle = 'true'
    }, IDLE_AFTER)
  }

  for (const event of ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel']) {
    window.addEventListener(event, stir, { passive: true })
  }

  stir()
}
