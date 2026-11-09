/*
 * Something in the binding is watching.
 *
 * Every so often one quatrefoil in the tooled lattice opens into an eye,
 * holds, and closes. It is rare on purpose -- rare enough that a reader is
 * not sure they saw it, which is the whole effect. Anything more frequent
 * becomes a decoration and stops being unsettling.
 *
 * The eye lands on the lattice grid rather than anywhere on screen: the
 * tooling tiles at 120px and is viewport-anchored (background-attachment:
 * fixed), so a quatrefoil centre sits at 60 + 120n on both axes. Landing off
 * that grid would read as a sticker rather than as part of the binding.
 */

const TILE = 120
const CENTRE = 60
const FIRST = [25000, 60000] // ms before the first one
const BETWEEN = [45000, 150000] // ms between the rest

const between = ([min, max]) => min + Math.random() * (max - min)

export function startWatchingLattice(el) {
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let timer = null

  const place = () => {
    // only cells whose whole figure is on screen, so an eye never opens
    // half-cut at an edge
    const cols = Math.floor((window.innerWidth - CENTRE) / TILE)
    const rows = Math.floor((window.innerHeight - CENTRE) / TILE)
    if (cols < 1 || rows < 1) return false

    el.style.setProperty('--eye-x', `${CENTRE + TILE * Math.floor(Math.random() * cols)}px`)
    el.style.setProperty('--eye-y', `${CENTRE + TILE * Math.floor(Math.random() * rows)}px`)
    return true
  }

  const open = () => {
    // never while the reader is away: it would open and close to an empty room
    if (!document.hidden && place()) {
      el.classList.remove('is-open')
      // force the animation to restart even if it fired moments ago
      void el.offsetWidth
      el.classList.add('is-open')
    }
    timer = setTimeout(open, between(BETWEEN))
  }

  timer = setTimeout(open, between(FIRST))

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && timer) {
      clearTimeout(timer)
      timer = null
    } else if (!document.hidden && timer === null) {
      timer = setTimeout(open, between(BETWEEN))
    }
  })
}
