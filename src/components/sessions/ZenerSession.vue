<template>
  <SessionStage title="Zener Card Session" container-class="zener-session" :is-active="isActive">
    <div v-if="phase === 'intro'" class="panel">
      <p class="panel-subheader">
        Twenty-five cards. Five symbols. Name each one before it is turned.
      </p>

      <ZenerAnimation />

      <button @click="beginRun" class="begin-session">Begin Session</button>
    </div>

    <div v-else-if="phase === 'running'" class="zener-run">
      <div class="zener-tally">
        <span>Card {{ trialNumber }} of {{ TRIALS }}</span>
        <span>Hits: {{ hits }}</span>
      </div>

      <div class="zener-progress-bar">
        <div class="progress" :style="{ width: `${(history.length / TRIALS) * 100}%` }"></div>
      </div>

      <div class="zener-card" :class="{ flipped: !!revealed }">
        <div class="zener-card-inner">
          <div class="zener-card-back"><span>?</span></div>
          <div class="zener-card-front">
            <ZenerSymbol v-if="revealed" :symbol="revealed" />
          </div>
        </div>
      </div>

      <p class="zener-feedback" :class="{ hit: lastHit === true, miss: lastHit === false }" role="status">
        {{ feedback }}
      </p>

      <p class="zener-prompt">Which symbol is on the card?</p>

      <div class="zener-choices">
        <button
          v-for="symbol in symbols"
          :key="symbol.id"
          class="zener-choice"
          :disabled="!!revealed"
          :aria-label="symbol.name"
          @click="guess(symbol.id)">
          <ZenerSymbol :symbol="symbol.id" />
          <span class="zener-choice-name">{{ symbol.name }}</span>
        </button>
      </div>

      <button @click="endSession" class="secondary small">Close Session</button>
    </div>

    <div v-else class="zener-result">
      <h3>Run Complete</h3>

      <div class="zener-score">
        <span class="zener-score-hits">{{ hits }}</span>
        <span class="zener-score-of">of {{ TRIALS }}</span>
      </div>

      <ol class="zener-tape">
        <li
          v-for="(trial, index) in history"
          :key="index"
          :class="{ hit: trial.hit }"
          :title="`Card ${index + 1}: called ${name(trial.guess)}, was ${name(trial.target)}`"
        >
          <span class="visually-hidden">
            Card {{ index + 1 }}: called {{ name(trial.guess) }}, was {{ name(trial.target) }}
          </span>
        </li>
      </ol>

      <dl class="zener-stats">
        <div>
          <dt>Expected by chance</dt>
          <dd>{{ EXPECTED }}</dd>
        </div>
        <div>
          <dt>Deviation</dt>
          <dd>{{ deviation > 0 ? '+' : '' }}{{ deviation }}</dd>
        </div>
        <div>
          <dt>Standard score</dt>
          <dd>z = {{ zScore.toFixed(2) }}</dd>
        </div>
      </dl>

      <p class="zener-verdict">{{ verdict }}</p>

      <p v-if="lifetime.runs > 0" class="zener-lifetime">
        Lifetime record: {{ lifetime.hits }} of {{ lifetime.trials }} ({{ lifetimeRate }}%)
        across {{ lifetime.runs }} {{ lifetime.runs === 1 ? 'run' : 'runs' }}. Chance is 20%.
      </p>

      <div class="zener-result-actions">
        <button @click="beginRun">Run Again</button>
        <button @click="endSession" class="secondary">Close Session</button>
      </div>
    </div>
  </SessionStage>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, defineProps } from 'vue'
import SessionStage from '../SessionStage.vue'
import ZenerAnimation from '../animations/ZenerAnimation.vue'
import ZenerSymbol from '../icons/ZenerSymbol.vue'
import symbols, { zenerSymbolName as name } from '../../data/zenerSymbols'
import { useSession } from '../../composables/useSession'

const props = defineProps(['scrollToElement'])

const { phase, isActive, begin, goTo, reset, failMessage } = useSession({
  selector: '.zener-session',
  scrollToElement: props.scrollToElement
})

// A standard Rhine run. This is an "open deck": every card is drawn
// independently, so each trial really is 1-in-5 and the statistics below are
// the honest ones rather than a number we made up.
const TRIALS = 25
const EXPECTED = TRIALS / symbols.length
const SD = Math.sqrt(TRIALS * (1 / symbols.length) * (1 - 1 / symbols.length))

// Long enough to read the card after the 0.5s flip lands.
const REVEAL_MS = 1600
const LIFETIME_KEY = 'rvc-zener-lifetime'

const history = ref([])
const target = ref(null)
const revealed = ref(null)
const lastHit = ref(null)
const feedback = ref('')
const lifetime = ref(readLifetime())

let revealTimer = null

const hits = computed(() => history.value.filter((trial) => trial.hit).length)
const trialNumber = computed(() =>
  revealed.value ? history.value.length : Math.min(history.value.length + 1, TRIALS)
)
const deviation = computed(() => hits.value - EXPECTED)
const zScore = computed(() => deviation.value / SD)
const lifetimeRate = computed(() =>
  lifetime.value.trials ? Math.round((lifetime.value.hits / lifetime.value.trials) * 100) : 0
)

const verdict = computed(() => {
  const z = zScore.value

  if (z >= 2.5) {
    return 'Significant at p < 0.01. Your results have been forwarded to the Council of Elders for review in this realm and the next.'
  }
  if (z >= 1.65) {
    return 'Significant at p < 0.05. Promising — though the Club is obliged to note that roughly one in twenty non-psychics manages this by accident.'
  }
  if (z >= 1) {
    return 'Above chance, but not significantly so. The ether remains noncommittal.'
  }
  if (z > -1) {
    return `Squarely within chance. ${failMessage()}`
  }
  if (z > -1.65) {
    return 'Slightly below chance. Either the signal is faint, or it is arriving inverted.'
  }
  return 'Significantly BELOW chance — what the literature calls psi-missing: the unconscious avoidance of the correct target. Interpreted by some researchers as evidence of psi, and by others as evidence of guessing.'
})

function drawCard() {
  target.value = symbols[Math.floor(Math.random() * symbols.length)].id
}

function beginRun() {
  clearTimeout(revealTimer)
  history.value = []
  revealed.value = null
  lastHit.value = null
  feedback.value = ''
  drawCard()
  begin('running')
}

function guess(symbolId) {
  if (revealed.value) return

  const hit = symbolId === target.value
  revealed.value = target.value
  lastHit.value = hit
  history.value.push({ target: target.value, guess: symbolId, hit })
  feedback.value = hit ? 'Hit.' : `Miss — the card was ${name(target.value)}.`

  revealTimer = setTimeout(() => {
    if (history.value.length >= TRIALS) {
      recordLifetime()
      goTo('result')
      return
    }

    revealed.value = null
    lastHit.value = null
    feedback.value = ''
    drawCard()
  }, REVEAL_MS)
}

function endSession() {
  clearTimeout(revealTimer)
  reset()
}

function readLifetime() {
  const empty = { hits: 0, trials: 0, runs: 0 }

  try {
    const stored = JSON.parse(localStorage.getItem(LIFETIME_KEY))
    if (!stored) return empty

    return {
      hits: Number(stored.hits) || 0,
      trials: Number(stored.trials) || 0,
      runs: Number(stored.runs) || 0
    }
  } catch (err) {
    // Private browsing, blocked storage, or a corrupted value — not worth
    // breaking the session over.
    return empty
  }
}

function recordLifetime() {
  lifetime.value = {
    hits: lifetime.value.hits + hits.value,
    trials: lifetime.value.trials + history.value.length,
    runs: lifetime.value.runs + 1
  }

  try {
    localStorage.setItem(LIFETIME_KEY, JSON.stringify(lifetime.value))
  } catch (err) {
    // Keep the in-memory tally; it just won't survive a reload.
  }
}

onBeforeUnmount(() => clearTimeout(revealTimer))
</script>

<style>
.zener-session .zener-tally {
  display: flex;
  justify-content: space-between;
  max-width: 420px;
  margin: 0 auto;
  font-family: 'Anta', sans-serif;
  text-transform: uppercase;
  color: var(--the-yellow);
}

.zener-session .zener-progress-bar {
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px auto 20px auto;
  max-width: 420px;
}

.zener-session .zener-progress-bar .progress {
  height: 100%;
  background-color: red;
  transition: width 0.3s ease;
}

/* --- the card --- */
.zener-session .zener-card {
  width: 150px;
  height: 200px;
  margin: 0 auto;
  perspective: 1000px;
}

.zener-session .zener-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.zener-session .zener-card.flipped .zener-card-inner {
  transform: rotateY(180deg);
}

.zener-session .zener-card-back,
.zener-session .zener-card-front {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--the-yellow);
  border-radius: 8px;
  background: #000;
}

.zener-session .zener-card-back span {
  font-family: 'Vollkorn', serif;
  font-size: 400%;
  color: var(--the-yellow);
  opacity: 0.5;
}

.zener-session .zener-card-front {
  transform: rotateY(180deg);
  color: var(--the-yellow);
}

.zener-session .zener-card-front .zener-glyph {
  width: 70%;
  height: 70%;
}

.zener-session .zener-feedback {
  min-height: 1.6em;
  margin: 1rem auto 0 auto !important;
  font-family: 'Anta', sans-serif !important;
  text-transform: uppercase;
  font-size: 110% !important;
}

.zener-session .zener-feedback.hit {
  color: var(--success) !important;
}

.zener-session .zener-feedback.miss {
  color: #ff6b6b !important;
}

.zener-session .zener-prompt {
  font-size: 120% !important;
  margin-bottom: 0.5rem !important;
}

/* --- the five choices --- */
.zener-session .zener-choices {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 0 auto 1.5rem auto;
  max-width: 560px;
}

.zener-session .zener-choice {
  background: #000;
  color: var(--the-yellow);
  border: 2px solid var(--the-yellow);
  border-radius: 8px;
  padding: 10px;
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.zener-session .zener-choice .zener-glyph {
  width: 48px;
  height: 48px;
}

.zener-session .zener-choice-name {
  font-size: var(--text-xs);
  letter-spacing: 0.05em;
}

.zener-session .zener-choice:hover:not(:disabled) {
  background: var(--the-yellow);
  color: #000;
  transform: translateY(-3px);
}

.zener-session .zener-choice:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* --- results --- */
.zener-session .zener-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  margin: 1rem 0;
}

.zener-session .zener-score-hits {
  font-family: 'Vollkorn', serif;
  font-size: 420%;
  line-height: 1;
  color: var(--the-yellow);
}

.zener-session .zener-score-of {
  font-family: 'Unica One', sans-serif;
  font-size: 160%;
  color: #fff;
}

.zener-session .zener-tape {
  list-style: none;
  padding: 0;
  margin: 0 auto 1.5rem auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  /* Wide enough for all 25 marks to read as one continuous tape. */
  max-width: 600px;
}

.zener-session .zener-tape li {
  display: block;
  width: 14px;
  height: 14px;
  margin: 0;
  border: 2px solid rgba(241, 243, 128, 0.35);
  border-radius: 3px;
}

.zener-session .zener-tape li.hit {
  background: var(--the-yellow);
  border-color: var(--the-yellow);
}

.zener-session .zener-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin: 0 auto 1.5rem auto;
}

.zener-session .zener-stats dt {
  font-family: 'Anta', sans-serif;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #fff;
  opacity: 0.7;
}

.zener-session .zener-stats dd {
  margin: 4px 0 0 0;
  font-family: 'Courier New', monospace;
  font-size: 150%;
  color: var(--the-yellow);
}

.zener-session .zener-verdict {
  max-width: 620px;
  font-size: 120% !important;
}

.zener-session .zener-lifetime {
  font-size: 95% !important;
  opacity: 0.75;
}

.zener-session .zener-result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .zener-session .zener-card-inner,
  .zener-session .zener-choice {
    transition: none;
  }
}
</style>
