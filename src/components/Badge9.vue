<template>
  <div class="grand-ephemeris" :class="{ animate: doAnimate }">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 680" role="img" aria-label="Grand Ephemeris mission patch">
      <defs>
        <clipPath id="ephemeris-field">
          <circle cx="344" cy="330" r="262" />
        </clipPath>
        <clipPath id="ephemeris-globe">
          <circle cx="206" cy="252" r="118" />
        </clipPath>
        <linearGradient id="ephemeris-sweep" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#fff" stop-opacity="0.22" />
          <stop offset="0.55" stop-color="#fff" stop-opacity="0.22" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Rim, mid-blue ground, white rule, then the night it all sits on.
           The blue is a disc and not a stroke, so the white rule has
           something to sit in rather than against. -->
      <circle class="disc" cx="340" cy="336" r="306" />
      <circle class="ring-outer" cx="340" cy="336" r="318" />
      <circle class="ring-inner" cx="340" cy="336" r="286" />
      <circle class="field" cx="344" cy="330" r="262" />

      <g clip-path="url(#ephemeris-field)">
        <g class="globe">
          <circle class="globe-sea" cx="206" cy="252" r="118" />
          <g clip-path="url(#ephemeris-globe)">
            <!-- Four small shapes read as scattered rocks. Two large ones
                 that run off the limb read as a world. -->
            <g class="globe-land">
              <path d="M96 168 150 152 198 170 236 156 262 186 244 214 196 226 170 212 134 220 102 206Z" />
              <path d="M110 254 158 238 214 248 258 272 268 304 240 336 184 348 134 330 106 296Z" />
              <path d="M268 214 300 208 314 232 294 254 266 246Z" />
            </g>
          </g>
        </g>

        <!-- The ringed one, keeping station below the world. It has to sit
             clear of the landmasses: it is drawn in the same blue, so any
             overlap and the two read as one shape. -->
        <g class="ringed-planet">
          <circle cx="132" cy="396" r="26" />
          <ellipse class="planet-ring" cx="132" cy="396" rx="47" ry="13" transform="rotate(-18 132 396)" />
        </g>

        <!-- The charge is a pick, not a shield, and the bolt is struck out
             of it rather than laid on top. -->
        <g class="charge">
          <path
            class="charge-face"
            d="M440 194c40 0 60 28 60 58 0 42-36 80-60 80s-60-38-60-80c0-30 20-58 60-58Z"
          />
          <path class="bolt" d="M454 222l-36 52h21l-9 42 36-54h-21Z" />
        </g>

        <g class="minor-stars">
          <path d="M214 322q4 20 22 24-18 4-22 24-4-20-22-24 18-4 22-24Z" />
          <path d="M330 440q5 24 26 30-21 6-26 30-5-24-26-30 21-6 26-30Z" />
          <path d="M476 372q5 22 24 28-19 6-24 28-5-22-24-28 19-6 24-28Z" />
          <path d="M428 408q3 13 15 17-12 4-15 17-3-13-15-17 12-4 15-17Z" />
          <path d="M288 494q3 12 14 15-11 3-14 15-3-12-14-15 11-3 14-15Z" />
        </g>

        <!-- Two of the three trails. They fall from the star rather than
             rising to it, which is the whole shape of the thing. -->
        <path
          class="trail-gold"
          d="M320 208c-8 78-48 154-134 224-16 13-24 28-6 32 96-64 150-166 160-252Z"
        />
        <path
          class="trail-blue"
          d="M360 208c10 82 44 164 96 238 10 15 0 32-14 19-60-76-94-172-102-255Z"
        />

        <rect class="sweep" x="-680" y="0" width="680" height="680" fill="url(#ephemeris-sweep)" />
      </g>

      <!-- Left out of the clip deliberately: on the plate this one runs off
           the rim at the lower left instead of stopping politely at it. -->
      <path
        class="trail-scarlet"
        d="M340 202c-6 102-62 208-168 302-32 28-70 54-52 64 120-64 214-210 232-362Z"
      />

      <g class="major-star">
        <path class="star-pale" d="M336 104q14 62 70 72-56 10-70 72-14-62-70-72 56-10 70-72Z" />
        <path class="star-gold" d="M336 124q12 50 58 58-46 8-58 58-12-50-58-58 46-8 58-58Z" />
        <circle class="star-core" cx="336" cy="180" r="7" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'badge-9',
  data() {
    return {
      intervalId: null,
      doAnimate: false
    }
  },
  mounted() {
    // the cadence the rest of the plates keep: a pass on arrival, then every
    // so often, so a wall of them never flares in unison
    this.intervalId = setInterval(() => {
      this.doAnimate = true
      setTimeout(() => {
        this.doAnimate = false
      }, 8000)
    }, 15000)

    this.doAnimate = true
    setTimeout(() => {
      this.doAnimate = false
    }, 5000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  }
}
</script>

<style scoped>
/* --- the plate ---------------------------------------------------------- */

.disc {
  fill: #3d7cb8;
}

.ring-outer {
  fill: none;
  stroke: #d8383a;
  stroke-width: 22px;
}

.ring-inner {
  fill: none;
  stroke: #fff;
  stroke-width: 8px;
}

.field {
  fill: #0e2a4e;
}

/* --- the world ---------------------------------------------------------- */

.globe-sea {
  fill: #123458;
}

.globe-land path {
  fill: #3d7cb8;
}

.ringed-planet circle {
  fill: #3d7cb8;
}

.planet-ring {
  fill: none;
  stroke: #3d7cb8;
  stroke-width: 7px;
}

/* --- the charge --------------------------------------------------------- */

.charge-face {
  fill: #ead455;
}

.bolt {
  fill: #0e2a4e;
}

/* --- the trails --------------------------------------------------------- */

.trail-gold {
  fill: #ead455;
}

.trail-blue {
  fill: #3d7cb8;
}

.trail-scarlet {
  fill: #d8383a;
}

/* --- the sky ------------------------------------------------------------ */

.star-pale {
  fill: #fff;
}

.star-gold {
  fill: #ead455;
}

.star-core {
  fill: #fff;
}

.minor-stars path {
  fill: #fff;
}

/*
 * The star keeps its own slow breath; the small ones each get a different
 * period and a head start, so the sky never twinkles in chorus.
 */
.major-star {
  transform-box: fill-box;
  transform-origin: center;
  animation: ephemeris-flare 6.5s ease-in-out infinite;
}

@keyframes ephemeris-flare {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.9; }
}

.minor-stars path {
  animation: ephemeris-twinkle 5s ease-in-out infinite;
}

.minor-stars path:nth-child(2) { animation-duration: 7.4s; animation-delay: -2.2s; }
.minor-stars path:nth-child(3) { animation-duration: 4.3s; animation-delay: -3.5s; }
.minor-stars path:nth-child(4) { animation-duration: 8.1s; animation-delay: -1.1s; }
.minor-stars path:nth-child(5) { animation-duration: 6.2s; animation-delay: -4.6s; }

@keyframes ephemeris-twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* --- the pass ----------------------------------------------------------- */

/* Parked off the left edge and only sent across while `animate` is set, so
   the plate is still until it is looked at. */
.sweep {
  opacity: 0;
}

.animate .sweep {
  animation: ephemeris-pass 2.6s cubic-bezier(0.33, 1, 0.68, 1) 0.2s;
}

@keyframes ephemeris-pass {
  0% { transform: translateX(0); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateX(1500px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .major-star,
  .minor-stars path,
  .animate .sweep {
    animation: none;
  }
}
</style>
