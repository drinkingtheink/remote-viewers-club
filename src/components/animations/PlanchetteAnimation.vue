<template>
  <div class="planchette-animation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 248">
      <defs>
        <!-- one rose, placed three times at different sizes and angles -->
        <g id="board-rose">
          <!--
            A rose reads from petals that OVERLAP: the giveaway is internal
            edges crossing the bloom off-centre. A circle with arcs nested
            inside it reads as a target, which is what the last two attempts
            at this were.
          -->
          <path class="rose-stem" d="M1 28C7 42 3 54 -5 66" />
          <path class="rose-thorn" d="M4 38l7 -3l-5 6Z" />
          <path class="rose-thorn" d="M1 52l-8 -2l6 6Z" />

          <g class="rose-leaf" transform="translate(3 42) rotate(20)">
            <path d="M0 0C5 -8 14 -12 23 -11C20 -3 11 3 0 0Z" />
            <path class="rose-rib" d="M1 -1L20 -9" />
          </g>
          <g class="rose-leaf" transform="translate(-2 56) rotate(162) scale(1 -1)">
            <path d="M0 0C5 -8 14 -12 23 -11C20 -3 11 3 0 0Z" />
            <path class="rose-rib" d="M1 -1L20 -9" />
          </g>

          <!-- lobed silhouette: the outline itself is never a circle -->
          <path d="M-29 3C-33 -13 -23 -28 -5 -30C11 -32 29 -23 30 -4C31 12 20 27 2 29C-15 31 -27 19 -29 3Z" />
          <!-- outer wrap, crossing the bloom from one rim to the other -->
          <path d="M-29 3C-14 -1 -2 4 5 14C9 21 6 27 2 29" />
          <path d="M30 -4C17 -9 4 -5 -3 4" />
          <!-- the inner petals, each tucked behind the one in front -->
          <path d="M-22 -15C-9 -23 9 -20 17 -7" />
          <path d="M-12 -22C1 -26 13 -20 16 -9" />
          <path d="M-7 -13C1 -17 10 -13 11 -4" />
          <!-- the furl, off-centre as a real one is -->
          <path d="M-3 -4C1 -9 9 -6 8 0C7 5 0 7 -3 2Z" />
        </g>
      </defs>

      <!--
        Apparitions, not printed decoration: each motif surfaces, holds, and
        lifts away again, and they take turns so the board is empty between
        them. The placement sits on a wrapper so the CSS transform underneath
        is free to animate without fighting a transform attribute.
      -->
      <g class="board-motifs" aria-hidden="true">
        <!--
          Set below the letter arc, which runs across the top of the board, so
          an apparition never comes up through the writing.
        -->
        <g class="motif board-skull">
          <circle class="motif-halo" cx="150" cy="154" r="68" />
          <g transform="translate(113 100) scale(0.255)">
            <path class="skull-bone" d="M163.82,320.32c-13.17.73-25.51.78-38.36-.23.39-7.13,1.26-13.66,2.58-20.47.38-1.97.48-3.66.38-5.9-1.88.99-2.82,2.41-3.64,4.2-3.1,6.83-4.6,13.79-5.74,21.33l-13.43-1.96c-.19-1.01-.45-2.63-.35-3.41l2.39-18.97c-1.56.19-2.59.99-3.17,2.15-2.66,5.28-4.01,10.69-4.87,16.63-.15,1.03-1.31,2.02-2.27,1.76l-8.11-2.23v-15.82c0-1.54-1.39-3.81-2.99-3.16-1.07.44-1.8,2.95-1.85,4.15l-.51,12.4c-2.83-.92-5.01-2.5-6.65-4.69l-.56-29.66c-3.15-10.28-12.64-17.22-23.55-16.3-3.89-.33-7.95,0-11.58-1.4-6.35-2.46-12.56-5.16-18.21-8.98-4.85-3.28-8.25-8.48-10.95-13.53-2.41-4.53-3.13-9.62-2.78-14.57.55-7.73,9.89-5.65,13.01-10.09,1.76-2.51,2.46-6.13,2.55-9.27.4-14.24,3.08-27.46,7.68-40.9,3.87-11.32,4.72-22.85,2.13-34.43-1.74-7.8-4.37-15.05-9.56-21.35l4.58,17.09c3.55,13.25.16,27.53-4.04,40.48-2.29,7.06-3.63,14-4.27,21.42l-1.42,16.39c-.09,1.06-.69,2.23-1.76,3.18-5.2-8.88-8.85-17.86-11.61-27.65-2.69-9.53-4.96-18.84-6-28.79-1.19-11.36-1.23-22.42.08-33.73C6.18,69.1,34.99,33.07,75.7,14.46,98.91,3.85,123.93-.55,149.48.05c32.34.76,62.59,9.86,88.8,28.65,8.77,6.29,16.13,13.37,23.02,21.63,28.08,33.68,33.77,75.69,24,117.82-2.88,12.16-6.82,23.53-12.6,34.5l-1.99,1.26c-.45.28-1.16-1.29-1.21-1.84-.88-9.66-1.32-18.95-2.9-28.48-.94-5.66-2.96-10.81-4.66-16.32-3.57-11.62-4.85-23.76-2.3-35.75l4.44-16.19c-10.7,13.88-13.03,35.13-8.39,51.09l4.51,15.5c2.3,7.93,3.08,15.91,3.95,24.13l1.19,11.27c.38,3.62,4.34,5.72,7.6,6.53,4.58,1.14,6.95,3.98,7.11,8.57.25,6.93-2.17,13.27-6.1,19.01-3.04,4.45-6.5,8.27-11.44,10.62l-12.52,5.95c-2.79,1.32-6.06,1.82-9.18,1.9l-11.61.3c-7.75,2.61-13.9,8.49-16.45,16.25l-.55,28.19c-.15.77-.58,2.65-1.25,3.04l-5.81,3.42-.48-10.95c-.09-2-.69-4.76-1.7-6.39-2.01.2-3.16,2.48-3.17,4.19l-.04,15.52-10.12,2.72c-.24-7.56-2.14-13.84-5.37-20.14-.73-.41-1.58-.82-2.32-1.03l2,22.39-13.5,2.29c-1.38-8.03-2.84-15.09-6.22-22.1-.8-1.65-1.78-2.81-3.48-3.93-.33,1.78-.29,3.16.05,4.78,1.51,7.19,2.71,13.99,3.05,21.85ZM111.06,203.16c6.62-7.09,9.57-16.07,8.34-25.77-1.47-11.64-8.13-23.87-20.04-25.17-11.8-1.28-26.93,2.29-38.15,6.71-10.26,4.04-18.23,11.99-18.69,23.23-.35,8.55.57,16.92,2.81,25.08,2.1,7.64,8,12.9,16.02,13.38,19.42,1.16,36.25-3.06,49.7-17.46ZM247.33,184.13c-.1-13.62-8.58-22.36-21.15-26.41-9.64-3.11-19.33-5.18-29.46-5.88-9.36-.65-17.56,3.83-22.06,11.86-4.95,8.83-5.83,22.45-.75,31.43,11,19.44,33.11,27.59,55.03,25.49,17.27-1.65,18.51-21.2,18.4-36.49ZM145.83,252.37c3.42,4.46,5.84,7.67,9.73,10.32,3.5,2.38,8.25.98,11.02-2,3.7-3.98,4.85-9.45,3.08-14.75l-11.17-33.29c-1.47-4.37-3.29-8.49-5.66-12.25-3.14-4.98-9.17-5.97-13.82-2.62-3.88,2.79-6.03,6.83-7.52,11.44l-7.76,23.94-3.59,11.4c-1.77,5.61-.77,12.49,3.02,17.16s11.13,3.58,14.96-.71l7.71-8.64Z" />
          </g>
          <g transform="translate(121 174) scale(0.136)">
            <g class="skull-jaw">
              <path class="skull-bone" d="M163.97,123.54c1.98,14.07,5.12,28.05,9.85,41.61.82,2.36,2.84,4.65,5.43,5.08.5-3.41.22-6.69-.06-10.2l-2.83-35.51,31.49,2.52,2.81,37.1c1.34,4.57,2.11,8.76,6.47,11.52,4.07-16.09,1.53-42.53,4.56-47.5.72-1.18,3.72-1.69,5.37-1.82l24.51-1.94-3.2,38.62c-.25,3.03-.09,5.17,1.51,7.98,8.76-13.08,10.63-32.36,13.76-47.52l26.45-5.08-4,30.6c-.65,4.97-1.93,8.52-1.69,13.85,3.3-2.07,4.83-3.88,6.06-6.44,6.05-12.62,8.98-25.42,10.16-39.86l20.76-6.06-4.86,36.09c1.05.83,3.86-.11,4.6-1.44,6.82-12.15,9.39-24.56,10.42-38.76l12.14-4.81c.74-.29,3.21.19,3.79.59.76.54,1.33,2.95,1,4.04l-7.76,26.04c7.61-2.65,11.89-7.9,15.05-14.58,13.81-29.14,17.14-69.88,21.31-103.49.47-3.77,2.54-6.39,6.61-6.64l28.27-1.76c5.54-.35,11-3.3,16.15-5.75-8.53,30.72-14.72,61.19-17.31,92.8l-1.98,54.98c-.59,16.4-6.57,30.42-19.34,40.81-17.69,14.39-33.66,29.85-50.38,45.43l-28.01,26.09c-18.24,16.99-42.99,24.66-68.05,24.68l-59.94.04c-26.49.02-49.46-9.3-68.48-27.27l-36.53-34.5-40.26-35.72c-8.44-7.49-15.92-16.97-17.4-28.33-1.69-13-1.55-25.32-1.82-38.44C17.78,79.9,12.63,40.08,0,1c4.87,1.65,9.69,4.25,14.39,4.59l28.02,1.98c4.03.29,6.93,2.79,7.48,6.9l6.3,46.59c2.35,17.42,6.19,34.14,12.51,50.28,3.82,9.74,9.78,17.61,19.74,22.19l-8.41-24.52c-.74-2.15-.72-5.78.07-8.03,5.48.15,11.4,2.53,15.22,5.77l5.32,24.84c1.35,6.32,4.04,12.18,10.46,16.64l-5.75-38.54,20.98,6.23c1.67,12.24,3.67,23.44,8.43,34.43,2.1,4.86,4.45,9.62,9.92,12.24-3.19-15.19-6.55-28.61-8.18-43.97l27.46,4.93Z" />
            </g>
          </g>
        </g>

        <g class="motif motif-rose">
          <circle class="motif-halo" cx="150" cy="150" r="64" />
          <g transform="translate(150 128) scale(1.45)">
            <use href="#board-rose" />
          </g>
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
 * Drawn, not filled. The rest of the page is line-work -- the planchette, the
 * eye, the wand -- and a solid silhouette sat in the middle of it like a
 * sticker. Stroking the skull also lets its sockets and teeth read as
 * engraving instead of as holes.
 */
.board-skull {
  --motif-peak: 0.6;
}

.skull-bone {
  fill: none;
  stroke: var(--the-yellow);
  /* in the skull's own units, so it survives being scaled down to thumbnail */
  stroke-width: 5.5px;
  stroke-linejoin: round;
}

.skull-jaw .skull-bone {
  stroke-width: 10px;
}

/* the dotted ring the eye animation uses, borrowed to hold the motif */
.motif-halo {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 1px;
  stroke-dasharray: 1.5 7;
  stroke-linecap: round;
  opacity: 0.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: halo-turn 80s linear infinite;
}

@keyframes halo-turn {
  to { transform: rotate(360deg); }
}

/*
 * The jaw chatters in the skull's own coordinate space. Animating the
 * placement group instead would scale the movement down with everything
 * else and amount to nothing.
 */
.skull-jaw {
  transform-box: fill-box;
  transform-origin: 50% 0;
}

.spirit-board-session:hover .skull-jaw {
  animation: skull-jabber 1.1s linear infinite;
}

/* uneven on purpose: an even open-and-shut reads as a hinge, not as talk */
@keyframes skull-jabber {
  0%   { transform: translateY(0); }
  11%  { transform: translateY(34px); }
  23%  { transform: translateY(6px); }
  36%  { transform: translateY(46px); }
  49%  { transform: translateY(12px); }
  62%  { transform: translateY(30px); }
  74%  { transform: translateY(4px); }
  87%  { transform: translateY(22px); }
  100% { transform: translateY(0); }
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
  animation: motif-surface var(--motif-cycle, 26s) ease-in-out infinite both;
}

.motif-rose {
  --motif-peak: 0.62;
  animation-delay: calc(var(--motif-cycle, 26s) * 0.5);
}

/* the hold is most of the visit: roughly nine seconds at full strength */
@keyframes motif-surface {
  0%, 2% {
    opacity: 0;
    transform: scale(0.94) translateY(5px);
  }
  10%, 42% {
    opacity: var(--motif-peak, 0.3);
    transform: scale(1) translateY(0);
  }
  48%, 100% {
    opacity: 0;
    transform: scale(1.04) translateY(-6px);
  }
}

.spirit-board-session:hover .motif {
  --motif-cycle: 15s;
}

@media (prefers-reduced-motion: reduce) {
  .spirit-board-session:hover .skull-jaw {
    animation: none;
  }

  .motif-halo,
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
  stroke-width: 1.6px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

#board-rose .rose-rib {
  stroke-width: 1px;
  opacity: 0.7;
}

#board-rose .rose-thorn {
  fill: var(--the-yellow);
  stroke: none;
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
