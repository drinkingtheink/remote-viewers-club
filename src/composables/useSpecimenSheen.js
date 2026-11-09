/*
 * Light on the plate.
 *
 * A specular highlight travels across a specimen's catalogue plate as the
 * pointer moves over its card, so the plate reads as a varnished surface
 * rather than a printed rectangle. The patch above it is left alone -- it is
 * the specimen, and glazing it would make it look reproduced.
 *
 * The position is written as a percentage of the PLATE, not of the card, so
 * the highlight travels the full width of the thing it is actually lighting.
 * Vertically it is allowed to run past both edges: hovering the patch above
 * puts the light off the top of the plate, which is where it should be.
 */

const Y_RANGE = [-40, 140] // how far above and below the plate the light may sit

const clamp = (value, [min, max]) => Math.min(Math.max(value, min), max)

export function startSpecimenSheen() {
  let pending = null
  let frame = null

  const place = () => {
    frame = null
    if (!pending) return

    const { plate, clientX, clientY } = pending
    const box = plate.getBoundingClientRect()
    if (!box.width || !box.height) return

    const x = ((clientX - box.left) / box.width) * 100
    const y = ((clientY - box.top) / box.height) * 100

    plate.style.setProperty('--sheen-x', `${clamp(x, [0, 100])}%`)
    plate.style.setProperty('--sheen-y', `${clamp(y, Y_RANGE)}%`)
  }

  document.addEventListener(
    'pointermove',
    (event) => {
      // a coarse pointer has no hover to speak of, and would leave the
      // highlight stuck wherever it was last tapped
      if (event.pointerType === 'touch') return

      const badge = event.target.closest?.('.badge')
      const plate = badge?.querySelector('.specimen-label')
      if (!plate) return

      pending = { plate, clientX: event.clientX, clientY: event.clientY }
      if (frame === null) frame = requestAnimationFrame(place)
    },
    { passive: true }
  )
}
