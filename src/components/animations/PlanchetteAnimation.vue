<template>
  <div class="planchette-animation">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 248">
      <defs>
        <!-- the crow, defined once and placed by the motif that uses it -->
        <path id="board-crow" d="M199.23,433.8c5.83.08,7.43-2.43,11.19-4.72l12.14-7.38c18.7-1.1,28.74,12.77,33.44-2.31,4.68,2.13,7.77,6.53,10.19,11.25.17-3.23.14-7.58-.72-10.22-2.18-6.71-8.87-9.01-14.89-8.44l-14.61,1.38c-1.84.17-5.32-1.59-6.43-3.03-6.38-8.23,15.04-42.14,24.55-54.06l.85,4.77c5.94-4.64,7.19-11.82,7.33-19.85l3.25,3.64c-.57-7.52-1.86-13.34-4.09-20.84,7.97,3.53,14.78,6.66,23.77,8.79l-6.47-7.39c6.91,3.02,12.38,5.12,20.22,6.69l-4.56-6.1,14.24,7.05c16.63,17.88,32.35,35.76,49.91,52.5,5.61,5.34,11.65,9.44,19.46,12.26-4.17-8.38-10.25-14.1-15.85-20.81-6.25-7.48-12.86-14.19-18.01-22.6l40.78,42.16c8.17,8.45,22.5,18.46,33.66,17.79l-2.16-5.33c10.29,5.16,23.42,14.14,33.32,9.42-5.01-9.82-14.6-15.55-15.61-23.32l-49.37-55.31,45.19,35.42c-1.32-6.7-5.13-11.14-8.95-15.65l-11.08-13.08,25.61,13.24,26.75,14.69c.2-9.14-6.34-13.31-11.75-18.65l1.56-2.34c-8.19-8.38-16.4-17.14-26.14-23.9-2.97-2.06-5.93-2.93-7.32-6.65l-39.65-37.19-2.96-.25c-.6-.05-.36-1.46-.22-2.51l-5.97-7.98.18-3.97-4.63-6.29,12.61.33c-1.29-10.28-13.67-23.7-21.46-30.31-11.87-10.06-24.75-17.64-37.38-26.66,8.38,1.77,13.31,8.62,22.21,8.87-12.76-17-30.59-28.11-44.6-41.52-18.8-32.08-40.49-58.51-72.76-76.49l-18.01-10.04-1.86-1.27c-.39-.27.69-1.04,1.69-1.76-13.7-16.1-20.02-36.42-33.25-53.09-1.56-1.96-2.66-2.79-1.9-5.57-6.45-7.51-14.22-14.67-23.22-19.55-23.01-12.45-56.47-9.74-76.03,8.64-7.33-1.26-14.21-.76-20.45,2.93-19.12-.27-39.2,6.71-50.96,22.33l46.65,9.69c4.35.9,9.2,1.65,11.96,5.57l10.59,15.01.79-3.67,4.56,12.69,1.67-5.7c1.82,9.38.13,18.54-1.76,28.37l2.8-1.95-7.45,21.1,4.47-2.19c-3.36,11.12-5.35,21.28-5.6,33.53l4.35-7.3.18,17.87c.06,5.49,1.52,10.59,3.86,15.54l1.86-10.17c3.1,20.02,9.18,44.61,21.49,61.07l-.39-8.78c13.31,25.36,29.29,48.94,46.98,71.59,3.24,4.15,6.02,6.82,10.65,10.33l-4.98-12.19c5.5,4.69,11.38,9.15,15.5,15.24,8.03,11.87,10.59,26,12.52,40.4l2.92-2.12c-1.22,4.52-2.56,8.32-4.99,12.03-8.08,12.34-16.69,23.84-27.24,33.91-17.48,16.67-37.55,2.84-44.41,7.44l-5.79,3.88c-6.67,2.3-11.01,8.97-8.15,16.12,1.66-3.59,3.84-7.09,6.84-9.05l4.93-3.21c-.7,1.84-2.42,4.57-1.73,5.85l2.97,5.52c2.89-3.4,3.74-3.57,7.62-4.45,2.65-.6,5.7-3.34,8.6-5.11-3.62,4.65-6.57,9.71-3.23,15.14,1.79-3.22,3.54-5.9,5.48-7.53,3.87,3.84,6.66,1.63,10.34.63l24.46-6.67c7.04-1.92,15.63-.34,22.96.09l9.25.53,2.65-4.53c2.32,1.61,4.17,3.25,6.03,5.28-11.1,5.26-17.3-4.29-34.34,3.89-6.35,3.05-11.16,8.41-8.55,16.84,2.6-5.41,6.24-7.95,10.99-10.32l6.25-3.13c-6.93,4.83-8.93,13.22-3.99,20.37.52-3.75,1.63-7.57,4.26-7.89,3.06-.38,6.51-.45,8.55-1.51l6.64-3.42c5.28-2.72,9.85-8.42,15.95-6.17-3.67,1.2-8.4,1.96-10.95,4.28-4.9,4.47-4.74,13.75-.26,17.7.72-3.08,2.04-8.2,4.44-8.17ZM101.11,34.07c-3.67-1.37-4.88-5.01-3.51-7.24s4.2-4.27,7.23-2.23c1.41.95,1.86,4.81,1.14,6.53-.58,1.38-3.45,3.46-4.86,2.94ZM44.56,38.86l-19.77-.59.54-.68,9.12-.47c4.79-.25,8.99-.7,13.7.31,11.9.09,23.55-.05,34.39,5.03l-37.97-3.59ZM290.84,279.78c2.54.74,5.6.71,8.28,2.09l103.47,53.07-.68.91-30.15-13.83-79.35-35.53-50.18-25.25-27.08-14.94,6.24,8.3c-30.42-14.31-48.66-26.32-66.98-55.13l-12.59-19.79,3.54,13.05c-17.94-24.45-27.27-64.1.32-81.19,10.64-6.59,23.27-7.23,34.96-4.08-8.75.86-16.32.17-23.65,2.5-14.59,4.65-23.89,16.97-23.67,32.63.11,7.99,2.15,16,5.86,23.44,12.47,25.04,25.21,42.42,45.62,61.07,7.22,6.6,15.45,11.83,25.54,13.96-4.59-6.6-9.56-11.16-13.31-17.67,17.54,17.22,34.61,36.06,61.1,35.17-9.57-9.18-19.81-16.18-27.85-26.38,13.9,11.72,26.75,22.75,43.4,31.52-6.31.52-11.55-3.75-17.57-.42,11.53,6.58,22.71,13.02,34.74,16.52ZM303.45,201.18c-8.26,3.63-14.19-2.91-17.41,2.93-14.88-1.1-29.39-7.66-40.55-19.16,11.49,6.03,25.67,16.35,39.31,14.09l-7.73-7.5c8.67,4.47,16.86,7.98,26.38,9.63ZM251.11,199.51l1.48,2.21c-16.43-2.02-33.92-4.04-46.73-16,7.21,3.25,14.04,6.34,21.74,8.8l-2.2-5.11c7.78,5.87,15.65,9.12,25.72,10.11ZM355.62,245.4l-35.84-25.85c13.3,5.81,25.88,14.83,35.84,25.85ZM309.95,264.06c-11.71-7.3-23.43-13.42-33.34-22.41,18.77,11.46,36.54,21.59,56.47,30.16-8.77.34-15.29-4.44-23.13-7.75ZM307.98,246.31l52.19,25.71c-18.4-1.55-38.01-13.99-52.19-25.71ZM328.86,285.45c21.57,10.78,41.3,20.99,62.21,32.92-21.61-8.69-42.82-20.14-62.21-32.92ZM174.42,401.81c-1.71.3-5.02-1.87-6.06-3.28-.92-1.25-1.81-5.09-.92-6.46,9.74-15.13,20.68-28.15,33.39-40.63l-.55,4.54c6.55-4.1,8.91-10.59,9.4-18.9l2.06,4.8c.95-6.91.77-12.69-.47-18.52l5.25,2.28-5.77-12.41c11.76,13.35,16.55,25.4,21.51,42.57l2.99-3.64c-.4,5.95-1.4,10.74-3.58,15.77-6.71,15.45-15.64,35.8-29.34,43.81-.4-2.34-.62-5.69-1.56-7.06-3.46-5.03-10.76-5.63-16.46-4.63l-9.89,1.75ZM370.13,363.83l-10.8-11.46.91-.91,45.68,47.81c-13.47-10.57-24.2-23.14-35.79-35.44Z" />
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
          <g class="motif-breath">
          <g transform="translate(113 100) scale(0.255)">
            <path class="skull-bone" d="M163.82,320.32c-13.17.73-25.51.78-38.36-.23.39-7.13,1.26-13.66,2.58-20.47.38-1.97.48-3.66.38-5.9-1.88.99-2.82,2.41-3.64,4.2-3.1,6.83-4.6,13.79-5.74,21.33l-13.43-1.96c-.19-1.01-.45-2.63-.35-3.41l2.39-18.97c-1.56.19-2.59.99-3.17,2.15-2.66,5.28-4.01,10.69-4.87,16.63-.15,1.03-1.31,2.02-2.27,1.76l-8.11-2.23v-15.82c0-1.54-1.39-3.81-2.99-3.16-1.07.44-1.8,2.95-1.85,4.15l-.51,12.4c-2.83-.92-5.01-2.5-6.65-4.69l-.56-29.66c-3.15-10.28-12.64-17.22-23.55-16.3-3.89-.33-7.95,0-11.58-1.4-6.35-2.46-12.56-5.16-18.21-8.98-4.85-3.28-8.25-8.48-10.95-13.53-2.41-4.53-3.13-9.62-2.78-14.57.55-7.73,9.89-5.65,13.01-10.09,1.76-2.51,2.46-6.13,2.55-9.27.4-14.24,3.08-27.46,7.68-40.9,3.87-11.32,4.72-22.85,2.13-34.43-1.74-7.8-4.37-15.05-9.56-21.35l4.58,17.09c3.55,13.25.16,27.53-4.04,40.48-2.29,7.06-3.63,14-4.27,21.42l-1.42,16.39c-.09,1.06-.69,2.23-1.76,3.18-5.2-8.88-8.85-17.86-11.61-27.65-2.69-9.53-4.96-18.84-6-28.79-1.19-11.36-1.23-22.42.08-33.73C6.18,69.1,34.99,33.07,75.7,14.46,98.91,3.85,123.93-.55,149.48.05c32.34.76,62.59,9.86,88.8,28.65,8.77,6.29,16.13,13.37,23.02,21.63,28.08,33.68,33.77,75.69,24,117.82-2.88,12.16-6.82,23.53-12.6,34.5l-1.99,1.26c-.45.28-1.16-1.29-1.21-1.84-.88-9.66-1.32-18.95-2.9-28.48-.94-5.66-2.96-10.81-4.66-16.32-3.57-11.62-4.85-23.76-2.3-35.75l4.44-16.19c-10.7,13.88-13.03,35.13-8.39,51.09l4.51,15.5c2.3,7.93,3.08,15.91,3.95,24.13l1.19,11.27c.38,3.62,4.34,5.72,7.6,6.53,4.58,1.14,6.95,3.98,7.11,8.57.25,6.93-2.17,13.27-6.1,19.01-3.04,4.45-6.5,8.27-11.44,10.62l-12.52,5.95c-2.79,1.32-6.06,1.82-9.18,1.9l-11.61.3c-7.75,2.61-13.9,8.49-16.45,16.25l-.55,28.19c-.15.77-.58,2.65-1.25,3.04l-5.81,3.42-.48-10.95c-.09-2-.69-4.76-1.7-6.39-2.01.2-3.16,2.48-3.17,4.19l-.04,15.52-10.12,2.72c-.24-7.56-2.14-13.84-5.37-20.14-.73-.41-1.58-.82-2.32-1.03l2,22.39-13.5,2.29c-1.38-8.03-2.84-15.09-6.22-22.1-.8-1.65-1.78-2.81-3.48-3.93-.33,1.78-.29,3.16.05,4.78,1.51,7.19,2.71,13.99,3.05,21.85ZM111.06,203.16c6.62-7.09,9.57-16.07,8.34-25.77-1.47-11.64-8.13-23.87-20.04-25.17-11.8-1.28-26.93,2.29-38.15,6.71-10.26,4.04-18.23,11.99-18.69,23.23-.35,8.55.57,16.92,2.81,25.08,2.1,7.64,8,12.9,16.02,13.38,19.42,1.16,36.25-3.06,49.7-17.46ZM247.33,184.13c-.1-13.62-8.58-22.36-21.15-26.41-9.64-3.11-19.33-5.18-29.46-5.88-9.36-.65-17.56,3.83-22.06,11.86-4.95,8.83-5.83,22.45-.75,31.43,11,19.44,33.11,27.59,55.03,25.49,17.27-1.65,18.51-21.2,18.4-36.49ZM145.83,252.37c3.42,4.46,5.84,7.67,9.73,10.32,3.5,2.38,8.25.98,11.02-2,3.7-3.98,4.85-9.45,3.08-14.75l-11.17-33.29c-1.47-4.37-3.29-8.49-5.66-12.25-3.14-4.98-9.17-5.97-13.82-2.62-3.88,2.79-6.03,6.83-7.52,11.44l-7.76,23.94-3.59,11.4c-1.77,5.61-.77,12.49,3.02,17.16s11.13,3.58,14.96-.71l7.71-8.64Z" />
          </g>
          <g transform="translate(121 174) scale(0.136)">
            <g class="skull-jaw">
              <path class="skull-bone" d="M163.97,123.54c1.98,14.07,5.12,28.05,9.85,41.61.82,2.36,2.84,4.65,5.43,5.08.5-3.41.22-6.69-.06-10.2l-2.83-35.51,31.49,2.52,2.81,37.1c1.34,4.57,2.11,8.76,6.47,11.52,4.07-16.09,1.53-42.53,4.56-47.5.72-1.18,3.72-1.69,5.37-1.82l24.51-1.94-3.2,38.62c-.25,3.03-.09,5.17,1.51,7.98,8.76-13.08,10.63-32.36,13.76-47.52l26.45-5.08-4,30.6c-.65,4.97-1.93,8.52-1.69,13.85,3.3-2.07,4.83-3.88,6.06-6.44,6.05-12.62,8.98-25.42,10.16-39.86l20.76-6.06-4.86,36.09c1.05.83,3.86-.11,4.6-1.44,6.82-12.15,9.39-24.56,10.42-38.76l12.14-4.81c.74-.29,3.21.19,3.79.59.76.54,1.33,2.95,1,4.04l-7.76,26.04c7.61-2.65,11.89-7.9,15.05-14.58,13.81-29.14,17.14-69.88,21.31-103.49.47-3.77,2.54-6.39,6.61-6.64l28.27-1.76c5.54-.35,11-3.3,16.15-5.75-8.53,30.72-14.72,61.19-17.31,92.8l-1.98,54.98c-.59,16.4-6.57,30.42-19.34,40.81-17.69,14.39-33.66,29.85-50.38,45.43l-28.01,26.09c-18.24,16.99-42.99,24.66-68.05,24.68l-59.94.04c-26.49.02-49.46-9.3-68.48-27.27l-36.53-34.5-40.26-35.72c-8.44-7.49-15.92-16.97-17.4-28.33-1.69-13-1.55-25.32-1.82-38.44C17.78,79.9,12.63,40.08,0,1c4.87,1.65,9.69,4.25,14.39,4.59l28.02,1.98c4.03.29,6.93,2.79,7.48,6.9l6.3,46.59c2.35,17.42,6.19,34.14,12.51,50.28,3.82,9.74,9.78,17.61,19.74,22.19l-8.41-24.52c-.74-2.15-.72-5.78.07-8.03,5.48.15,11.4,2.53,15.22,5.77l5.32,24.84c1.35,6.32,4.04,12.18,10.46,16.64l-5.75-38.54,20.98,6.23c1.67,12.24,3.67,23.44,8.43,34.43,2.1,4.86,4.45,9.62,9.92,12.24-3.19-15.19-6.55-28.61-8.18-43.97l27.46,4.93Z" />
            </g>
          </g>
          </g>
        </g>

        <g class="motif motif-crow">
          <circle class="motif-halo" cx="150" cy="150" r="64" />
          <g class="motif-breath">
            <g transform="translate(97 102) scale(0.228)">
              <use href="#board-crow" />
            </g>
          </g>
        </g>
      </g>

      <g id="planchette-arc">
        <g
          v-for="letter in letters"
          :key="letter.ch"
          :transform="`rotate(${letter.rotate} ${letter.x} ${letter.y})`"
        >
          <text :x="letter.x" :y="letter.y">{{ letter.ch }}</text>
        </g>
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
/*
 * The jaw is absent from the idle cycle: the skull surfaces as a bare
 * cranium, and the jaw only arrives when you do. It makes the laugh an
 * event rather than something that was always sitting there waiting.
 */
.skull-jaw {
  transform-box: fill-box;
  transform-origin: 50% 0;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.spirit-board-session:hover .skull-jaw {
  opacity: 1;
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
  /* carries the hand-off when hover stops the animation dead */
  transition: opacity 0.5s ease;
}

.motif-crow {
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

/*
 * Hover holds the board still: the skull stays up for as long as you are
 * there, laughing, and the crow stands down. Speeding the cycle up was the
 * wrong fix -- it still traded the two of them in and out under the cursor,
 * which is the opposite of holding someone's attention.
 */
.spirit-board-session:hover .motif {
  animation: none;
  transform: none;
}

.spirit-board-session:hover .board-skull {
  opacity: var(--motif-peak);
}

.spirit-board-session:hover .motif-crow {
  opacity: 0;
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

/* same line weight as the skull, once each one's own scale is accounted for */
#board-crow {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 6.2px;
  stroke-linejoin: round;
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


/*
 * The motifs breathe while they are up -- a slow swell, on a wrapper of their
 * own so it does not collide with the surfacing animation above it, which is
 * already using transform to lift them away.
 */
.motif-breath {
  transform-box: fill-box;
  transform-origin: center;
  animation: motif-breathe 6.5s ease-in-out infinite;
}

@keyframes motif-breathe {
  0%, 100% { transform: scale(0.965); }
  50% { transform: scale(1.04); }
}

/* hovered, they stop breathing and hold still, and the skull starts laughing */
.spirit-board-session:hover .motif-breath {
  animation: none;
  transform: scale(1.04);
}

/*
 * Hover, and the planchette stops wandering and answers: it walks D-E-A-D,
 * resting on each letter in turn. Its aperture is already a ring, so landing
 * on a letter circles it -- the prop doing its own job rather than an effect
 * drawn on top of it.
 */
.spirit-board-session:hover #planchette-drifting {
  animation: planchette-spell 9s cubic-bezier(0.5, 0, 0.3, 1) infinite;
}

@keyframes planchette-spell {
  0%, 7%    { transform: translate(150px, 32px); }
  14%, 24%  { transform: translate(189.1px, 38.7px); }
  34%, 44%  { transform: translate(49.9px, 87.5px); }
  54%, 64%  { transform: translate(150px, 32px); }
  74%, 100% { transform: translate(150px, 96px); }
}

/* the letter under the ring answers back */
.spirit-board-session:hover #planchette-arc g text {
  transform-box: fill-box;
  transform-origin: center;
}

.spirit-board-session:hover #planchette-arc g:nth-of-type(4) text {
  animation: letter-called-d 9s ease-in-out infinite;
}

.spirit-board-session:hover #planchette-arc g:nth-of-type(5) text {
  animation: letter-called-e 9s ease-in-out infinite;
}

.spirit-board-session:hover #planchette-arc g:nth-of-type(1) text {
  animation: letter-called-a 9s ease-in-out infinite;
}

@keyframes letter-called-d {
  0%, 7%    { opacity: 1; transform: scale(1.3); }
  13%, 52%  { opacity: 0.85; transform: scale(1); }
  54%, 64%  { opacity: 1; transform: scale(1.3); }
  70%, 100% { opacity: 0.85; transform: scale(1); }
}

@keyframes letter-called-e {
  0%, 12%   { opacity: 0.85; transform: scale(1); }
  14%, 24%  { opacity: 1; transform: scale(1.3); }
  30%, 100% { opacity: 0.85; transform: scale(1); }
}

@keyframes letter-called-a {
  0%, 32%   { opacity: 0.85; transform: scale(1); }
  34%, 44%  { opacity: 1; transform: scale(1.3); }
  50%, 100% { opacity: 0.85; transform: scale(1); }
}

/* and the planchette warms, so the answer looks deliberate */
.spirit-board-session:hover .planchette-body {
  fill: rgba(227, 200, 125, 0.16);
  stroke-width: 3px;
}

@media (prefers-reduced-motion: reduce) {
  #planchette-drifting,
  .motif-breath,
  .spirit-board-session:hover .motif-breath,
  .spirit-board-session:hover #planchette-drifting,
  .spirit-board-session:hover #planchette-arc g text {
    animation: none;
    transform: none;
  }

  #planchette-drifting,
  .spirit-board-session:hover #planchette-drifting {
    transform: translate(150px, 96px);
  }
}
</style>
