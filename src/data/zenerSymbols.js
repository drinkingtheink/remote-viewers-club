// The five symbols of a Rhine (Zener) deck, as used in the Duke
// parapsychology lab experiments of the 1930s.
const zenerSymbols = [
  { id: 'circle', name: 'Circle' },
  { id: 'cross', name: 'Cross' },
  { id: 'waves', name: 'Waves' },
  { id: 'square', name: 'Square' },
  { id: 'star', name: 'Star' },
]

export const ZENER_SYMBOL_IDS = zenerSymbols.map((symbol) => symbol.id)

export const zenerSymbolName = (id) =>
  (zenerSymbols.find((symbol) => symbol.id === id) || {}).name || id

export default zenerSymbols
