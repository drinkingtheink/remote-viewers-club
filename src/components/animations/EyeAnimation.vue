<template>
  <div class="eye-animation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" aria-hidden="true">
      <defs>
        <!-- the iris is clipped to the opening so it cannot wander off the eye -->
        <clipPath id="watcher-eye-opening">
          <path d="M34 100C86 42 214 42 266 100C214 158 86 158 34 100Z" />
        </clipPath>
      </defs>

      <g id="watcher-lids">
        <g clip-path="url(#watcher-eye-opening)">
          <g id="watcher-gaze">
            <circle class="eye-iris" cx="150" cy="100" r="30" />
            <circle class="eye-pupil" cx="150" cy="100" r="12" />
            <circle class="eye-glint" cx="140" cy="90" r="5" />
          </g>
        </g>

        <path class="eye-lid" d="M34 100C86 42 214 42 266 100C214 158 86 158 34 100Z" />
      </g>

      <!-- rays, as a sigil of attention rather than an eyelash -->
      <g class="eye-rays">
        <path d="M150 28v-16M150 172v16M22 100H6M278 100h16M58 44 47 33M242 44l11-11M58 156l-11 11M242 156l11 11" />
      </g>
    </svg>
  </div>
</template>

<style>
.eye-animation {
  max-width: 260px;
  margin: 0 auto;
}

.eye-animation svg {
  overflow: visible;
}

.eye-lid {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 3px;
}

.eye-iris {
  fill: rgba(0, 0, 0, 0.55);
  stroke: var(--the-yellow);
  stroke-width: 2.5px;
}

.eye-pupil {
  fill: var(--the-yellow);
}

.eye-glint {
  fill: var(--leather-deep);
}

.eye-rays path {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 2.5px;
  stroke-linecap: round;
  opacity: 0.55;
}

/*
 * The gaze wanders on 11s and the lid closes on 6s. Neither divides into the
 * other, so the eye never blinks at the same point in its look twice -- the
 * thing that stops a loop reading as a loop.
 */
#watcher-gaze {
  animation: watcher-gaze 11s ease-in-out infinite;
}

@keyframes watcher-gaze {
  0%   { transform: translate(0, 0); }
  16%  { transform: translate(-46px, -8px); }
  32%  { transform: translate(38px, 6px); }
  48%  { transform: translate(-18px, 10px); }
  64%  { transform: translate(52px, -6px); }
  82%  { transform: translate(-34px, 4px); }
  100% { transform: translate(0, 0); }
}

#watcher-lids {
  transform-box: fill-box;
  transform-origin: center;
  animation: watcher-blink 6s ease-in-out infinite;
}

/* open for most of the cycle; the close is quick, as a lid is */
@keyframes watcher-blink {
  0%, 86%   { transform: scaleY(1); }
  92%       { transform: scaleY(0.06); }
  100%      { transform: scaleY(1); }
}

.watcher-session:hover #watcher-gaze {
  animation-duration: 6s;
}

.watcher-session:hover #watcher-lids {
  animation-duration: 3.5s;
}

@media (prefers-reduced-motion: reduce) {
  #watcher-gaze,
  #watcher-lids,
  .watcher-session:hover #watcher-gaze,
  .watcher-session:hover #watcher-lids {
    animation: none;
    transform: none;
  }
}
</style>
