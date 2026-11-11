/*
 * Light on a surface.
 *
 * A specular highlight travels across a lit surface as the pointer moves
 * over the thing that holds it, so it reads as varnish or glass catching a
 * lamp rather than as a printed rectangle.
 *
 * The position is written as a percentage of the SURFACE and not of its
 * container, so the highlight travels the full width of whatever it is
 * actually lighting.
 *
 * Two surfaces take it. On a specimen the lit part is the catalogue plate
 * alone: the patch above is the specimen itself, and glazing that would make
 * it look reproduced rather than mounted. Vertically the plate lets the
 * light run past both edges, because hovering the patch should put it off
 * the top. A membership card is lit across the whole of itself, as an object
 * in the hand would be, so its light stays within its bounds.
 */

const SURFACES = [
  { holder: '.badge', surface: '.specimen-label', yRange: [-40, 140] },
  // A card is an object you would be holding, so it leans toward the light
  // as well as catching it. Same pointer, two uses.
  { holder: '.member-card', surface: '.member-card-sheen', yRange: [0, 100], tilt: 7 }
]

const clamp = (value, [min, max]) => Math.min(Math.max(value, min), max)

export function startSheen() {
  let pending = null
  let frame = null

  const place = () => {
    frame = null
    if (!pending) return

    const { surface, holder, yRange, tilt, clientX, clientY } = pending
    const box = surface.getBoundingClientRect()
    if (!box.width || !box.height) return

    const x = ((clientX - box.left) / box.width) * 100
    const y = ((clientY - box.top) / box.height) * 100

    surface.style.setProperty('--sheen-x', `${clamp(x, [0, 100])}%`)
    surface.style.setProperty('--sheen-y', `${clamp(y, yRange)}%`)

    if (!tilt) return

    // Away from the pointer on the vertical, toward it on the horizontal:
    // that pairing is what reads as a face turning rather than a panel
    // sliding. Centre is 50%, so the halves are the offsets from it.
    holder.style.setProperty('--tilt-x', `${(50 - clamp(y, [0, 100])) / 50 * tilt}deg`)
    holder.style.setProperty('--tilt-y', `${(clamp(x, [0, 100]) - 50) / 50 * tilt}deg`)
  }

  /* The light fades out on its own, but a lean has to be given back or the
     card is left holding a pose nobody is looking at any more. */
  document.addEventListener(
    'pointerleave',
    (event) => {
      const holder = event.target.closest?.('.member-card')
      if (!holder) return
      holder.style.removeProperty('--tilt-x')
      holder.style.removeProperty('--tilt-y')
    },
    { capture: true, passive: true }
  )

  document.addEventListener(
    'pointermove',
    (event) => {
      // a coarse pointer has no hover to speak of, and would leave the
      // highlight stuck wherever it was last tapped
      if (event.pointerType === 'touch') return

      if (!event.target.closest) return

      for (const spec of SURFACES) {
        const holder = event.target.closest(spec.holder)
        const found = holder?.querySelector(spec.surface)
        if (!found) continue

        pending = {
          surface: found,
          holder,
          yRange: spec.yRange,
          tilt: spec.tilt,
          clientX: event.clientX,
          clientY: event.clientY
        }
        if (frame === null) frame = requestAnimationFrame(place)
        return
      }
    },
    { passive: true }
  )
}
