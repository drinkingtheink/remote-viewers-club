import vollkornRegular from '../assets/fonts/vollkorn/Vollkorn-Regular.woff2'
import vollkornBold from '../assets/fonts/vollkorn/Vollkorn-Bold.woff2'
import vollkornItalic from '../assets/fonts/vollkorn/Vollkorn-Italic.woff2'
import unicaOne from '../assets/fonts/unica-one/UnicaOne-Regular.woff2'

/*
 * Striking a copy of the card.
 *
 * PNG, not JPEG. The card is hairline gilt rules and small monospaced
 * figures on near-black, which is the exact material JPEG is worst at --
 * chroma subsampling smears gold lines a pixel wide and the ringing around
 * every letter shows against a dark ground. The portal's radial gradient
 * would band as well, and the corners are rounded, which needs an alpha
 * channel rather than a square of baked-in background. Flat vector-ish art
 * of this kind also happens to compress smaller as PNG.
 *
 * The trick is that the card on screen is not self-contained. Its colours
 * are var() references resolved from :root, and its faces are webfonts the
 * document loaded. An <svg> serialized and handed to an <img> gets neither:
 * custom properties resolve against nothing, and external resources are
 * refused outright, so the whole thing would come out black-on-black in
 * Times. Both have to be carried into the file.
 *
 * What is deliberately left behind: the sheen, the lean and the drop shadow
 * all live outside the SVG, and the animations are in the component's scoped
 * stylesheet which does not travel. The copy is the card at rest, which is
 * what anyone wants a still of.
 */

const FONT_FACES = [
  { family: 'Vollkorn', weight: 400, style: 'normal', url: vollkornRegular },
  { family: 'Vollkorn', weight: 700, style: 'normal', url: vollkornBold },
  { family: 'Vollkorn', weight: 400, style: 'italic', url: vollkornItalic },
  { family: 'Unica One', weight: 400, style: 'normal', url: unicaOne }
]

// Twice the card's own 856x540, so it is crisp on a dense screen and usable
// in print at about 3 inches wide.
const SCALE = 2

let embedded = null

async function fontFaceRules() {
  if (embedded) return embedded

  const parts = await Promise.all(
    FONT_FACES.map(async (face) => {
      const response = await fetch(face.url)
      const buffer = await response.arrayBuffer()

      // btoa wants a binary string, and spreading a large buffer into
      // String.fromCharCode blows the argument limit, so it goes in chunks.
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
      }

      return `@font-face{font-family:'${face.family}';font-weight:${face.weight};`
        + `font-style:${face.style};src:url(data:font/woff2;base64,${btoa(binary)}) format('woff2');}`
    })
  )

  embedded = parts.join('')
  return embedded
}

/*
 * XML forbids a double hyphen inside a comment, and the comments in this
 * codebase use one as an em dash -- including the ones explaining the card's
 * own artwork. The HTML parser does not care; an SVG handed to an <img> is
 * parsed as XML and refuses the whole document, which is a blank failure
 * with nothing in the console to say why.
 *
 * Stripping them rather than rewording them: a comment is of no use inside
 * an exported picture, and a rule that depends on nobody ever typing a dash
 * in a template again is not a rule.
 */
function stripComments(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT)
  const found = []
  while (walker.nextNode()) found.push(walker.currentNode)
  found.forEach((comment) => comment.remove())
}

/** Every custom property the markup actually mentions, with its value. */
function resolvedVariables(markup, source) {
  const names = new Set()
  const pattern = /var\(\s*(--[\w-]+)/g
  let match
  while ((match = pattern.exec(markup)) !== null) names.add(match[1])

  const computed = getComputedStyle(source)
  return [...names]
    .map((name) => `${name}:${computed.getPropertyValue(name).trim()};`)
    .join('')
}

/**
 * @param {SVGElement} svg       The card face to copy.
 * @param {string}     filename  Without extension.
 */
export async function exportCardPng(svg, filename = 'membership-card') {
  const clone = svg.cloneNode(true)
  stripComments(clone)
  clone.removeAttribute('class')
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

  const box = svg.viewBox.baseVal
  const width = box && box.width ? box.width : 856
  const height = box && box.height ? box.height : 540
  clone.setAttribute('width', width)
  clone.setAttribute('height', height)

  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = `${await fontFaceRules()} svg{${resolvedVariables(svg.outerHTML, svg)}}`
  clone.insertBefore(style, clone.firstChild)

  const markup = new XMLSerializer().serializeToString(clone)
  const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`

  const image = new Image()
  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = () => reject(new Error('The card could not be rendered'))
    image.src = source
  })

  const canvas = document.createElement('canvas')
  canvas.width = width * SCALE
  canvas.height = height * SCALE
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('The card could not be written')

  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = `${filename}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Long enough for the download to have taken hold of it.
  setTimeout(() => URL.revokeObjectURL(href), 10000)
}
