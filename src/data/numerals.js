/*
 * The Club counts in Roman. It is on the card twice -- the admitted year and
 * the member's number -- and now in the placard that tells a lapsed member
 * what their number was all along, so it lives in one place.
 */

const TABLE = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
]

export function toRoman(value) {
  let left = Math.floor(Number(value) || 0)
  if (left < 1) return ''

  let out = ''
  for (const [size, numeral] of TABLE) {
    while (left >= size) {
      out += numeral
      left -= size
    }
  }
  return out
}
