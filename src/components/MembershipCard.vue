<template>
  <div class="member-card" :class="{ 'is-turned': turned }">
    <div class="member-card-pivot">
      <!-- ===================== FRONT ===================== -->
      <svg
        class="member-card-face is-front"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 856 540"
        :aria-label="`Membership card, front. ${rank}, ${name}, number ${memberNo}.`"
        role="img"
      >
        <defs>
          <clipPath :id="id('card')"><rect width="856" height="540" rx="28" /></clipPath>
          <clipPath :id="id('arch')"><path d="M0 470 V160 A160 160 0 0 1 320 160 V470 Z" /></clipPath>
          <clipPath :id="id('floor')"><rect x="0" y="360" width="320" height="110" /></clipPath>
          <radialGradient :id="id('glow')" cx="50%" cy="49%" r="55%">
            <stop offset="0" style="stop-color: var(--leather-raised)" />
            <stop offset="1" style="stop-color: var(--leather-deep)" />
          </radialGradient>
        </defs>

        <g :clip-path="`url(#${id('card')})`">
          <rect width="856" height="540" style="fill: var(--leather)" />

          <rect x="12" y="12" width="832" height="516" rx="20" style="fill: none; stroke: var(--gilt); stroke-width: 1.5" />
          <rect x="18" y="18" width="820" height="504" rx="16" style="fill: none; stroke: var(--gilt); stroke-width: 0.75; opacity: 0.6" />

          <!-- corner studs -->
          <g style="fill: var(--gilt)">
            <rect x="8" y="8" width="9" height="9" transform="rotate(45 12.5 12.5)" />
            <rect x="839" y="8" width="9" height="9" transform="rotate(45 843.5 12.5)" />
            <rect x="8" y="523" width="9" height="9" transform="rotate(45 12.5 527.5)" />
            <rect x="839" y="523" width="9" height="9" transform="rotate(45 843.5 527.5)" />
          </g>

          <!-- ---- the portal ---- -->
          <svg x="48" y="44" width="308" height="452" viewBox="0 0 320 470">
            <g :clip-path="`url(#${id('arch')})`">
              <rect x="0" y="0" width="320" height="470" :style="`fill: url(#${id('glow')})`" />
              <circle
                cx="160" cy="230" r="125"
                style="fill: none; stroke: var(--gilt); stroke-width: 170; stroke-dasharray: 3 29.72; opacity: 0.16"
              />
              <rect x="0" y="360" width="320" height="110" style="fill: var(--leather-deep)" />
              <g :clip-path="`url(#${id('floor')})`" style="stroke: var(--cinnabar); stroke-width: 0.9; opacity: 0.75">
                <line x1="0" y1="368" x2="320" y2="368" />
                <line x1="0" y1="380" x2="320" y2="380" />
                <line x1="0" y1="397" x2="320" y2="397" />
                <line x1="0" y1="421" x2="320" y2="421" />
                <line x1="0" y1="455" x2="320" y2="455" />
                <line x1="160" y1="340" x2="-200" y2="470" />
                <line x1="160" y1="340" x2="-80" y2="470" />
                <line x1="160" y1="340" x2="40" y2="470" />
                <line x1="160" y1="340" x2="160" y2="470" />
                <line x1="160" y1="340" x2="280" y2="470" />
                <line x1="160" y1="340" x2="400" y2="470" />
                <line x1="160" y1="340" x2="520" y2="470" />
              </g>
              <line x1="0" y1="360" x2="320" y2="360" style="stroke: var(--gilt); stroke-width: 1" />
            </g>
            <path d="M0.75 470 V160 A159.25 159.25 0 0 1 319.25 160 V470" style="fill: none; stroke: var(--gilt); stroke-width: 1.5" />

            <circle cx="62" cy="118" r="15" style="fill: var(--gilt)" />
            <circle cx="69" cy="113" r="13" style="fill: var(--leather)" />
            <circle cx="258" cy="118" r="15" style="fill: var(--gilt)" />
            <circle cx="251" cy="113" r="13" style="fill: var(--leather)" />

            <g style="fill: var(--parchment)">
              <circle cx="160" cy="48" r="2.4" />
              <circle cx="112" cy="70" r="1.4" />
              <circle cx="208" cy="66" r="1.8" />
              <circle cx="40" cy="200" r="1.4" />
              <circle cx="284" cy="214" r="1.6" />
              <circle cx="96" cy="320" r="1.2" />
              <circle cx="236" cy="312" r="1.4" />
            </g>

            <g style="fill: none; stroke: var(--gilt); stroke-width: 0.6; opacity: 0.75">
              <circle cx="160" cy="230" r="96" style="stroke-width: 6; stroke-dasharray: 0.6 9.45" />
              <circle cx="160" cy="230" r="88" />
              <circle cx="160" cy="230" r="58" style="stroke-dasharray: 2 3" />
              <line x1="40" y1="230" x2="80" y2="230" />
              <line x1="240" y1="230" x2="280" y2="230" />
              <line x1="160" y1="120" x2="160" y2="178" style="stroke-dasharray: 3 2" />
              <line x1="160" y1="282" x2="160" y2="340" style="stroke-dasharray: 3 2" />
            </g>

            <path d="M86 230 Q160 172 234 230 Q160 288 86 230Z" style="fill: var(--leather-deep); stroke: var(--gilt); stroke-width: 2" />
            <circle cx="160" cy="230" r="28" style="fill: none; stroke: var(--cinnabar); stroke-width: 2" />
            <circle cx="160" cy="230" r="20" style="fill: none; stroke: var(--gilt); stroke-width: 0.75; stroke-dasharray: 1 3" />
            <circle cx="160" cy="230" r="11" style="fill: var(--gilt)" />
            <circle cx="165" cy="225" r="3" style="fill: var(--parchment)" />

            <!-- the sealed envelope -->
            <rect x="136" y="392" width="48" height="30" style="fill: var(--parchment); stroke: var(--gilt); stroke-width: 1" />
            <path d="M136 392 L160 410 L184 392" style="fill: none; stroke: var(--gilt-dim); stroke-width: 1" />
            <circle cx="160" cy="410" r="5" style="fill: var(--oxblood)" />
            <text
              x="160" y="442"
              style="font-family: var(--font-mono); font-size: 7px; letter-spacing: 1px; fill: var(--gilt); text-anchor: middle"
            >TARGET · SEALED</text>
          </svg>

          <!-- ---- the record ---- -->
          <text x="384" y="78" style="font-family: var(--font-heading); font-weight: 700; font-size: 38px; letter-spacing: 3.8px; fill: var(--gilt)">{{ cohort }}</text>
          <line x1="532" y1="66" x2="624" y2="66" style="stroke: var(--gilt); stroke-width: 1" />
          <text x="810" y="71" style="font-family: var(--font-heading); font-size: 12px; letter-spacing: 2px; fill: var(--gilt); text-anchor: end">REMOTE VIEWERS CLUB</text>

          <text x="384" y="168" style="font-family: var(--font-heading); font-weight: 700; font-size: 46px; letter-spacing: 2.3px; fill: var(--parchment)">{{ rank }}</text>
          <text
            ref="nameEl"
            x="384" y="206"
            :style="`font-family: var(--font-display); font-size: ${nameSize}px; letter-spacing: 0.04em; fill: var(--gilt)`"
          >{{ name }}</text>

          <text style="font-family: var(--font-heading); font-style: italic; font-size: 17px; fill: var(--ash)">
            <tspan v-for="(line, i) in oathLines" :key="i" x="384" :y="236 + i * 25">{{ line }}</tspan>
          </text>

          <!-- ---- proficiency ---- -->
          <text x="384" y="339" style="font-family: var(--font-heading); font-size: 11px; letter-spacing: 1.6px; fill: var(--ash)">ZENER PROFICIENCY</text>
          <g v-for="(symbol, i) in symbols" :key="symbol.id">
            <rect
              :x="384 + i * 46" y="349" width="38" height="50" rx="4"
              :style="`fill: ${earned(symbol.id) ? 'var(--gilt)' : 'none'}; stroke: var(--gilt); stroke-width: 1.5`"
            />
            <svg :x="392 + i * 46" y="363" width="22" height="22" viewBox="0 0 24 24">
              <path
                :d="symbol.d"
                :style="`fill: none; stroke: ${earned(symbol.id) ? 'var(--leather)' : 'var(--ash)'}; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round`"
              />
            </svg>
          </g>

          <!-- ---- the stamp ---- -->
          <g transform="rotate(-12 779 368)" style="opacity: 0.92">
            <circle cx="779" cy="368" r="30" style="fill: none; stroke: var(--cinnabar); stroke-width: 2" />
            <text style="font-family: var(--font-heading); font-weight: 700; font-size: 9px; letter-spacing: 0.7px; fill: var(--cinnabar); text-anchor: middle">
              <tspan x="779" y="358">SEEN</tspan>
              <tspan x="779" y="371">&amp;</tspan>
              <tspan x="779" y="384">VERIFIED</tspan>
            </text>
          </g>

          <!-- ---- the footer ---- -->
          <line x1="384" y1="447.5" x2="810" y2="447.5" style="stroke: var(--gilt); stroke-width: 1" />
          <g style="font-family: var(--font-heading); font-size: 11px; letter-spacing: 1.6px; fill: var(--ash)">
            <text x="384" y="470">NO.</text>
            <text x="534" y="470">ADMITTED</text>
            <text x="662" y="470">EXPIRES</text>
          </g>
          <text x="384" y="492" style="font-family: var(--font-mono); font-weight: 700; font-size: 16px; letter-spacing: 0.6px; fill: var(--cinnabar)">{{ memberNo }}</text>
          <text x="534" y="492" style="font-family: var(--font-heading); font-weight: 700; font-size: 17px; fill: var(--gilt)">{{ admitted }}</text>
          <text x="662" y="492" style="font-family: var(--font-heading); font-weight: 700; font-size: 17px; fill: var(--gilt)">{{ expires }}</text>
        </g>
      </svg>

      <!-- ===================== BACK ===================== -->
      <svg
        class="member-card-face is-back"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 856 540"
        aria-label="Membership card, reverse. The Club seal and the member's signature."
        role="img"
      >
        <defs>
          <clipPath :id="id('cardback')"><rect width="856" height="540" rx="28" /></clipPath>
          <pattern :id="id('lattice')" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 V26 M0 0 H26" style="stroke: var(--gilt); stroke-opacity: 0.22; stroke-width: 2; fill: none" />
          </pattern>
          <path :id="id('tring')" d="M140,140 m-112,0 a112,112 0 1,1 224,0 a112,112 0 1,1 -224,0" />

          <!--
            The pad bakes a white background into the saved PNG, so the
            signature arrives as a white rectangle with a stroke in it.
            Luminance becomes alpha and is then inverted, which drops the
            paper and keeps the hand; the flood re-inks what is left, so the
            mark is one solid colour however faint it was drawn.
          -->
          <filter :id="id('ink')" x="0" y="0" width="100%" height="100%">
            <feColorMatrix type="luminanceToAlpha" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="-1.6" intercept="1.25" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" result="hand" />
            <feFlood flood-color="var(--blood)" />
            <feComposite operator="in" in2="hand" />
          </filter>
        </defs>

        <g :clip-path="`url(#${id('cardback')})`">
          <rect width="856" height="540" style="fill: var(--leather)" />
          <rect width="856" height="540" :style="`fill: url(#${id('lattice')})`" />

          <rect x="12" y="12" width="832" height="516" rx="20" style="fill: none; stroke: var(--gilt); stroke-width: 1.5" />
          <rect x="18" y="18" width="820" height="504" rx="16" style="fill: none; stroke: var(--gilt); stroke-width: 0.75; opacity: 0.6" />
          <rect x="28" y="28" width="800" height="484" rx="12" style="fill: none; stroke: var(--cinnabar); stroke-width: 1" />

          <text x="62" y="270" transform="rotate(-90 62 270)" style="font-family: var(--font-heading); font-weight: 700; font-size: 22px; letter-spacing: 6.6px; fill: var(--gilt); text-anchor: middle; dominant-baseline: central">R · V · C</text>
          <text x="794" y="270" transform="rotate(90 794 270)" style="font-family: var(--font-heading); font-weight: 700; font-size: 22px; letter-spacing: 6.6px; fill: var(--gilt); text-anchor: middle; dominant-baseline: central">R · V · C</text>

          <!-- the seal, lifted to make room for the hand below it -->
          <svg x="283" y="38" width="290" height="290" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="136" style="fill: var(--leather); stroke: var(--cinnabar); stroke-width: 5" />
            <circle cx="140" cy="140" r="128" style="fill: none; stroke: var(--gilt); stroke-width: 1" />
            <text style="font-family: var(--font-heading); font-size: 15px; font-weight: 700; fill: var(--gilt)">
              <textPath :href="`#${id('tring')}`" textLength="700" lengthAdjust="spacing">SEE YOU THERE ✦ SEE YOU THERE ✦ SEE YOU THERE ✦</textPath>
            </text>
            <circle cx="140" cy="140" r="96" style="fill: none; stroke: var(--gilt); stroke-width: 1.2" />
            <circle cx="140" cy="140" r="88" style="fill: none; stroke: var(--gilt); stroke-width: 7; stroke-dasharray: 0.8 8.4; opacity: 0.7" />
            <circle cx="140" cy="140" r="64" style="fill: none; stroke: var(--gilt); stroke-width: 0.6; stroke-dasharray: 2 3; opacity: 0.7" />
            <path d="M76 140 Q140 92 204 140 Q140 188 76 140Z" style="fill: var(--leather-deep); stroke: var(--gilt); stroke-width: 2" />
            <circle cx="140" cy="140" r="24" style="fill: none; stroke: var(--cinnabar); stroke-width: 2" />
            <circle cx="140" cy="140" r="10" style="fill: var(--gilt)" />
            <circle cx="140" cy="60" r="2" style="fill: var(--parchment)" />
            <circle cx="140" cy="220" r="2" style="fill: var(--parchment)" />
          </svg>

          <!--
            The hand that signed it. The front carries what the Club says
            about a member; this is the only mark on the card the member made
            themselves, so it gets the foot of the reverse to itself.
          -->
          <g>
            <rect x="228" y="344" width="400" height="104" rx="3" style="fill: var(--parchment); stroke: var(--gilt); stroke-width: 1" />
            <image
              v-if="signature"
              :href="signature"
              x="236" y="350" width="384" height="92"
              preserveAspectRatio="xMidYMid meet"
              :filter="`url(#${id('ink')})`"
            />
          </g>
          <text x="428" y="478" style="font-family: var(--font-heading); font-size: 11px; letter-spacing: 1.6px; fill: var(--ash); text-anchor: middle">SIGNED IN THE PRESENCE OF THOSE WHO SEE BEYOND</text>
        </g>
      </svg>
    </div>

    <button type="button" class="member-card-turn" @click="turned = !turned">
      {{ turned ? 'Turn to the front' : 'Turn the card over' }}
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch, getCurrentInstance, defineProps } from 'vue'
import zenerSymbols from '../data/zenerSymbols'

const props = defineProps({
  name: { type: String, default: 'Unsigned' },
  memberNo: { type: String, default: 'RV-0000-Ψ' },
  admitted: { type: String, default: '' },
  rank: { type: String, default: 'THE VIEWER' },
  cohort: { type: String, default: 'XXII' },
  expires: { type: String, default: 'Foreseen' },
  oath: {
    type: String,
    default: 'I shall look without eyes, travel without leaving, and report only what is seen.'
  },
  signature: { type: String, default: '' },
  // Zener symbol ids the member has earned; the rest show as empty frames.
  proficiency: { type: Array, default: () => [] }
})

/*
 * Two of these can be on the page at once -- a member's own card beside an
 * example, say -- and every clipPath, gradient and pattern below is
 * referenced by id. Duplicated ids all resolve to whichever came first, so
 * the second card would quietly borrow the first one's clips.
 */
const uid = getCurrentInstance().uid
const id = (part) => `rvc-card-${uid}-${part}`

const turned = ref(false)

/* The glyphs, keyed to the same ids the Precognition deck uses, so a symbol
   earned there is the symbol lit here. */
const PATHS = {
  circle: 'M12 4a8 8 0 1 0 0.01 0Z',
  cross: 'M12 3v18M3 12h18',
  waves: 'M3 8q3-3 6 0t6 0t6 0M3 13q3-3 6 0t6 0t6 0M3 18q3-3 6 0t6 0t6 0',
  square: 'M4 4h16v16H4Z',
  star: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6Z'
}

const symbols = zenerSymbols.map((symbol) => ({ ...symbol, d: PATHS[symbol.id] }))
const earned = (symbolId) => props.proficiency.includes(symbolId)

// Two lines, broken at the comma the oath is written around.
const oathLines = computed(() => {
  const parts = props.oath.split(/,\s*/)
  if (parts.length < 2) return [props.oath]
  const half = Math.ceil(parts.length / 2)
  return [parts.slice(0, half).join(', ') + ',', parts.slice(half).join(', ')]
})

/*
 * The name is the one field with no length at all to its credit: the plate
 * reads 'Ingo M. Swann' at 30px and a longer one simply runs off the card.
 * Measured rather than guessed from character count, because the display
 * face is narrow and counting letters gets it wrong both ways.
 *
 * The tracking is in em and not px for the same reason: a fixed 1.2px does
 * not shrink with the type, so one pass of scaling undershot and a long name
 * still ran 26px past its column.
 */
const NAME_SIZE = 30
// 384 to 810, the same column the footer rule spans, less a hair
const NAME_ROOM = 420
const nameEl = ref(null)
const nameSize = ref(NAME_SIZE)

const fitName = async () => {
  nameSize.value = NAME_SIZE
  await nextTick()
  const el = nameEl.value
  if (!el || typeof el.getComputedTextLength !== 'function') return
  const width = el.getComputedTextLength()
  if (width > NAME_ROOM) nameSize.value = Math.max(13, NAME_SIZE * (NAME_ROOM / width))
}

onMounted(async () => {
  await fitName()

  /*
   * And again once the face has actually arrived. The first measurement can
   * land while Unica One is still loading, in which case it sizes the name
   * against Impact's metrics and the real face comes in wider -- which is
   * how a fitted name was still running twelve pixels past its column.
   */
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready
    await fitName()
  }
})

watch(() => props.name, fitName)
</script>

<style scoped>
/*
 * ID-1 proportions -- 856 by 540 is a credit card at ten times its
 * millimetres -- so the thing prints at exactly card size and reads as an
 * object rather than a banner.
 */
.member-card {
  width: min(100%, 44rem);
  margin-inline: auto;
}

.member-card-pivot {
  position: relative;
  aspect-ratio: 856 / 540;
  transform-style: preserve-3d;
  transition: transform var(--dur-slow) var(--ease-settle);
}

.member-card.is-turned .member-card-pivot {
  transform: rotateY(180deg);
}

.member-card-face {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 28px;
  filter: drop-shadow(0 14px 30px rgba(0, 0, 0, 0.55));
}

.member-card-face.is-back {
  transform: rotateY(180deg);
}

.member-card-turn {
  display: block;
  margin: 1rem auto 0;
}

/* A card that snaps between faces is still legible; one that spins is not
   something to inflict on anyone who asked for less motion. */
@media (prefers-reduced-motion: reduce) {
  .member-card-pivot {
    transition: none;
  }
}
</style>
