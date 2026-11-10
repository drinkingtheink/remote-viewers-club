<template>
  <SessionStage form="RVC FORM 31-D" title="Séance Session" container-class="spirit-board-session" :is-active="isActive">
    <div v-if="phase === 'intro'" class="panel">
      <p class="panel-subheader">Put a question to the board and let the planchette answer it.</p>

      <PlanchetteAnimation />

      <button @click="startSitting" class="begin-session">Begin Session</button>
    </div>

    <div v-else-if="phase === 'asking'" class="seance-ask">
      <h3>Address the Board</h3>
      <p>Speak plainly. The board is old and does not care for ambiguity.</p>

      <form @submit.prevent="openBoard">
        <label class="visually-hidden" for="seance-question">Your question</label>
        <input
          id="seance-question"
          ref="questionField"
          v-model="question"
          class="seance-question"
          type="text"
          maxlength="120"
          autocomplete="off"
          placeholder="Is anyone there?"
        />
        <div class="seance-ask-actions">
          <button type="submit">Lay On Hands</button>
          <button type="button" class="secondary" @click="endSession">Close Session</button>
        </div>
      </form>
    </div>

    <div v-else-if="phase === 'board'" class="seance-board-stage">
      <p class="seance-question-echo">&ldquo;{{ askedQuestion }}&rdquo;</p>

      <p class="seance-instruction" role="status">{{ instruction }}</p>

      <svg
        ref="board"
        class="seance-board"
        :viewBox="`0 0 ${BOARD.width} ${BOARD.height}`"
        tabindex="0"
        role="application"
        aria-label="Spirit board. Move the planchette with the pointer or the arrow keys; press Enter to read the nearest glyph."
        @pointermove="onPointerMove"
        @pointerdown="onPointerMove"
        @keydown="onKeyDown"
      >
        <g class="seance-glyphs">
          <text
            v-for="glyph in GLYPHS"
            :key="glyph.id"
            :x="glyph.x"
            :y="glyph.y"
            :class="['seance-glyph', `is-${glyph.kind}`, { reading: dwellGlyphId === glyph.id }]"
            :transform="`rotate(${glyph.rotate} ${glyph.x} ${glyph.y})`"
          >{{ glyph.ch }}</text>
        </g>

        <g class="seance-planchette" :transform="`translate(${pos.x} ${pos.y})`">
          <!-- the aperture is a hole in the body, so the glyph under it reads -->
          <path
            class="planchette-body"
            fill-rule="evenodd"
            d="M0,-42 C26,-42 46,-24 46,2 C46,30 24,56 0,76 C-24,56 -46,30 -46,2 C-46,-24 -26,-42 0,-42 Z
               M20,0 A20,20 0 1 0 -20,0 A20,20 0 1 0 20,0 Z"
          />
          <circle class="planchette-aperture" cx="0" cy="0" r="20" />
        </g>
      </svg>

      <p class="seance-spelled" aria-live="polite">
        <span v-if="spelled.length">{{ spelledText }}</span>
        <span v-else class="seance-spelled-empty">&mdash;</span>
      </p>

      <div class="seance-board-actions">
        <button class="secondary small" @click="closeBoard">Break the Circle</button>
      </div>
    </div>

    <div v-else class="seance-record">
      <h3>Séance Record</h3>

      <blockquote class="seance-transcript">
        <p class="seance-asked">&ldquo;{{ askedQuestion }}&rdquo;</p>
        <p class="seance-answer">{{ spelledText || 'The board gave nothing.' }}</p>
      </blockquote>

      <!--
        Only the two components, never a total alongside them: the resultant
        path length isn't the sum of the component path lengths, and printing
        all three invites an addition that doesn't come out.
      -->
      <dl class="seance-motion">
        <div>
          <dt>Motion from your hand</dt>
          <dd>{{ Math.round(travel.pointer) }}px</dd>
        </div>
        <div>
          <dt>Motion from the board</dt>
          <dd>{{ Math.round(travel.drift) }}px</dd>
        </div>
      </dl>

      <p class="seance-verdict">
        What the literature calls the ideomotor effect: the planchette has no motor, and every
        letter above was one your own hand arrived at. Of its movement,
        {{ Math.round(travel.drift) }}px was not yours — and the Club is obliged to disclose that
        this is a decorative tremor, added by the Club.
      </p>

      <div v-if="log.length" class="seance-log">
        <h4>Earlier Sittings</h4>
        <ul>
          <li v-for="(entry, index) in log" :key="index">
            <span class="seance-log-q">&ldquo;{{ entry.question }}&rdquo;</span>
            <span class="seance-log-a">{{ entry.answer }}</span>
          </li>
        </ul>
      </div>

      <div class="seance-record-actions">
        <button @click="askAgain">Sit Again</button>
        <button class="secondary" @click="endSession">Close Session</button>
      </div>
    </div>
  </SessionStage>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, defineProps } from 'vue'
import SessionStage from '../SessionStage.vue'
import PlanchetteAnimation from '../animations/PlanchetteAnimation.vue'
import { BOARD, GLYPHS, nearestGlyph } from '../../data/spiritBoard'
import { useSession } from '../../composables/useSession'
import { raiseSiege } from '../../composables/useSiege'

const props = defineProps(['scrollToElement'])

const { phase, isActive, begin, goTo, reset } = useSession({
  selector: '.spirit-board-session',
  scrollToElement: props.scrollToElement
})

// Heavy enough that the planchette is always behind your hand, which is what
// makes it feel carried rather than dragged.
const EASE = 0.055
const DRIFT_SPEED = 0.00042
// An offset laid over the tracked position, not a force applied to it. As a
// force its steady-state lag is amplitude/EASE -- about 19 units at the
// amplitude that reads well, which is wider than the settle threshold, so the
// planchette would never qualify as settled and would barely read at all.
const DRIFT_AMPLITUDE = 6
// The board only reads once the planchette has caught up with your hand. On
// the inner arc the letters are ~33 units apart, so during a slow approach the
// planchette can sit nearer a neighbour than its destination for longer than
// the dwell window, and spell that instead.
const SETTLE_DISTANCE = 18
const DWELL_MS = 650
const MAX_GLYPHS = 14
const LOG_KEY = 'rvc-seance-record'
const LOG_LIMIT = 8

const CENTRE = { x: BOARD.width / 2, y: BOARD.height / 2 + 40 }

function driftAt(now) {
  return {
    x: Math.sin(now * DRIFT_SPEED) * DRIFT_AMPLITUDE,
    y: Math.cos(now * DRIFT_SPEED * 0.73) * DRIFT_AMPLITUDE
  }
}

const question = ref('')
const askedQuestion = ref('')
const spelled = ref([])
const pos = ref({ ...CENTRE })
const dwellGlyphId = ref(null)
const log = ref(readLog())
const travel = ref({ total: 0, pointer: 0, drift: 0 })
let counters = { total: 0, pointer: 0, drift: 0 }
const questionField = ref(null)
const board = ref(null)

const target = { ...CENTRE }
// Where the hand has led it, before the tremor is laid on top. Glyphs are read
// from here, so the tremor stays decorative -- which is what the record claims.
let anchor = { ...CENTRE }
let drift = { x: 0, y: 0 }
let frame = null
let dwellSince = 0
let lastTakenId = null
let reduceMotion = false

const spelledText = computed(() => spelled.value.join(''))

const instruction = computed(() => {
  if (!spelled.value.length) return 'Rest your hand on the planchette. Do not push.'
  if (spelled.value.length < 3) return 'It is moving.'
  return 'Keep your hand light.'
})

/* --- input ------------------------------------------------------------- */

function toBoardSpace(event) {
  const rect = board.value.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * BOARD.width,
    y: ((event.clientY - rect.top) / rect.height) * BOARD.height
  }
}

// pointermove covers mouse, pen and touch in one handler; the board sets
// touch-action: none so a drag steers rather than scrolling the page.
function onPointerMove(event) {
  const point = toBoardSpace(event)
  target.x = point.x
  target.y = point.y
}

// Without this the board is unusable to anyone not holding a pointer.
function onKeyDown(event) {
  const step = event.shiftKey ? 48 : 16
  const moves = {
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0]
  }

  if (moves[event.key]) {
    event.preventDefault()
    target.x = clamp(target.x + moves[event.key][0], 0, BOARD.width)
    target.y = clamp(target.y + moves[event.key][1], 0, BOARD.height)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const glyph = nearestGlyph(anchor.x, anchor.y)
    if (glyph) takeGlyph(glyph)
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/* --- the loop ---------------------------------------------------------- */

function step(now) {
  const ease = reduceMotion ? 0.4 : EASE

  const pointerStep = {
    x: (target.x - anchor.x) * ease,
    y: (target.y - anchor.y) * ease
  }

  anchor = {
    x: clamp(anchor.x + pointerStep.x, 0, BOARD.width),
    y: clamp(anchor.y + pointerStep.y, 0, BOARD.height)
  }

  const nextDrift = reduceMotion ? { x: 0, y: 0 } : driftAt(now)
  const driftStep = { x: nextDrift.x - drift.x, y: nextDrift.y - drift.y }
  drift = nextDrift

  const previous = pos.value
  const next = { x: anchor.x + drift.x, y: anchor.y + drift.y }

  counters.pointer += Math.hypot(pointerStep.x, pointerStep.y)
  counters.drift += Math.hypot(driftStep.x, driftStep.y)
  counters.total += Math.hypot(next.x - previous.x, next.y - previous.y)

  pos.value = next

  const caughtUp = Math.hypot(target.x - anchor.x, target.y - anchor.y) < SETTLE_DISTANCE
  readBoard(now, caughtUp)

  frame = requestAnimationFrame(step)
}

function readBoard(now, caughtUp) {
  const glyph = caughtUp ? nearestGlyph(anchor.x, anchor.y) : null

  if (!glyph) {
    dwellGlyphId.value = null
    dwellSince = 0
    if (caughtUp) lastTakenId = null
    return
  }

  // Having taken a glyph, the planchette has to leave it before it counts
  // again; otherwise resting still spells the same letter forever.
  if (glyph.id === lastTakenId) return

  if (dwellGlyphId.value !== glyph.id) {
    dwellGlyphId.value = glyph.id
    dwellSince = now
    return
  }

  if (now - dwellSince >= DWELL_MS) takeGlyph(glyph)
}

function takeGlyph(glyph) {
  lastTakenId = glyph.id
  dwellGlyphId.value = null
  dwellSince = 0

  if (glyph.kind === 'farewell') {
    closeBoard()
    return
  }

  if (glyph.kind === 'word') {
    spelled.value = glyph.ch.split('')
    closeBoard()
    return
  }

  spelled.value.push(glyph.ch)

  if (spelled.value.length >= MAX_GLYPHS) closeBoard()
}

/* --- phases ------------------------------------------------------------ */

function openBoard() {
  askedQuestion.value = question.value.trim() || 'Is anyone there?'
  spelled.value = []
  pos.value = { ...CENTRE }
  anchor = { ...CENTRE }
  drift = { x: 0, y: 0 }
  target.x = CENTRE.x
  target.y = CENTRE.y
  counters = { total: 0, pointer: 0, drift: 0 }
  dwellGlyphId.value = null
  dwellSince = 0
  lastTakenId = null

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  goTo('board')
  nextTick(() => {
    board.value?.focus({ preventScroll: true })
    frame = requestAnimationFrame(step)
  })
}

function closeBoard() {
  stopLoop()
  travel.value = { ...counters }
  recordSitting()
  goTo('record')

  // You put a question to the board and the board declined to answer. That
  // is the closest thing a sitting has to a bad result, and something else
  // in the room takes the opening.
  if (!spelledText.value) raiseSiege('seance')
}

function endSession() {
  stopLoop()
  question.value = ''
  reset()
}

function stopLoop() {
  if (frame) cancelAnimationFrame(frame)
  frame = null
}

/* --- the séance record, per the contract's Article 3.2 ------------------ */

function readLog() {
  try {
    const stored = JSON.parse(localStorage.getItem(LOG_KEY))
    return Array.isArray(stored) ? stored.slice(0, LOG_LIMIT) : []
  } catch (err) {
    // Blocked storage or a corrupted value; the sitting still works without it.
    return []
  }
}

function recordSitting() {
  if (!spelledText.value) return

  log.value = [{ question: askedQuestion.value, answer: spelledText.value }, ...log.value].slice(
    0,
    LOG_LIMIT
  )

  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log.value))
  } catch (err) {
    // Keep it in memory; it just won't survive a reload.
  }
}

function startSitting() {
  begin('asking')
  nextTick(() => questionField.value?.focus({ preventScroll: true }))
}

function askAgain() {
  goTo('asking')
  nextTick(() => questionField.value?.focus({ preventScroll: true }))
}

onBeforeUnmount(stopLoop)
</script>

<style scoped>
.seance-ask p,
.seance-board-stage p {
  margin-inline: auto;
}

.seance-question {
  display: block;
  width: min(100%, 26rem);
  margin: 1rem auto;
  text-align: center;
}

.seance-ask-actions,
.seance-record-actions,
.seance-board-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 1rem;
}

.seance-question-echo,
.seance-asked {
  font-family: var(--font-display);
  color: var(--the-yellow);
}

.seance-instruction {
  font-family: var(--font-ui);
  font-size: var(--text-base) !important;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  min-height: 1.6em;
}

/* --- the board --- */
.seance-board {
  display: block;
  width: min(100%, 760px);
  aspect-ratio: 800 / 520;
  margin: 0 auto;
  /* so a drag steers the planchette instead of scrolling the page */
  touch-action: none;
  cursor: none;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
}

.seance-board:focus-visible {
  outline: 3px solid var(--the-yellow);
  outline-offset: 3px;
}

.seance-glyph {
  fill: var(--the-yellow);
  font-family: var(--font-heading);
  font-size: 30px;
  text-anchor: middle;
  dominant-baseline: middle;
  opacity: 0.72;
  transition: opacity 0.18s ease, fill 0.18s ease;
}

.seance-glyph.is-word,
.seance-glyph.is-farewell {
  font-size: 26px;
  letter-spacing: 0.1em;
}

.seance-glyph.is-digit {
  font-size: 24px;
}

.seance-glyph.reading {
  opacity: 1;
  fill: var(--candle);
}

.planchette-body {
  fill: rgba(12, 9, 7, 0.82);
  stroke: var(--the-yellow);
  stroke-width: 3px;
}

.planchette-aperture {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 3px;
}

.seance-spelled {
  font-family: var(--font-mono);
  font-size: var(--text-xl) !important;
  letter-spacing: 0.3em;
  color: var(--the-yellow);
  min-height: 1.6em;
  margin-top: 0.5rem;
}

.seance-spelled-empty {
  opacity: 0.4;
}

/* --- the record --- */
.seance-transcript {
  margin: 0 auto 1.5rem auto;
  max-width: var(--measure);
  border-left: 3px solid var(--oxblood);
  padding-left: 1rem;
  text-align: left;
}

.seance-answer {
  font-family: var(--font-mono);
  font-size: var(--text-xl) !important;
  letter-spacing: 0.26em;
  color: var(--the-yellow);
}

.seance-motion {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin: 0 auto 1.5rem auto;
}

.seance-motion dt {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  opacity: 0.7;
}

.seance-motion dd {
  margin: 4px 0 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--the-yellow);
}

.seance-verdict {
  max-width: var(--measure);
  margin-inline: auto;
}

.seance-log {
  max-width: var(--measure);
  margin: 1.5rem auto 0 auto;
}

.seance-log ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.seance-log li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(224, 189, 106, 0.14);
  text-align: left;
}

.seance-log-q {
  opacity: 0.75;
}

.seance-log-a {
  font-family: var(--font-mono);
  letter-spacing: 0.18em;
  color: var(--the-yellow);
}

@media (prefers-reduced-motion: reduce) {
  .seance-glyph {
    transition: none;
  }
}
</style>
