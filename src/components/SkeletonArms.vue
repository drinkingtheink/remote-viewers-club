<template>
  <!--
    A fixed layer over the whole page. The layer itself never takes a click;
    only the arms do, so the page stays usable while they are out.
  -->
  <div v-if="arms.length" class="skeleton-layer" aria-hidden="true">
    <button
      v-for="arm in arms"
      :key="arm.id"
      type="button"
      class="skeleton-arm-slot"
      :class="[`is-${arm.side}`, { 'is-out': arm.out, 'is-struck': arm.hits > 0, 'is-flaring': arm.flaring }]"
      :style="{ '--hits': arm.hits, '--tilt': `${arm.tilt}deg`, top: `${arm.top}%` }"
      tabindex="-1"
      @click="strike(arm)"
    >
      <SkeletonArm />
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
  { side: 'left', top: 22, tilt: -5 },
  { side: 'right', top: 46, tilt: 3 },
  { side: 'left', top: 68, tilt: 4 },
  { side: 'right', top: 15, tilt: -3 }
]

const arms = ref([])

let timers = []
let nextId = 0

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
    flaring: false
  }))

  arms.value.forEach((arm, i) => {
    later(() => {
      arm.out = true
    }, 60 + i * STAGGER_MS)
  })

  // They cannot be allowed to outstay their welcome: a keyboard-only reader
  // has no way to swat them, so they leave on their own regardless.
  later(dismissAll, GIVE_UP_MS)
}

function strike(arm) {
  if (!arm.out || arm.hits >= HITS_TO_CLEAR) return

  arm.hits += 1
  arm.flaring = true
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

// A typed word, for tuning the feel before the real trigger is wired up.
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

onMounted(() => window.addEventListener('keydown', onKeyDown))
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
.skeleton-arm-slot {
  --margin: max(150px, (100vw - 1180px) / 2);
  --arm-len: clamp(360px, 34vw, 620px);

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
    translateX(calc(var(--margin) - var(--arm-len) - var(--hits) * var(--margin) / 3))
    rotate(calc(var(--tilt) + var(--hits) * -1.5deg));
}

.skeleton-arm-slot.is-right.is-out {
  transform:
    translateX(calc(var(--arm-len) - var(--margin) + var(--hits) * var(--margin) / 3))
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

@media (prefers-reduced-motion: reduce) {
  .skeleton-arm-slot {
    transition: none;
  }
}
</style>
