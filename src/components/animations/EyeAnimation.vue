<template>
  <div class="eye-animation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 216" aria-hidden="true">
      <defs>
        <!-- the iris is clipped to the opening so it cannot wander off the eye -->
        <clipPath id="watcher-eye-opening">
          <path d="M46 108C86 56 214 56 254 108C214 160 86 160 46 108Z" />
        </clipPath>
      </defs>

      <!--
        Orbits. Three ellipses at different radii and dash patterns, each
        turning at its own rate, which is what reads as orbital rather than
        as a spinning wheel.
      -->
      <g class="eye-orbits">
        <ellipse class="orbit orbit-outer" cx="150" cy="108" rx="140" ry="97" />
        <ellipse class="orbit orbit-mid" cx="150" cy="108" rx="122" ry="82" />
        <ellipse class="orbit orbit-inner" cx="150" cy="108" rx="104" ry="68" />
      </g>

      <!-- One path per star. They shared a single path before, so all eight
           brightened and dimmed together, which reads as the whole sky
           pulsing rather than as stars. -->
      <g class="eye-stars">
        <path d="M38 29Q39.12 34.88 45 36Q39.12 37.12 38 43Q36.88 37.12 31 36Q36.88 34.88 38 29Z" />
        <path d="M266 38.5Q266.88 43.12 271.5 44Q266.88 44.88 266 49.5Q265.12 44.88 260.5 44Q265.12 43.12 266 38.5Z" />
        <path d="M22 165Q22.8 169.2 27 170Q22.8 170.8 22 175Q21.2 170.8 17 170Q21.2 169.2 22 165Z" />
        <path d="M278 157.5Q279.04 162.96 284.5 164Q279.04 165.04 278 170.5Q276.96 165.04 271.5 164Q276.96 162.96 278 157.5Z" />
        <path d="M150 9Q150.8 13.2 155 14Q150.8 14.8 150 19Q149.2 14.8 145 14Q149.2 13.2 150 9Z" />
        <path d="M150 199.5Q150.72 203.28 154.5 204Q150.72 204.72 150 208.5Q149.28 204.72 145.5 204Q149.28 203.28 150 199.5Z" />
        <path d="M96 18Q96.64 21.36 100 22Q96.64 22.64 96 26Q95.36 22.64 92 22Q95.36 21.36 96 18Z" />
        <path d="M214 188Q214.64 191.36 218 192Q214.64 192.64 214 196Q213.36 192.64 210 192Q213.36 191.36 214 188Z" />
      </g>

      <g id="watcher-lids">
        <g clip-path="url(#watcher-eye-opening)">
          <g id="watcher-gaze">
            <circle class="eye-iris" cx="150" cy="108" r="26" />
            <g class="eye-striae">
              <path d="M163.0 108.0L175.0 108.0M162.6 111.4L174.1 114.5M161.3 114.5L171.7 120.5M159.2 117.2L167.7 125.7M156.5 119.3L162.5 129.7M153.4 120.6L156.5 132.1M150.0 121.0L150.0 133.0M146.6 120.6L143.5 132.1M143.5 119.3L137.5 129.7M140.8 117.2L132.3 125.7M138.7 114.5L128.3 120.5M137.4 111.4L125.9 114.5M137.0 108.0L125.0 108.0M137.4 104.6L125.9 101.5M138.7 101.5L128.3 95.5M140.8 98.8L132.3 90.3M143.5 96.7L137.5 86.3M146.6 95.4L143.5 83.9M150.0 95.0L150.0 83.0M153.4 95.4L156.5 83.9M156.5 96.7L162.5 86.3M159.2 98.8L167.7 90.3M161.3 101.5L171.7 95.5M162.6 104.6L174.1 101.5" />
            </g>
            <circle class="eye-pupil" cx="150" cy="108" r="11" />
            <circle class="eye-glint" cx="146" cy="104" r="3" />
          </g>
        </g>

        <path class="eye-lid" d="M46 108C86 56 214 56 254 108C214 160 86 160 46 108Z" />

        <g class="eye-lashes">
          <path d="M60.5 94.0l-5.5 -7.3M75.1 85.0l-4.8 -9.6M92.0 78.0l-3.9 -11.5M110.4 73.0l-2.7 -12.9M129.9 70.0l-1.4 -13.7M150.0 69.0l0.0 -14.0M170.1 70.0l1.4 -13.7M189.6 73.0l2.7 -12.9M208.0 78.0l3.9 -11.5M224.9 85.0l4.8 -9.6M239.5 94.0l5.5 -7.3" />
          <path d="M60.5 122.0l-5.5 7.3M75.1 131.0l-4.8 9.6M92.0 138.0l-3.9 11.5M110.4 143.0l-2.7 12.9M129.9 146.0l-1.4 13.7M150.0 147.0l0.0 14.0M170.1 146.0l1.4 13.7M189.6 143.0l2.7 12.9M208.0 138.0l3.9 11.5M224.9 131.0l4.8 9.6M239.5 122.0l5.5 7.3" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style>
.eye-animation {
  max-width: 280px;
  margin: 0 auto;
}

.eye-animation svg {
  overflow: visible;
}

/* bone line-work, as an engraved plate rather than a filled illustration */
.eye-lid {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 2.6px;
}

.eye-iris {
  fill: rgba(0, 0, 0, 0.5);
  stroke: var(--the-yellow);
  stroke-width: 2px;
}

.eye-striae path {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 1.1px;
  opacity: 0.62;
}

.eye-pupil { fill: var(--the-yellow); }
.eye-glint { fill: var(--leather-deep); }

.eye-lashes path {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 1.8px;
  stroke-linecap: round;
}

.orbit {
  fill: none;
  stroke: var(--the-yellow);
  transform-box: fill-box;
  transform-origin: center;
}

.orbit-outer {
  stroke-width: 1.2px;
  stroke-dasharray: 2 9;
  stroke-linecap: round;
  opacity: 0.5;
  animation: orbit-turn 150s linear infinite;
}

.orbit-mid {
  stroke-width: 1px;
  opacity: 0.32;
  animation: orbit-turn 96s linear infinite reverse;
}

.orbit-inner {
  stroke-width: 1.2px;
  stroke-dasharray: 1 7;
  stroke-linecap: round;
  opacity: 0.45;
  animation: orbit-turn 64s linear infinite;
}

@keyframes orbit-turn {
  to { transform: rotate(360deg); }
}

.eye-stars path {
  fill: var(--the-yellow);
  opacity: 0.55;
  animation: star-glimmer 7s ease-in-out infinite;
}

.eye-stars path:nth-child(2) { animation-duration: 9.3s; animation-delay: -3.1s; }
.eye-stars path:nth-child(3) { animation-duration: 5.6s; animation-delay: -1.4s; }
.eye-stars path:nth-child(4) { animation-duration: 8.1s; animation-delay: -5.2s; }
.eye-stars path:nth-child(5) { animation-duration: 6.4s; animation-delay: -2.7s; }
.eye-stars path:nth-child(6) { animation-duration: 10.2s; animation-delay: -6.8s; }
.eye-stars path:nth-child(7) { animation-duration: 7.7s; animation-delay: -0.9s; }
.eye-stars path:nth-child(8) { animation-duration: 5.9s; animation-delay: -4.3s; }

@keyframes star-glimmer {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.22; }
}

/*
 * The gaze wanders on 11s and the lid closes on 6s. Neither divides into the
 * other, so the eye never blinks at the same point in its look twice -- the
 * thing that stops a loop reading as a loop.
 */
#watcher-gaze {
  animation: watcher-gaze 11s ease-in-out infinite;
}

/*
 * An eye moves in jumps and then stays. Every stop is held and every move
 * between them takes about two per cent of the cycle, a fifth of a second,
 * so it snaps; easing evenly from one position to the next made it sweep
 * the room like a searchlight instead.
 *
 * It opens and closes on centre, and holds there longest. That is the beat
 * the whole session is about -- the moment it is looking at you rather than
 * past you.
 */
@keyframes watcher-gaze {
  0%, 15%   { transform: translate(0, 0); }
  17%, 29%  { transform: translate(-34px, -5px); }
  31%, 41%  { transform: translate(29px, 4px); }
  43%, 52%  { transform: translate(-12px, 7px); }
  54%, 67%  { transform: translate(40px, -4px); }
  69%, 80%  { transform: translate(-26px, 2px); }
  82%, 100% { transform: translate(0, 0); }
}

/*
 * And the pupil tightens when it finds you. Contracted on centre, open
 * while it is searching: a small thing, but it is the difference between an
 * eye that moves and an eye that is looking.
 */
.eye-pupil {
  animation: watcher-focus 11s ease-out infinite;
}

@keyframes watcher-focus {
  0%, 15%   { r: 9px; }
  18%, 79%  { r: 12px; }
  83%, 100% { r: 9px; }
}

#watcher-lids {
  transform-box: fill-box;
  transform-origin: center;
  animation: watcher-blink 6s ease-in-out infinite;
}

/*
 * A lid shuts faster than it opens -- roughly 80ms down against 180ms back
 * -- and the old blink took the same slow beat each way, which is what made
 * it read as a squash rather than a blink. Asymmetric now, and quick.
 *
 * Two of them per cycle, unevenly spaced, because an eye that blinks on a
 * metronome is a machine. The second is the half-blink everybody does and
 * nobody notices.
 */
@keyframes watcher-blink {
  0%, 43% { transform: scaleY(1); }
  45% { transform: scaleY(0.35); }
  47.5% { transform: scaleY(1); }
  88% { transform: scaleY(1); }
  89.5% { transform: scaleY(0.04); }
  93% { transform: scaleY(1); }
  100% { transform: scaleY(1); }
}

/*
 * Hover: it notices you.
 *
 * Every animation here sped up on hover, which is what you do when you have
 * nothing particular to say -- and it said the wrong thing on this panel of
 * all of them. The others each do something: Remote Viewing turns day to
 * night, the board's skull starts talking. This one is about being watched,
 * so what it does is stop pretending to be busy and look at you.
 *
 * The gaze snaps rather than eases, because that is what an eye does when
 * it finds something; a lock-on that glides reads as a camera. Everything
 * else goes quiet around it -- the orbits almost stop, the stars slow --
 * so the stillness is the event.
 */
.watcher-session:hover #watcher-gaze {
  animation: none;
  transform: translate(0, 0);
}

/* It widens, and it does not blink while it is looking at you. That is the
   part that unsettles. */
.watcher-session:hover #watcher-lids {
  animation: none;
  transform: scaleY(1.06);
  transition: transform 260ms var(--ease-out);
}

.watcher-session:hover .eye-pupil {
  animation: none;
  r: 8px;
  transition: r 260ms var(--ease-out);
}

.watcher-session:hover .eye-striae path {
  opacity: 0.9;
  transition: opacity 260ms var(--ease-out);
}

.watcher-session:hover .orbit-outer { animation-duration: 420s; }
.watcher-session:hover .orbit-mid { animation-duration: 300s; }
.watcher-session:hover .orbit-inner { animation-duration: 240s; }
.watcher-session:hover .eye-stars path { animation-duration: 14s; }

@media (prefers-reduced-motion: reduce) {
  #watcher-gaze,
  #watcher-lids,
  .eye-pupil,
  .orbit,
  .eye-stars path,
  .watcher-session:hover #watcher-gaze,
  .watcher-session:hover #watcher-lids,
  .watcher-session:hover .eye-pupil,
  .watcher-session:hover .orbit {
    animation: none;
    transform: none;
    transition: none;
  }
}
</style>
