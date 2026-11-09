// Geometry for the spirit board. The labels you see and the targets the
// planchette is tested against are the same list, so they can't drift apart.

export const BOARD = { width: 800, height: 520 }

const LETTERS_UPPER = 'ABCDEFGHIJKLM'.split('')
const LETTERS_LOWER = 'NOPQRSTUVWXYZ'.split('')
const DIGITS = '1234567890'.split('')

/** Fan a run of glyphs along an arc, each rotated to sit square on it. */
function arc(chars, { cx, cy, r, from, to, kind }) {
  return chars.map((ch, i) => {
    const t = chars.length === 1 ? 0.5 : i / (chars.length - 1)
    const deg = from + (to - from) * t
    const rad = (deg * Math.PI) / 180

    return {
      id: `${kind}-${ch}`,
      ch,
      kind,
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
      rotate: deg + 90
    }
  })
}

function row(chars, { y, from, to, kind }) {
  return chars.map((ch, i) => ({
    id: `${kind}-${ch}`,
    ch,
    kind,
    x: from + ((to - from) * i) / (chars.length - 1),
    y,
    rotate: 0
  }))
}

export const GLYPHS = [
  // The two words sit where a board puts them: up in the corners, read first.
  { id: 'yes', ch: 'YES', kind: 'word', x: 104, y: 74, rotate: 0 },
  { id: 'no', ch: 'NO', kind: 'word', x: 696, y: 74, rotate: 0 },

  ...arc(LETTERS_UPPER, { cx: 400, cy: 340, r: 250, from: 198, to: 342, kind: 'letter' }),
  ...arc(LETTERS_LOWER, { cx: 400, cy: 340, r: 178, from: 206, to: 334, kind: 'letter' }),
  ...row(DIGITS, { y: 402, from: 256, to: 544, kind: 'digit' }),

  { id: 'goodbye', ch: 'GOODBYE', kind: 'farewell', x: 400, y: 478, rotate: 0 }
]

/** How close the aperture must sit before a glyph starts being read. */
export const TAKE_RADIUS = 36

export function nearestGlyph(x, y) {
  let best = null
  let bestDistance = Infinity

  for (const glyph of GLYPHS) {
    const distance = Math.hypot(glyph.x - x, glyph.y - y)
    if (distance < bestDistance) {
      bestDistance = distance
      best = glyph
    }
  }

  return bestDistance <= TAKE_RADIUS ? best : null
}
