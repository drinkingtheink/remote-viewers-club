/*
 * The candle, carried.
 *
 * The gilt pass over the tooled background used to be masked to a fixed
 * point, which meant the page was decorated with a light source rather than
 * lit by one. This points that mask at the pointer, so the gold catches
 * where you actually are.
 *
 * The light trails rather than tracks: it eases toward the pointer instead of
 * snapping to it, which is what a carried flame does and what keeps the
 * effect from feeling like a cursor attachment.
 *
 * Document-level and app-lifetime, so there is nothing to tear down. It stays
 * out of the components entirely -- it is a property of the room, not of any
 * one view.
 */

const EASE = 0.14 // fraction of the remaining distance covered per frame
const REST = 0.4 // px; below this the light has arrived and the loop stops

export function startPointerLight() {
  const root = document.documentElement

  // A light that chases the pointer is motion, and some people have asked not
  // to be given any. They get the fixed pool the mask was using before.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let targetX = window.innerWidth / 2
  let targetY = window.innerHeight * 0.36
  let x = targetX
  let y = targetY
  let frame = null

  const write = () => {
    root.style.setProperty('--page-x', `${x.toFixed(1)}px`)
    root.style.setProperty('--page-y', `${y.toFixed(1)}px`)
  }

  const step = () => {
    x += (targetX - x) * EASE
    y += (targetY - y) * EASE
    write()

    if (Math.abs(targetX - x) < REST && Math.abs(targetY - y) < REST) {
      x = targetX
      y = targetY
      write()
      frame = null
      return
    }

    frame = requestAnimationFrame(step)
  }

  const aim = (clientX, clientY) => {
    targetX = clientX
    targetY = clientY
    if (frame === null) frame = requestAnimationFrame(step)
  }

  write()

  window.addEventListener(
    'pointermove',
    (event) => aim(event.clientX, event.clientY),
    { passive: true }
  )

  // a touch is a visit, not a hover, so the flame goes where it was put
  window.addEventListener(
    'pointerdown',
    (event) => aim(event.clientX, event.clientY),
    { passive: true }
  )
}
