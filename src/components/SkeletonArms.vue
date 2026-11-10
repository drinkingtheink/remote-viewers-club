<template>
  <!--
    A fixed layer over the whole page. The layer itself never takes a click;
    only the arms do, so the page stays usable while they are out.
  -->
  <div v-if="arms.length || scratches.length || impacts.length" class="skeleton-layer" aria-hidden="true">
    <!-- Marks are left on the page, not on the arm, so they stay put while
         the arm that made them retreats. -->
    <svg class="scratch-layer">
      <g
        v-for="scratch in scratches"
        :key="scratch.id"
        class="scratch"
        :transform="`translate(${scratch.x} ${scratch.y}) rotate(${scratch.angle})`"
      >
        <path
          v-for="(d, i) in scratch.lines"
          :key="i"
          :d="d"
          pathLength="1"
          :style="{ '--i': i }"
        />
      </g>

      <g
        v-for="burst in impacts"
        :key="`i${burst.id}`"
        class="impact"
        :transform="`translate(${burst.x} ${burst.y})`"
      >
        <circle class="impact-ring" r="5" />
        <line
          v-for="(shard, i) in burst.shards"
          :key="`s${i}`"
          class="impact-shard"
          x1="0"
          y1="0"
          :x2="shard.x"
          :y2="shard.y"
          :style="{ '--i': i }"
        />
        <circle
          v-for="(drop, i) in burst.drops"
          :key="`d${i}`"
          class="impact-drop"
          :r="drop.r"
          :style="{ '--dx': `${drop.dx}px`, '--dy': `${drop.dy}px`, '--i': i }"
        />
      </g>
    </svg>

    <button
      v-for="arm in arms"
      :key="arm.id"
      type="button"
      class="skeleton-arm-slot"
      :data-arm="arm.id"
      :class="[`is-${arm.side}`, { 'is-out': arm.out, 'is-struck': arm.hits > 0, 'is-flaring': arm.flaring, 'is-lunging': arm.lunging }]"
      :style="{ '--hits': arm.hits, '--tilt': `${arm.tilt}deg`, '--phase': `${arm.phase}s`, top: `${arm.top}%` }"
      tabindex="-1"
      @click="strike(arm, $event)"
    >
      <span class="skeleton-arm-lunge">
        <span class="skeleton-arm-tremor"><SkeletonArm /></span>
      </span>
    </button>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, defineExpose } from 'vue'
import SkeletonArm from './SkeletonArm.vue'

const HITS_TO_CLEAR = 3
const FLARE_MS = 380
const GIVE_UP_MS = 25000
const STAGGER_MS = 420
// Long enough to read as deliberate rather than as a pop-up.
const EMERGE_MS = 900

// Where each one comes from, how high up, and how far off square it hangs.
const PLAN = [
  { side: 'left', top: 22, tilt: -5, phase: -0.4 },
  { side: 'right', top: 46, tilt: 3, phase: -1.7 },
  { side: 'left', top: 68, tilt: 4, phase: -2.9 },
  { side: 'right', top: 15, tilt: -3, phase: -1.1 }
]

const SCRATCH_LIFE_MS = 3600
const IMPACT_LIFE_MS = 1300
const CLAW_GAP_MS = [1240, 3000]
const LUNGE_MS = 150

const arms = ref([])
const scratches = ref([])
const impacts = ref([])

let timers = []
let nextId = 0
let nextScratchId = 0
let nextImpactId = 0

const between = ([min, max]) => min + Math.random() * (max - min)

const later = (fn, ms) => {
  timers.push(setTimeout(fn, ms))
}

const clearTimers = () => {
  timers.forEach(clearTimeout)
  timers = []
}

function canSummon() {
  if (arms.value.length) return false
  // Skeleton arms lunging out of the page is precisely what this setting is
  // for; there is no tasteful reduced version, so there is none.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // No margin to come out of, and they would land on what you are reading.
  if (window.innerWidth < 900) return false
  // A dialog is modal; arms behind its backdrop would only look broken.
  if (document.querySelector('dialog[open]')) return false
  return true
}

function summon() {
  if (!canSummon()) return

  arms.value = PLAN.map((spec) => ({
    ...spec,
    id: nextId++,
    hits: 0,
    out: false,
    flaring: false,
    lunging: false
  }))

  arms.value.forEach((arm, i) => {
    const arrival = 60 + i * STAGGER_MS
    later(() => {
      arm.out = true
    }, arrival)
    // It starts clawing as it lands and does not stop. The arms are not
    // waiting to be noticed; being left alone is not a resting state.
    later(() => clawLoop(arm), arrival + EMERGE_MS * 0.75)
  })

  // They cannot be allowed to outstay their welcome: a keyboard-only reader
  // has no way to swat them, so they leave on their own regardless.
  later(dismissAll, GIVE_UP_MS)
}

/*
 * Four rakes, built as broken runs of short segments rather than one smooth
 * curve: a clean arc reads as drawn, a torn line reads as dragged.
 */
function clawLines() {
  const lines = []

  for (let i = 0; i < 4; i += 1) {
    const length = 96 + Math.random() * 58 + i * 6
    const offset = (i - 1.5) * 15 + (Math.random() - 0.5) * 5
    const steps = 5 + Math.floor(Math.random() * 3)

    let d = `M0,${offset.toFixed(1)}`

    for (let step = 1; step <= steps; step += 1) {
      const along = (length / steps) * step
      const drift = offset * (1 - (step / steps) * 0.65)
      const jag = (Math.random() - 0.5) * 11

      d += ` L${along.toFixed(1)},${(drift + jag).toFixed(1)}`
    }

    lines.push(d)
  }

  return lines
}

/* Marked where the hand actually is, measured rather than predicted, so the
   rakes line up with the fingers whatever the arm happens to be doing. */
function scratchFrom(arm) {
  const hand = document.querySelector(`[data-arm="${arm.id}"] .skeleton-hand`)
  if (!hand) return

  const box = hand.getBoundingClientRect()
  const id = nextScratchId++
  const reachesRight = arm.side === 'left'

  scratches.value.push({
    id,
    // From the fingertips, carrying on the way the hand was going. Struck
    // from the middle of the hand the rakes end up underneath the arm that
    // made them, which hides the whole effect.
    x: reachesRight ? box.right - 12 : box.left + 12,
    y: box.top + box.height * 0.58,
    angle: reachesRight ? -7 : 187,
    lines: clawLines()
  })

  later(() => {
    scratches.value = scratches.value.filter((s) => s.id !== id)
  }, SCRATCH_LIFE_MS)
}

/*
 * Claws on its own, forever, at an uneven cadence so the four of them never
 * fall into step. It jabs forward as it rakes -- the marks alone read as
 * decoration; the lunge is what makes it look like it meant it.
 */
function clawLoop(arm) {
  if (!arms.value.includes(arm) || !arm.out || arm.hits >= HITS_TO_CLEAR) return

  arm.lunging = true
  later(() => scratchFrom(arm), LUNGE_MS * 0.8)
  later(() => {
    arm.lunging = false
  }, LUNGE_MS + 110)

  later(() => clawLoop(arm), between(CLAW_GAP_MS))
}

/*
 * Where the blow landed. Shards go out fast and evenly; the blood is slower,
 * fewer, and falls -- it is the only part that is meant to still be there a
 * beat later. Blood is already the house vocabulary (the contract is signed
 * in it), so it reads as of a piece rather than as gore for its own sake.
 */
function impactAt(x, y) {
  const id = nextImpactId++
  const shards = []
  const drops = []

  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.5
    const reach = 16 + Math.random() * 20

    shards.push({
      x: (Math.cos(angle) * reach).toFixed(1),
      y: (Math.sin(angle) * reach).toFixed(1)
    })
  }

  for (let i = 0; i < 5; i += 1) {
    drops.push({
      r: (1.6 + Math.random() * 2.4).toFixed(1),
      dx: ((Math.random() - 0.5) * 70).toFixed(1),
      dy: (26 + Math.random() * 54).toFixed(1)
    })
  }

  impacts.value.push({ id, x, y, shards, drops })

  later(() => {
    impacts.value = impacts.value.filter((burst) => burst.id !== id)
  }, IMPACT_LIFE_MS)
}

function strike(arm, event) {
  if (!arm.out || arm.hits >= HITS_TO_CLEAR) return

  if (event) impactAt(event.clientX, event.clientY)

  arm.hits += 1
  arm.flaring = true
  scratchFrom(arm)
  later(() => {
    arm.flaring = false
  }, FLARE_MS)

  // At the third hit the arm has been pushed back its whole length. Drop it
  // once the retreat has actually played.
  if (arm.hits >= HITS_TO_CLEAR) {
    later(() => {
      arms.value = arms.value.filter((a) => a.id !== arm.id)
    }, EMERGE_MS)
  }
}

function dismissAll() {
  if (!arms.value.length) return
  arms.value.forEach((arm) => {
    arm.out = false
  })
  later(() => {
    arms.value = []
  }, EMERGE_MS)
}

/*
 * Scaffolding, both of these. While the real trigger is undecided the arms
 * come out on their own on every local load so the feel can be iterated on,
 * and the word summons them on demand. The auto-summon is gated on the dev
 * build, so neither the live site nor a preview build inherits it.
 */
const AUTO_SUMMON_IN_DEV = true
const SUMMON_WORD = 'bones'
let typed = ''

function onKeyDown(event) {
  if (event.key === 'Escape' && arms.value.length) {
    dismissAll()
    return
  }

  if (event.key.length !== 1) return

  // event.target is not always an Element -- a key event dispatched at window
  // or document has no matches() -- and typing into a field must never count
  // toward the word.
  const target = event.target
  if (target instanceof Element && target.closest('input, textarea, [contenteditable]')) return

  typed = (typed + event.key.toLowerCase()).slice(-SUMMON_WORD.length)
  if (typed === SUMMON_WORD) {
    typed = ''
    summon()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)

  // A beat after paint, so they are seen arriving rather than already there.
  if (AUTO_SUMMON_IN_DEV && process.env.NODE_ENV !== 'production') {
    later(summon, 900)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  clearTimers()
})

defineExpose({ summon, dismissAll })
</script>

<style scoped>
.skeleton-layer {
  position: fixed;
  inset: 0;
  z-index: 9000;
  overflow: hidden;
  pointer-events: none;
}

/*
 * The arm is a fixed length and its hand is parked at the edge of the content
 * column, so how much of the arm you see is however much margin the viewport
 * happens to have. A laptop shows a hand and some forearm; a wide monitor
 * shows nearly all of it. One rule, and it reads correctly at both.
 */
.scratch-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/*
 * pathLength="1" normalises every rake, however long it is, so one pair of
 * keyframes draws them all at the same rate.
 */
/* The glow sits on the set rather than each rake: four marks times a dozen
   live sets is sixty filtered nodes, and they are all animating. */
.scratch {
  filter:
    drop-shadow(0 0 3px var(--cinnabar))
    drop-shadow(0 0 11px var(--oxblood));
}

.scratch path {
  fill: none;
  stroke: var(--cinnabar);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  filter: drop-shadow(0 0 5px var(--oxblood));
  animation:
    scratch-rake 170ms var(--ease-out) forwards,
    scratch-fade var(--scratch-life, 3.4s) linear forwards;
  animation-delay: calc(var(--i) * 35ms);
}

@keyframes scratch-rake {
  to {
    stroke-dashoffset: 0;
  }
}

/* --- the blow --- */
.impact circle,
.impact line {
  transform-box: fill-box;
  transform-origin: center;
}

.impact-ring {
  fill: none;
  stroke: var(--cinnabar);
  stroke-width: 2.5;
  filter: drop-shadow(0 0 8px var(--oxblood));
  animation: impact-ring 420ms var(--ease-out) forwards;
}

@keyframes impact-ring {
  from {
    transform: scale(0.35);
    opacity: 0.95;
  }
  to {
    transform: scale(8);
    opacity: 0;
  }
}

.impact-shard {
  stroke: var(--candle);
  stroke-width: 2;
  stroke-linecap: round;
  transform-origin: 0 0;
  animation: impact-shard 320ms var(--ease-out) forwards;
  animation-delay: calc(var(--i) * 8ms);
}

@keyframes impact-shard {
  from {
    transform: scale(0.2);
    opacity: 1;
  }
  to {
    transform: scale(1.25);
    opacity: 0;
  }
}

/* The only part meant to outlast the flash, and the only part that falls. */
.impact-drop {
  fill: var(--blood);
  animation: impact-drop 1100ms cubic-bezier(0.3, 0, 0.7, 1) forwards;
  animation-delay: calc(var(--i) * 26ms);
}

@keyframes impact-drop {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 0;
  }
  18% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(1);
    opacity: 0;
  }
}

@keyframes scratch-fade {
  0%, 42% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.skeleton-arm-slot {
  --arm-len: clamp(460px, 42vw, 900px);
  /*
   * How far in the hand lands. Proportional to the arm so plenty of it is in
   * view at any width, but floored against the page's own margin so it still
   * crosses onto the column on a wide monitor, and capped at 90% so the
   * shoulder never leaves the edge and the arm never floats free of the page.
   */
  --reach: min(
    calc(var(--arm-len) * 0.9),
    max(calc(var(--arm-len) * 0.66), calc((100vw - 1180px) / 2 + 120px))
  );

  position: absolute;
  width: var(--arm-len);
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  color: var(--parchment);
  pointer-events: auto;
  cursor: crosshair;
  filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.65));
  transition:
    transform var(--emerge-dur, 900ms) var(--ease-settle),
    color var(--dur-base) var(--ease-out),
    filter var(--dur-base) var(--ease-out);
}

/* Pivoting at the shoulder, which is off past the edge, hinges them out of
   the binding rather than sliding them in like a drawer. */
.skeleton-arm-slot.is-left {
  left: 0;
  transform-origin: left center;
  transform: translateX(-100%) rotate(var(--tilt));
}

.skeleton-arm-slot.is-right {
  right: 0;
  transform-origin: right center;
  transform: translateX(100%) rotate(var(--tilt));
}

.skeleton-arm-slot.is-left :deep(.skeleton-arm) {
  transform: scaleX(-1);
}

/*
 * Each hit shoves the arm back a third of the reach it gained, so the third
 * lands it exactly where it started, fully off the page. Note the signs: a
 * left-hand arm retreats by translating further negative, a right-hand one
 * further positive. Getting that backwards drives them deeper into the page
 * on every blow, which is a different easter egg entirely.
 */
.skeleton-arm-slot.is-left.is-out {
  transform:
    translateX(calc(var(--reach) - var(--arm-len) - var(--hits) * var(--reach) / 3))
    rotate(calc(var(--tilt) + var(--hits) * -1.5deg));
}

.skeleton-arm-slot.is-right.is-out {
  transform:
    translateX(calc(var(--arm-len) - var(--reach) + var(--hits) * var(--reach) / 3))
    rotate(calc(var(--tilt) + var(--hits) * 1.5deg));
}

/* Struck arms retreat faster than they arrived. Things that pull back
   quickly read as alive; things that ease back read as machinery. */
.skeleton-arm-slot.is-struck {
  --emerge-dur: 260ms;
}

/* The red is the hit, not the resting state: it says the blow registered,
   and it is the only reason you can tell how close the thing is to going. */
.skeleton-arm-slot.is-flaring {
  color: var(--cinnabar);
  filter:
    drop-shadow(0 0 16px var(--oxblood))
    drop-shadow(0 10px 22px rgba(0, 0, 0, 0.65));
}

.skeleton-arm-slot.is-flaring :deep(.skeleton-hand) {
  transform: scaleX(0.84);
}

/* The jab gets its own box so it does not fight the position transform on
   the button or the tremor on the one inside it. */
.skeleton-arm-lunge {
  display: block;
  transition: transform 150ms var(--ease-out);
}

.skeleton-arm-slot.is-left.is-lunging .skeleton-arm-lunge {
  transform: translateX(28px);
}

.skeleton-arm-slot.is-right.is-lunging .skeleton-arm-lunge {
  transform: translateX(-28px);
}

/*
 * Never quite still. Two things are doing the work: the offsets are uneven
 * rather than a clean sine, and each arm is given a negative delay so they
 * are permanently out of phase with each other -- four arms twitching in
 * unison would read as one object, not four.
 */
.skeleton-arm-tremor {
  display: block;
  animation: bone-tremor 2.3s var(--ease-in-out) infinite;
  animation-delay: var(--phase, 0s);
}

@keyframes bone-tremor {
  0%   { transform: translate(0, 0) rotate(0deg); }
  11%  { transform: translate(2px, -3px) rotate(0.5deg); }
  24%  { transform: translate(-3px, 1px) rotate(-0.8deg); }
  36%  { transform: translate(3px, 2px) rotate(0.3deg); }
  49%  { transform: translate(-1px, -3px) rotate(-0.5deg); }
  61%  { transform: translate(2px, 1px) rotate(1deg); }
  74%  { transform: translate(-3px, -1px) rotate(-0.4deg); }
  88%  { transform: translate(1px, 3px) rotate(0.7deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* A struck arm shudders rather than trembles. */
.skeleton-arm-slot.is-flaring .skeleton-arm-tremor {
  animation-duration: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  .scratch-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/*
 * pathLength="1" normalises every rake, however long it is, so one pair of
 * keyframes draws them all at the same rate.
 */
/* The glow sits on the set rather than each rake: four marks times a dozen
   live sets is sixty filtered nodes, and they are all animating. */
.scratch {
  filter:
    drop-shadow(0 0 3px var(--cinnabar))
    drop-shadow(0 0 11px var(--oxblood));
}

.scratch path {
  fill: none;
  stroke: var(--cinnabar);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  filter: drop-shadow(0 0 5px var(--oxblood));
  animation:
    scratch-rake 170ms var(--ease-out) forwards,
    scratch-fade var(--scratch-life, 3.4s) linear forwards;
  animation-delay: calc(var(--i) * 35ms);
}

@keyframes scratch-rake {
  to {
    stroke-dashoffset: 0;
  }
}

/* --- the blow --- */
.impact circle,
.impact line {
  transform-box: fill-box;
  transform-origin: center;
}

.impact-ring {
  fill: none;
  stroke: var(--cinnabar);
  stroke-width: 2.5;
  filter: drop-shadow(0 0 8px var(--oxblood));
  animation: impact-ring 420ms var(--ease-out) forwards;
}

@keyframes impact-ring {
  from {
    transform: scale(0.35);
    opacity: 0.95;
  }
  to {
    transform: scale(8);
    opacity: 0;
  }
}

.impact-shard {
  stroke: var(--candle);
  stroke-width: 2;
  stroke-linecap: round;
  transform-origin: 0 0;
  animation: impact-shard 320ms var(--ease-out) forwards;
  animation-delay: calc(var(--i) * 8ms);
}

@keyframes impact-shard {
  from {
    transform: scale(0.2);
    opacity: 1;
  }
  to {
    transform: scale(1.25);
    opacity: 0;
  }
}

/* The only part meant to outlast the flash, and the only part that falls. */
.impact-drop {
  fill: var(--blood);
  animation: impact-drop 1100ms cubic-bezier(0.3, 0, 0.7, 1) forwards;
  animation-delay: calc(var(--i) * 26ms);
}

@keyframes impact-drop {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 0;
  }
  18% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(1);
    opacity: 0;
  }
}

@keyframes scratch-fade {
  0%, 42% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.skeleton-arm-slot {
    transition: none;
  }

  .skeleton-arm-tremor {
    animation: none;
  }

  .skeleton-arm-lunge {
    transition: none;
  }

  .scratch path {
    animation: none;
    stroke-dashoffset: 0;
  }

  .impact circle,
  .impact line {
    animation: none;
  }
}
</style>
