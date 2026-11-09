<template>
  <div class="planchette-animation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <g id="planchette-arc">
        <text
          v-for="letter in letters"
          :key="letter.ch"
          :x="letter.x"
          :y="letter.y"
          :transform="`rotate(${letter.rotate} ${letter.x} ${letter.y})`"
        >{{ letter.ch }}</text>
      </g>

      <g id="planchette-drifting">
        <path
          class="planchette-body"
          fill-rule="evenodd"
          d="M0,-21 C13,-21 23,-12 23,1 C23,15 12,28 0,38 C-12,28 -23,15 -23,1 C-23,-12 -13,-21 0,-21 Z
             M10,0 A10,10 0 1 0 -10,0 A10,10 0 1 0 10,0 Z"
        />
        <circle class="planchette-aperture" cx="0" cy="0" r="10" />
      </g>
    </svg>
  </div>
</template>

<script setup>
const CHARS = 'ABCDEFG'.split('')

// Same fan the real board uses, just a short run of it.
const letters = CHARS.map((ch, i) => {
  const t = i / (CHARS.length - 1)
  const deg = 212 + (328 - 212) * t
  const rad = (deg * Math.PI) / 180

  return {
    ch,
    x: 150 + 118 * Math.cos(rad),
    y: 150 + 118 * Math.sin(rad),
    rotate: deg + 90
  }
})
</script>

<style>
.planchette-animation {
  max-width: 260px;
  margin: 0 auto;
}

.planchette-animation svg {
  overflow: visible;
}

#planchette-arc text {
  fill: var(--the-yellow);
  font-family: var(--font-heading);
  font-size: 22px;
  text-anchor: middle;
  dominant-baseline: middle;
  opacity: 0.85;
}

.planchette-body {
  fill: rgba(0, 0, 0, 0.55);
  stroke: var(--the-yellow);
  stroke-width: 2.5px;
}

.planchette-aperture {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 2.5px;
}

/* Carried rather than animated: a slow, slightly uneven wander. */
#planchette-drifting {
  animation: planchette-wander 11s ease-in-out infinite;
}

@keyframes planchette-wander {
  0%   { transform: translate(150px, 96px); }
  18%  { transform: translate(104px, 78px); }
  36%  { transform: translate(186px, 70px); }
  54%  { transform: translate(132px, 104px); }
  72%  { transform: translate(206px, 92px); }
  100% { transform: translate(150px, 96px); }
}

.spirit-board-session:hover #planchette-drifting {
  animation-duration: 6s;
}

@media (prefers-reduced-motion: reduce) {
  #planchette-drifting,
  .spirit-board-session:hover #planchette-drifting {
    animation: none;
    transform: translate(150px, 96px);
  }
}
</style>
