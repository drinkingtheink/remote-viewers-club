<template>
  <div class="planchette-animation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <defs>
        <!-- one rose, placed three times at different sizes and angles -->
        <g id="board-rose">
          <!--
            A rose reads from nested cups, not from a coil: an outer bloom
            with the folds of the petals inside it. A spiral drawn true comes
            out looking like a shell at this size.
          -->
          <path class="rose-stem" d="M0 19Q4 32 -2 44" />
          <g class="rose-leaf" transform="translate(-1 29) rotate(158)">
            <path d="M0 0Q6 -7 15 -8Q10 -1 0 0Z" />
          </g>
          <g class="rose-leaf" transform="translate(1 36) rotate(26)">
            <path d="M0 0Q6 -7 15 -8Q10 -1 0 0Z" />
          </g>

          <path class="rose-bloom" d="M0.0 -19.5Q10.3 -21.4 15.2 -12.2Q23.2 -5.3 19.0 4.3Q18.6 14.8 8.5 17.6Q0.0 23.8 -8.5 17.6Q-18.6 14.8 -19.0 4.3Q-23.2 -5.3 -15.2 -12.2Q-10.3 -21.4 -0.0 -19.5Z" />
          <path class="rose-fold" d="M-12.5 -5.5C-7 -14.5 7 -14.5 12.5 -5.5" />
          <path class="rose-fold" d="M-15 2.5C-8.5 -5 8.5 -5 15 2.5" />
          <path class="rose-fold" d="M-10.5 10.5C-5 3.5 5 3.5 10.5 10.5" />
          <path class="rose-bud" d="M-5 -1.5C-2.5 -6 2.5 -6 5 -1.5C2.5 2 -2.5 2 -5 -1.5Z" />
        </g>
      </defs>

      <!--
        Apparitions, not printed decoration: each motif surfaces, holds, and
        lifts away again, and they take turns so the board is empty between
        them. The placement sits on a wrapper so the CSS transform underneath
        is free to animate without fighting a transform attribute.
      -->
      <g class="board-motifs" aria-hidden="true">
        <g transform="translate(107 42) scale(0.29)">
          <path class="motif board-skull" d="163.82,320.32c-13.17.73-25.51.78-38.36-.23.39-7.13,1.26-13.66,2.58-20.47.38-1.97.48-3.66.38-5.9-1.88.99-2.82,2.41-3.64,4.2-3.1,6.83-4.6,13.79-5.74,21.33l-13.43-1.96c-.19-1.01-.45-2.63-.35-3.41l2.39-18.97c-1.56.19-2.59.99-3.17,2.15-2.66,5.28-4.01,10.69-4.87,16.63-.15,1.03-1.31,2.02-2.27,1.76l-8.11-2.23v-15.82c0-1.54-1.39-3.81-2.99-3.16-1.07.44-1.8,2.95-1.85,4.15l-.51,12.4c-2.83-.92-5.01-2.5-6.65-4.69l-.56-29.66c-3.15-10.28-12.64-17.22-23.55-16.3-3.89-.33-7.95,0-11.58-1.4-6.35-2.46-12.56-5.16-18.21-8.98-4.85-3.28-8.25-8.48-10.95-13.53-2.41-4.53-3.13-9.62-2.78-14.57.55-7.73,9.89-5.65,13.01-10.09,1.76-2.51,2.46-6.13,2.55-9.27.4-14.24,3.08-27.46,7.68-40.9,3.87-11.32,4.72-22.85,2.13-34.43-1.74-7.8-4.37-15.05-9.56-21.35l4.58,17.09c3.55,13.25.16,27.53-4.04,40.48-2.29,7.06-3.63,14-4.27,21.42l-1.42,16.39c-.09,1.06-.69,2.23-1.76,3.18-5.2-8.88-8.85-17.86-11.61-27.65-2.69-9.53-4.96-18.84-6-28.79-1.19-11.36-1.23-22.42.08-33.73C6.18,69.1,34.99,33.07,75.7,14.46,98.91,3.85,123.93-.55,149.48.05c32.34.76,62.59,9.86,88.8,28.65,8.77,6.29,16.13,13.37,23.02,21.63,28.08,33.68,33.77,75.69,24,117.82-2.88,12.16-6.82,23.53-12.6,34.5l-1.99,1.26c-.45.28-1.16-1.29-1.21-1.84-.88-9.66-1.32-18.95-2.9-28.48-.94-5.66-2.96-10.81-4.66-16.32-3.57-11.62-4.85-23.76-2.3-35.75l4.44-16.19c-10.7,13.88-13.03,35.13-8.39,51.09l4.51,15.5c2.3,7.93,3.08,15.91,3.95,24.13l1.19,11.27c.38,3.62,4.34,5.72,7.6,6.53,4.58,1.14,6.95,3.98,7.11,8.57.25,6.93-2.17,13.27-6.1,19.01-3.04,4.45-6.5,8.27-11.44,10.62l-12.52,5.95c-2.79,1.32-6.06,1.82-9.18,1.9l-11.61.3c-7.75,2.61-13.9,8.49-16.45,16.25l-.55,28.19c-.15.77-.58,2.65-1.25,3.04l-5.81,3.42-.48-10.95c-.09-2-.69-4.76-1.7-6.39-2.01.2-3.16,2.48-3.17,4.19l-.04,15.52-10.12,2.72c-.24-7.56-2.14-13.84-5.37-20.14-.73-.41-1.58-.82-2.32-1.03l2,22.39-13.5,2.29c-1.38-8.03-2.84-15.09-6.22-22.1-.8-1.65-1.78-2.81-3.48-3.93-.33,1.78-.29,3.16.05,4.78,1.51,7.19,2.71,13.99,3.05,21.85ZM111.06,203.16c6.62-7.09,9.57-16.07,8.34-25.77-1.47-11.64-8.13-23.87-20.04-25.17-11.8-1.28-26.93,2.29-38.15,6.71-10.26,4.04-18.23,11.99-18.69,23.23-.35,8.55.57,16.92,2.81,25.08,2.1,7.64,8,12.9,16.02,13.38,19.42,1.16,36.25-3.06,49.7-17.46ZM247.33,184.13c-.1-13.62-8.58-22.36-21.15-26.41-9.64-3.11-19.33-5.18-29.46-5.88-9.36-.65-17.56,3.83-22.06,11.86-4.95,8.83-5.83,22.45-.75,31.43,11,19.44,33.11,27.59,55.03,25.49,17.27-1.65,18.51-21.2,18.4-36.49ZM145.83,252.37c3.42,4.46,5.84,7.67,9.73,10.32,3.5,2.38,8.25.98,11.02-2,3.7-3.98,4.85-9.45,3.08-14.75l-11.17-33.29c-1.47-4.37-3.29-8.49-5.66-12.25-3.14-4.98-9.17-5.97-13.82-2.62-3.88,2.79-6.03,6.83-7.52,11.44l-7.76,23.94-3.59,11.4c-1.77,5.61-.77,12.49,3.02,17.16s11.13,3.58,14.96-.71l7.71-8.64Z" />
        </g>
        <g transform="translate(56 142) scale(1.3) rotate(-14)">
          <use class="motif motif-rose-left" href="#board-rose" />
        </g>
        <g transform="translate(244 142) scale(1.3) rotate(14)">
          <use class="motif motif-rose-right" href="#board-rose" />
        </g>
      </g>

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

/*
 * The board's printed decoration. Filled rather than stroked, to match the
 * weight of the skull, and held well back: at full strength it competes with
 * the letters, which are the part that has to be legible.
 */
.board-skull {
  fill: var(--the-yellow);
  --motif-peak: 0.17;
}

/*
 * Each motif rises a little as it goes, so it reads as lifting off the board
 * rather than switching off. The cycle is long and they are offset against
 * each other, which leaves the board empty between apparitions -- the pause
 * is what makes the next one feel like an arrival.
 */
.motif {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
  animation: motif-surface var(--motif-cycle, 19s) ease-in-out infinite both;
}

.motif-rose-left {
  --motif-peak: 0.55;
  animation-delay: calc(var(--motif-cycle, 19s) * 0.4);
}

.motif-rose-right {
  --motif-peak: 0.55;
  animation-delay: calc(var(--motif-cycle, 19s) * 0.47);
}

@keyframes motif-surface {
  0%, 3% {
    opacity: 0;
    transform: scale(0.93) translateY(5px);
  }
  13%, 28% {
    opacity: var(--motif-peak, 0.3);
    transform: scale(1) translateY(0);
  }
  40%, 100% {
    opacity: 0;
    transform: scale(1.05) translateY(-6px);
  }
}

.spirit-board-session:hover .motif {
  --motif-cycle: 11s;
}

@media (prefers-reduced-motion: reduce) {
  .motif,
  .spirit-board-session:hover .motif {
    animation: none;
    transform: none;
    opacity: var(--motif-peak, 0.3);
  }
}

/*
 * The rose is drawn rather than filled. A silhouette this size collapses into
 * a blob; the furl is what makes a rose legible, and only line keeps it.
 */
#board-rose path {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 2.1px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

#board-rose .rose-bloom {
  stroke-width: 2.3px;
}

#board-rose .rose-leaf path,
#board-rose .rose-stem {
  stroke-width: 1.8px;
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
