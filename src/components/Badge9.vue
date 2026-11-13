<template>
  <div class="grand-ephemeris" :class="{ animate: doAnimate }">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 680" role="img" aria-label="Grand Ephemeris mission patch">
      <defs>
        <clipPath id="ephemeris-field">
          <circle cx="340" cy="340" r="288" />
        </clipPath>
        <clipPath id="ephemeris-globe">
          <circle cx="232" cy="288" r="92" />
        </clipPath>
        <linearGradient id="ephemeris-sweep" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#fff" stop-opacity="0.26" />
          <stop offset="0.55" stop-color="#fff" stop-opacity="0.26" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>

      <circle class="field" cx="340" cy="340" r="290" />

      <g clip-path="url(#ephemeris-field)">
        <!-- the register: a dashed stroke rather than fifty tick marks -->
        <circle class="register" cx="340" cy="340" r="268" />

        <g class="globe">
          <circle class="globe-sea" cx="232" cy="288" r="92" />
          <g clip-path="url(#ephemeris-globe)">
            <!-- Angular, not round. Drawn with curves these came out as four
                 neat discs and the whole globe read as a moon. -->
            <g class="globe-land">
              <path d="M152 258 184 232 214 240 236 230 248 252 230 274 202 280 178 296 158 286Z" />
              <path d="M180 318 206 300 240 306 266 326 260 352 232 368 202 360 182 340Z" />
              <path d="M264 232 294 228 310 248 296 268 270 262 258 246Z" />
              <path d="M284 296 304 304 300 322 280 316Z" />
            </g>
            <!-- the lit limb falls away to the right, which is what makes a
                 disc read as a sphere rather than a sticker -->
            <circle class="globe-shadow" cx="286" cy="268" r="104" />
          </g>
          <circle class="globe-rim" cx="232" cy="288" r="92" />
        </g>

        <g class="shield">
          <path
            class="shield-face"
            d="M392 234h120v70c0 42-30 70-60 82-30-12-60-40-60-82Z"
          />
          <path
            class="shield-edge"
            d="M392 234h120v70c0 42-30 70-60 82-30-12-60-40-60-82Z"
          />
          <path class="bolt" d="M468 256l-54 66h28l-10 56 54-68h-28Z" />
        </g>

        <!--
          The contrails.
          
          The gold is a stroked arc and the scarlet a filled taper, which is
          not an inconsistency but the fix: as two filled tapers the bands
          nested inside one another whichever way they were widened, and the
          gold was swallowed whole every time. A stroke has a width of its
          own and simply sits alongside.

          Its line is placed off the scarlet's measured outline rather than
          guessed at. Sampling that path gives a lower edge running (192,572)
          to (264,491) to (316,395), and the gold runs a half-width clear of
          it the whole way, converging only at the top where they should.
        -->
        <path class="ribbon-gold" d="M164 604C250 570 310 480 334 352" />
        <path class="ribbon-scarlet" d="M132 532C226 500 318 400 352 220 344 396 270 500 192 572Z" />

        <g class="minor-stars">
          <path d="M300 240q3 15 18 18-15 3-18 18-3-15-18-18 15-3 18-18Z" />
          <path d="M378 352q4 18 22 22-18 4-22 22-4-18-22-22 18-4 22-22Z" />
          <path d="M268 420q3 13 16 16-13 3-16 16-3-13-16-16 13-3 16-16Z" />
          <path d="M430 448q3 14 17 17-14 3-17 17-3-14-17-17 14-3 17-17Z" />
          <path d="M196 468q2 11 13 13-11 2-13 13-2-11-13-13 11-2 13-13Z" />
          <path d="M506 200q3 13 16 16-13 3-16 16-3-13-16-16 13-3 16-16Z" />
        </g>

        <g class="major-star">
          <path d="M342 112q10 54 64 64-54 10-64 64-10-54-64-64 54-10 64-64Z" />
          <circle class="major-star-core" cx="342" cy="176" r="9" />
        </g>

        <!-- a light crossing the plate, on the same beat the other badges keep -->
        <rect class="sweep" x="-680" y="0" width="680" height="680" fill="url(#ephemeris-sweep)" />
      </g>

      <circle class="ring-inner" cx="340" cy="340" r="297" />
      <circle class="ring-outer" cx="340" cy="340" r="317" />
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
    // the same cadence the rest of the plates keep: a pass on arrival, then
    // every so often, so a wall of them never flares in unison
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

.field {
  fill: #11305c;
}

.ring-outer {
  fill: none;
  stroke: #e01b2e;
  stroke-width: 26px;
}

.ring-inner {
  fill: none;
  stroke: #fff;
  stroke-width: 13px;
}

.register {
  fill: none;
  stroke: #f2c230;
  stroke-width: 9px;
  stroke-dasharray: 2 17;
  opacity: 0.32;
}

/* --- the world ---------------------------------------------------------- */

.globe-sea {
  fill: #2e6fb7;
}

.globe-land path {
  fill: #16457f;
}

.globe-shadow {
  fill: #0d2a52;
  opacity: 0.34;
}

.globe-rim {
  fill: none;
  stroke: #0d2a52;
  stroke-width: 3px;
  opacity: 0.6;
}

/* --- the charge --------------------------------------------------------- */

.shield-face {
  fill: #1f5fa8;
}

.shield-edge {
  fill: none;
  stroke: #f2c230;
  stroke-width: 9px;
  stroke-linejoin: round;
}

.bolt {
  fill: #f2c230;
}

/* --- the contrails ------------------------------------------------------ */

.ribbon-gold {
  fill: none;
  stroke: #f2c230;
  stroke-width: 30px;
  stroke-linecap: round;
}

.ribbon-scarlet {
  fill: #e01b2e;
}

/* --- the sky ------------------------------------------------------------ */

.major-star path {
  fill: #fff;
}

.major-star-core {
  fill: #f2c230;
}

.minor-stars path {
  fill: #fff;
  opacity: 0.85;
}

/*
 * The big star keeps its own slow breath; the small ones each get a
 * different period and a head start, so the sky never twinkles in chorus.
 */
.major-star {
  transform-box: fill-box;
  transform-origin: center;
  animation: ephemeris-flare 6.5s ease-in-out infinite;
}

@keyframes ephemeris-flare {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.07); opacity: 0.88; }
}

.minor-stars path {
  animation: ephemeris-twinkle 5s ease-in-out infinite;
}

.minor-stars path:nth-child(2) { animation-duration: 7.4s; animation-delay: -2.2s; }
.minor-stars path:nth-child(3) { animation-duration: 4.3s; animation-delay: -3.5s; }
.minor-stars path:nth-child(4) { animation-duration: 8.1s; animation-delay: -1.1s; }
.minor-stars path:nth-child(5) { animation-duration: 6.2s; animation-delay: -4.6s; }
.minor-stars path:nth-child(6) { animation-duration: 9.3s; animation-delay: -0.7s; }

@keyframes ephemeris-twinkle {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.22; }
}

/* --- the pass ----------------------------------------------------------- */

/*
 * Parked off the left edge and only sent across while `animate` is set, so
 * the plate is still until it is looked at.
 */
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
