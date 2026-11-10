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
        <circle class="impact-flash" r="5" />
        <circle class="impact-ring" r="5" />
        <circle class="impact-ring is-second" r="5" />
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
      :class="[`is-${arm.side}`, { 'is-out': arm.out, 'is-struck': arm.hits > 0, 'is-flaring': arm.flaring, 'is-lunging': arm.lunging, 'is-recovering': arm.recovering }]"
      :style="{ '--shove': arm.shove, '--tilt': `${arm.tilt}deg`, '--phase': `${arm.phase}s`, '--drift-dur': `${arm.driftMs}ms`, top: `${arm.top}%` }"
      tabindex="-1"
      @click="strike(arm, $event)"
    >
      <span class="arm-health">
        <i v-for="n in pips" :key="n" :class="{ 'is-spent': n <= arm.hits }"></i>
      </span>

      <span class="skeleton-arm-lunge">
        <span class="skeleton-arm-tremor"><SkeletonArm /></span>
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, defineEmits, defineExpose } from 'vue'
import SkeletonArm from './SkeletonArm.vue'
import { onSiegeRaised } from '../composables/useSiege'

const FLARE_MS = 380
// Long enough that it reads as the arm recovering rather than shrugging off
// the blow, short enough that a heavy one is never parked for long.
const RECOVER_AFTER = 4200
const GIVE_UP_MS = 25000
const STAGGER_MS = 420
// Long enough to read as deliberate rather than as a pop-up.
const EMERGE_MS = 900

/*
 * What each visit costs them.
 *
 * There is nothing to lose here, on purpose, so these are not difficulty
 * settings: an encounter you cannot fail does not get harder, it gets
 * bigger. Every dial is turned for spectacle -- more of them, faster,
 * further in, the room harder to see through -- so coming back a third time
 * is rewarded with a larger production rather than punished with a steeper
 * one.
 *
 * A first meeting is a pair, which is as much as it takes to show what they
 * do without burying the page under them. It builds from there.
 *
 * The last rung inverts the shape instead of extending it. One arm with
 * eight pips moving three times as fast is not the swarm turned up; it is a
 * different scene, and it is where a ladder with no stakes should stop
 * rather than climb forever.
 */
const LEVELS = [
  { arms: 2, pips: 2, prowl: 22, reach: 1, haze: 6.5 },
  { arms: 3, pips: 3, prowl: 30, reach: 1.08, haze: 8 },
  { arms: 4, pips: 3, prowl: 38, reach: 1.16, haze: 9 },
  { arms: 5, pips: 4, prowl: 46, reach: 1.24, haze: 9.5 },
  { arms: 1, pips: 8, prowl: 70, reach: 1.32, haze: 10 }
]

const TILTS = [-5, 3, 4, -3, 6]

/*
 * Where they come in. Sides alternate so the page is hauled from both at
 * once, and the tops are spread evenly down the window.
 *
 * The band each one patrols has to narrow as the count grows or they walk
 * through each other: five arms roaming eleven points apiece would overlap,
 * so a lane is half the gap to its neighbour less a little. A lone arm gets
 * the middle of the page and the run of it.
 */
const LAYOUT_TOP = 18
const LAYOUT_SPREAD = 60

function layout(count) {
  const span = count > 1 ? LAYOUT_SPREAD / (count - 1) : 0
  const range = count > 1 ? Math.max(4, span / 2 - 2) : 24

  return Array.from({ length: count }, (_, i) => ({
    side: i % 2 === 0 ? 'left' : 'right',
    top: count > 1 ? LAYOUT_TOP + i * span : 46,
    tilt: TILTS[i % TILTS.length],
    phase: -(0.4 + i * 1.3),
    range
  }))
}

/*
 * How many times this browser has met them. It decides the rung and nothing
 * else -- there is no score here, because there is nothing to win.
 */
const RECORD_KEY = 'rvc-siege'

function faced() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY))?.faced || 0
  } catch {
    // private window, or a value someone has edited by hand
    return 0
  }
}

function remember(count) {
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify({ faced: count }))
  } catch {
    // nothing to be done about it; the ladder just restarts next visit
  }
}

const SCRATCH_LIFE_MS = 3600
const IMPACT_LIFE_MS = 1300
const CLAW_GAP_MS = [1240, 3000]
const LUNGE_MS = 150

/*
 * The patrol.
 *
 * An arm that holds one spot is a prop; one that works its way along the
 * margin is hunting. It is the idle beat, so it stays well under the claw:
 * a constant 22px a second, which crosses a whole band in about four
 * seconds and never competes with the lunge for attention.
 *
 * Constant speed rather than a fixed duration per leg. A fixed duration
 * makes the short hops look darty and the long ones sludgy; holding the
 * speed and letting the clock fall out of the distance reads as one
 * creature moving at its own pace.
 *
 * Each arm roams a band around where it came in, and the bands are narrow
 * enough that they can never cross or stack up on one another -- see
 * layout(), which sizes a lane to the company an arm is keeping.
 *
 * The pace is the rung's to set; everything else here holds across all of
 * them.
 */
const PROWL_PAUSE_MS = [900, 2600]
const PROWL_MS = [1800, 7000]
const PROWL_EDGE = [8, 86]

const arms = ref([])
// On the slot's template, so it has to be reactive rather than a constant:
// the number of pips an arm carries is now a property of the encounter.
const pips = ref(LEVELS[0].pips)
let prowlSpeed = LEVELS[0].prowl
// which rung this encounter is on, for whoever is writing the notice
let rung = 0
/*
 * Which siege is the current one.
 *
 * Both of the delayed endings below -- the give-up and the clear at the end
 * of a retreat -- are scheduled against the siege that asked for them, and
 * either can land after a later one has started: summon, dismiss, summon
 * again inside twenty-five seconds and the first encounter's timer would
 * otherwise reach across and end the second. Each raise and each dismissal
 * takes the next number, and a callback that no longer holds it does
 * nothing.
 */
let sieging = 0
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

  /*
   * Which rung, and the dials that go with it. Counted up front rather than
   * on the way out, so a siege dismissed early still counts as having been
   * met -- the record is of encounters, not of victories.
   */
  const met = faced()
  const level = LEVELS[Math.min(met, LEVELS.length - 1)]
  remember(met + 1)

  pips.value = level.pips
  prowlSpeed = level.prowl
  root.style.setProperty('--reach-gain', level.reach)
  root.style.setProperty('--haze-depth', `${level.haze}px`)
  rung = Math.min(met, LEVELS.length - 1)

  arms.value = layout(level.arms).map((spec) => ({
    ...spec,
    id: nextId++,
    // where it came in; the patrol is measured from here, not from wherever
    // it has wandered to, so an arm cannot drift away a step at a time
    home: spec.top,
    driftMs: PROWL_MS[0],
    hits: 0,
    // How far back it has been driven, 0 to 1, kept apart from `hits`
    // because the two come apart: a blow lands permanently, being pushed
    // off the page does not.
    shove: 0,
    recovering: false,
    struckAt: 0,
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
    later(() => prowl(arm), arrival + EMERGE_MS)
  })

  // They cannot be allowed to outstay their welcome: a keyboard-only reader
  // has no way to swat them, so they leave on their own regardless.
  const mine = (sieging += 1)
  later(() => {
    if (mine === sieging) dismissAll()
  }, GIVE_UP_MS)
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
/*
 * One leg of the patrol: pick a spot in the band, work out how long it takes
 * at walking pace, and let the stylesheet carry it there.
 */
function prowl(arm) {
  if (!arms.value.includes(arm) || !arm.out) return

  /*
   * The drawn box is not the CSS box. These hinge at the shoulder, which is
   * off past the edge of the window, so the tilt throws the hand end a good
   * fifty pixels clear of wherever `top` put it -- and the lean deepens as
   * the arm takes hits. Measure that overhang against the box we actually
   * have rather than guessing at a margin that only holds at one size.
   */
  const room = window.innerHeight
  let [low, high] = PROWL_EDGE
  const slot = document.querySelector(`[data-arm="${arm.id}"]`)
  if (slot) {
    const rect = slot.getBoundingClientRect()
    const over = rect.top - (arm.top / 100) * room
    low = Math.max(low, (-over / room) * 100)
    high = Math.min(high, ((room - rect.height - over) / room) * 100)
    if (high < low) high = low
  }

  const target = Math.min(high, Math.max(low, arm.home + between([-arm.range, arm.range])))
  const travel = (Math.abs(target - arm.top) / 100) * window.innerHeight
  const ms = Math.min(PROWL_MS[1], Math.max(PROWL_MS[0], (travel / prowlSpeed) * 1000))

  arm.driftMs = ms
  arm.top = target
  // a breath at the end of each leg, so it patrols rather than glides
  later(() => prowl(arm), ms + between(PROWL_PAUSE_MS))
}

function clawLoop(arm) {
  if (!arms.value.includes(arm) || !arm.out || arm.hits >= pips.value) return

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
  if (!arm.out || arm.hits >= pips.value) return

  if (event) impactAt(event.clientX, event.clientY)

  arm.hits += 1
  arm.flaring = true
  arm.recovering = false
  arm.struckAt = Date.now()
  /*
   * One pip's worth of ground, so the last blow is always the one that puts
   * it off the page whatever it is carrying. This was a flat third, which
   * was right while every arm had three pips and badly wrong once one had
   * eight: three hits drove it clean off the window with five left in it,
   * out past its own hand, where nothing could reach it again.
   */
  arm.shove = arm.hits / pips.value
  scratchFrom(arm)
  later(() => {
    arm.flaring = false
  }, FLARE_MS)

  // Left alone, it gathers itself and comes back within reach. Otherwise a
  // heavy arm parked at the edge is simply out of the fight, and waiting
  // for the give-up timer is not a fight.
  later(() => recover(arm), RECOVER_AFTER)

  // The last hit has pushed it back its whole length. Drop it once the
  // retreat has actually played.
  if (arm.hits >= pips.value) {
    later(() => {
      arms.value = arms.value.filter((a) => a.id !== arm.id)
    }, EMERGE_MS)
  }
}

/*
 * Back in, if nothing has touched it since. The damage stands -- the pips
 * stay spent -- and only the ground is given back, so coming back is not a
 * second chance for the arm, just another chance at it.
 */
function recover(arm) {
  if (!arms.value.includes(arm) || !arm.out) return
  if (arm.hits >= pips.value) return
  if (!arm.shove) return
  if (Date.now() - arm.struckAt < RECOVER_AFTER - 60) return

  arm.recovering = true
  arm.shove = 0
}

function dismissAll() {
  if (!arms.value.length) return
  // they are letting go, not being broken: no jolt on the way out
  retreating = true
  const mine = (sieging += 1)
  arms.value.forEach((arm) => {
    arm.out = false
  })
  later(() => {
    // a fresh siege can be raised while this one is still backing out; the
    // page it would be clearing is no longer the page it was asked about
    if (mine === sieging) arms.value = []
  }, EMERGE_MS)
}

/*
 * The seal summons them. The word is kept as well: it is the only way in
 * from the keyboard, and the seal is not focusable.
 */
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

/*
 * What the arms are doing to the page, as one number.
 *
 * Each arm out hauls its own margin down, weighted by the grip it has left,
 * so beating one back eases its pull before it lets go altogether. The sides
 * cancel, which is the whole joke: with two on the west and one on the east
 * the page lists west, and clearing the east one makes it list further.
 */
const DEG_PER_ARM = 1.4
const MAX_LIST = 3

const emit = defineEmits(['siege'])
const root = document.documentElement

const lean = computed(() =>
  arms.value.reduce((total, arm) => {
    if (!arm.out) return total
    // what it is hauling with is how far in it is, so the page comes back
    // off level as it does
    const grip = 1 - arm.shove
    return total + (arm.side === 'left' ? -grip : grip)
  }, 0)
)

/*
 * A rotation turns about the element's own centre, and the stage is as tall
 * as the document -- so one degree of list would throw the masthead a
 * hundred pixels sideways and the amount would change as you scrolled.
 * Pinning the pivot to the middle of the viewport keeps the part you are
 * actually looking at where you left it.
 */
let pivotFrame = null

function placePivot() {
  pivotFrame = null
  root.style.setProperty('--list-pivot', `${window.scrollY + window.innerHeight / 2}px`)
}

function trackPivot() {
  if (pivotFrame) return
  pivotFrame = requestAnimationFrame(placePivot)
}

let besieged = false
let lastCount = 0
let retreating = false

/*
 * The jolt.
 *
 * Only two moments earn one: something taking hold, and something breaking.
 * The watcher below also fires on every scratch -- lean moves with each hit
 * -- and shaking the page every time the reader lands a blow would be both
 * sickening and a lie about what just happened. The scratch already has its
 * burst, its flare and a change in the list.
 */
const JOLT_MS = { grab: 280, break: 180 }

function jolt(kind) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  root.dataset.jolt = kind
  later(() => {
    if (root.dataset.jolt === kind) delete root.dataset.jolt
  }, JOLT_MS[kind])
}

function holdPage(count, tilt) {
  const deg = Math.max(-MAX_LIST, Math.min(MAX_LIST, tilt * DEG_PER_ARM))
  root.style.setProperty('--list', `${deg.toFixed(2)}deg`)
  root.dataset.besieged = String(count)
  if (besieged) return
  besieged = true
  placePivot()
  window.addEventListener('scroll', trackPivot, { passive: true })
  window.addEventListener('resize', trackPivot)
}

function releasePage() {
  if (!besieged) return
  besieged = false
  window.removeEventListener('scroll', trackPivot)
  window.removeEventListener('resize', trackPivot)
  if (pivotFrame) cancelAnimationFrame(pivotFrame)
  pivotFrame = null
  root.style.removeProperty('--list')
  root.style.removeProperty('--reach-gain')
  root.style.removeProperty('--haze-depth')
  delete root.dataset.besieged
  // the pivot outlives the list: the stage has to unwind about the same
  // point it bent on, or it swings on its way back to level
  later(() => root.style.removeProperty('--list-pivot'), 1200)
}

watch(
  [() => arms.value.length, lean],
  ([count, tilt]) => {
    // the page is grabbed, or something has just come off it
    if (count > lastCount && lastCount === 0) jolt('grab')
    else if (count < lastCount && !retreating) jolt('break')
    if (!count) retreating = false
    lastCount = count

    if (count) holdPage(count, tilt)
    else releasePage()
    emit('siege', {
      count,
      rung,
      west: arms.value.filter((arm) => arm.side === 'left').length,
      east: arms.value.filter((arm) => arm.side === 'right').length
    })
  }
)

let stopListening = null

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  // canSummon() still has the final word, so a verdict landing behind an
  // open dialog, on a narrow screen, or mid-siege is quietly ignored
  stopListening = onSiegeRaised(summon)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  stopListening?.()
  releasePage()
  clearTimers()
})

defineExpose({ summon, dismissAll })
</script>

<style scoped>
.skeleton-layer {
  position: fixed;
  inset: 0;
  z-index: 9000;
  /* The layer is fixed to the viewport, so an arm reaching past its edge
     cannot lengthen the page -- hiding the overflow only cost us the parts
     of the arm that were meant to hang over. */
  overflow: visible;
  pointer-events: none;

  /*
   * The margins were a straight cut. The page clips at the window edge, so
   * every arm ended in a hard vertical line it had plainly been sliced
   * along -- the most artificial thing about them.
   *
   * The fade belongs here and not on the arm: the arm's own outer end sits
   * off past the edge, and moves further out every time it takes a hit, so
   * a mask measured from the arm would ramp somewhere nobody can see. The
   * layer is pinned to the viewport, which is exactly where the cut is.
   * It takes the ends of the scratches with it, which is the same idea.
   */
  --margin-fade: linear-gradient(
    to right,
    transparent 0,
    #000 3.5%,
    #000 96.5%,
    transparent 100%
  );

  -webkit-mask-image: var(--margin-fade);
  mask-image: var(--margin-fade);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
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

/*
 * A member's blow is gold.
 *
 * The arms mark the page in red; what answers them is the Club, and it should
 * never be in doubt which of the two just happened. Before this a strike and
 * a rake were the same cinnabar, so the blow read as the arm's own.
 */
.impact-flash {
  fill: var(--gilt-bright);
  filter: drop-shadow(0 0 20px var(--gilt));
  animation: impact-flash 360ms var(--ease-out) forwards;
}

@keyframes impact-flash {
  from {
    transform: scale(0.5);
    opacity: 0.95;
  }
  to {
    transform: scale(4.4);
    opacity: 0;
  }
}

.impact-ring {
  fill: none;
  stroke: var(--gilt-bright);
  stroke-width: 3.5;
  filter:
    drop-shadow(0 0 12px var(--gilt))
    drop-shadow(0 0 28px var(--gilt-dim));
  animation: impact-ring 520ms var(--ease-out) forwards;
}

/* a second ring a beat behind the first: one is an effect, two is a shock
   going out */
.impact-ring.is-second {
  stroke-width: 2;
  opacity: 0.7;
  animation-duration: 760ms;
  animation-delay: 90ms;
}

@keyframes impact-ring {
  from {
    transform: scale(0.35);
    opacity: 0.95;
  }
  to {
    transform: scale(11);
    opacity: 0;
  }
}

.impact-shard {
  stroke: var(--gilt-bright);
  stroke-width: 3;
  stroke-linecap: round;
  transform-origin: 0 0;
  filter: drop-shadow(0 0 7px var(--gilt));
  animation: impact-shard 430ms var(--ease-out) forwards;
  animation-delay: calc(var(--i) * 8ms);
}

@keyframes impact-shard {
  from {
    transform: scale(0.2);
    opacity: 1;
  }
  to {
    transform: scale(1.85);
    opacity: 0;
  }
}

/* The only part meant to outlast the flash, and the only part that falls.
   It comes off the arm rather than off the blow, so it stays blood. */
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
  --reach-base: min(
    calc(var(--arm-len) * 0.9),
    max(calc(var(--arm-len) * 0.66), calc((100vw - 1180px) / 2 + 120px))
  );

  /* later rungs lean in further; the gain is set on :root at summon */
  --reach: calc(var(--reach-base) * var(--reach-gain, 1));

  position: absolute;
  width: var(--arm-len);
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  color: var(--parchment);
  pointer-events: auto;
  cursor: crosshair;

  /*
   * Contact, then ambient. A single soft shadow dropped 10px reads as the
   * arm hovering over the page; what seats a thing is a tight, dark, almost
   * offsetless shadow directly beneath it, with the wide soft one behind
   * that doing the ambient work. Kept as a variable because the flare
   * stacks its own glow in front of this and should not have to restate it.
   */
  --arm-shadow:
    drop-shadow(0 2px 3px rgba(0, 0, 0, 0.85))
    drop-shadow(0 14px 30px rgba(0, 0, 0, 0.55));

  filter: var(--arm-shadow);
  /* `top` carries the patrol and `transform` the reach, which is the whole
     reason the drift lives on `top`: the two get their own clocks for free,
     and the slow walk never inherits the snap of the grab. */
  transition:
    transform var(--emerge-dur, 900ms) var(--ease-settle),
    top var(--drift-dur, 4s) var(--ease-in-out),
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
/* --shove is 0 to 1 whatever the arm is carrying, so a full retreat is one
   --reach and the last pip is always the one that clears the window. */
.skeleton-arm-slot.is-left.is-out {
  transform:
    translateX(calc(var(--reach) - var(--arm-len) - var(--shove) * var(--reach)))
    rotate(calc(var(--tilt) + var(--shove) * -4.5deg));
}

.skeleton-arm-slot.is-right.is-out {
  transform:
    translateX(calc(var(--arm-len) - var(--reach) + var(--shove) * var(--reach)))
    rotate(calc(var(--tilt) + var(--shove) * 4.5deg));
}

/* Struck arms retreat faster than they arrived. Things that pull back
   quickly read as alive; things that ease back read as machinery. */
.skeleton-arm-slot.is-struck {
  --emerge-dur: 260ms;
}

/* Coming back is the opposite: slow, and after the rule above, since a
   recovering arm is still a struck one and would otherwise snap in at the
   knockback's pace. */
.skeleton-arm-slot.is-recovering {
  --emerge-dur: 2200ms;
}

/* The red is the hit, not the resting state: it says the blow registered,
   and it is the only reason you can tell how close the thing is to going. */
/* Struck, it reddens. The gold belongs to the blow landing, not to the thing
   it lands on -- the arm is still theirs and still answers in their colour. */
.skeleton-arm-slot.is-flaring {
  color: var(--cinnabar);
  filter: drop-shadow(0 0 16px var(--oxblood)) var(--arm-shadow);
}

/* Struck, it clenches harder than it claws. */
.skeleton-arm-slot.is-flaring :deep(.skeleton-hand) {
  transform: scaleX(0.68) rotate(-14deg);
}

/*
 * Three pips, one per blow left in it. Sits outside the lunge and tremor
 * boxes so it holds still: a gauge that jitters with the thing it is
 * measuring is not a gauge. It floats just past the fingertips -- over the
 * page rather than over the bone, which is white and swallowed it whole.
 */
.arm-health {
  position: absolute;
  top: 50%;
  display: flex;
  gap: 4px;
  padding: 3px;
  transform: translateY(calc(-50% - 16px));
  background: rgba(10, 8, 6, 0.92);
  border: 1px solid var(--gilt-dim);
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(10, 8, 6, 0.75), 0 2px 10px rgba(0, 0, 0, 0.55);
  pointer-events: none;
}

/* The drawing puts the hand at one end and the shoulder at the other, so the
   fingertip end is whichever edge the margin is not. */
.skeleton-arm-slot.is-left .arm-health {
  left: calc(100% + 12px);
}

.skeleton-arm-slot.is-right .arm-health {
  right: calc(100% + 12px);
}

.arm-health i {
  display: block;
  width: 15px;
  height: 5px;
  background: var(--parchment);
  transition: background-color var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out);
}

.arm-health i.is-spent {
  background: var(--oxblood);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.5);
  opacity: 0.6;
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
 * The hand hooks as it drags. Fingers pull in toward the wrist and the whole
 * hand cocks over, so the rake comes off a curled claw rather than a flat
 * palm swiping sideways. transform-origin is the wrist, so it pivots where
 * a hand actually does.
 */
.skeleton-arm-slot.is-lunging :deep(.skeleton-hand) {
  transform: scaleX(0.78) rotate(-9deg);
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
  /* every animation this block suppresses is declared above it */
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
