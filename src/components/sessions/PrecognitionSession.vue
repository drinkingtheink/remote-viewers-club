<template>
  <SessionStage title="Precognition Session" container-class="card-game" :is-active="isActive">
    <div class="game-container">
      <div v-if="phase === 'intro'" class="game-screen">
        <p class="panel-subheader">
          Twenty-four cards. Name the one the Hidden Oracle is about to choose.
        </p>

        <LotusAnimation class="lotus-anim-stage" />

        <button @click="beginRun" class="begin-session">Begin Session</button>
      </div>

      <div v-else-if="phase === 'running'" class="game-screen">
        <div class="run-tally">
          <span>Card {{ trialNumber }} of {{ TRIALS }}</span>
          <span>Hits: {{ hits }}</span>
        </div>

        <div class="run-progress-bar">
          <div class="progress" :style="{ width: `${(history.length / TRIALS) * 100}%` }"></div>
        </div>

        <svg id="moon-cycle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 648.23 153.1"><g id="moon-cycle"><path d="M382.93,61.49c.27,33.81-28.2,61.18-61.2,60.54-35.1-.68-60.72-27.31-60.56-61.48C261.31,26.86,287.64.25,322.6,0c32.13-.23,61.44,27.75,60.33,61.49Z"/><path d="M496.54,12.56c-23.44,12.64-37.37,31.25-37.12,58,.25,26.33,13.93,44.95,37.67,56.9-25.8,8.52-56.4-1.55-70.6-26.18-16.26-28.19-8.29-62.74,16.98-81.13,16.79-12.21,44.73-13.45,53.07-7.6Z"/><path d="M146.89,127.39c26-11.49,39.07-31.77,39.01-57.44-.06-25.47-12.85-45.77-37.37-56.76,2.86-5.49,28.8-5.27,40.87.33,31.9,14.8,44.96,48.08,33.51,77.98-12.31,32.12-44.88,44.99-76.02,35.89Z"/><path d="M595.76,32.14c-28.63,11.18-45.21,30.35-45.11,60.62.1,30.1,16.9,49.01,45.39,59.64-14.47,3.17-39.55-4.8-52.17-19.61-19.24-22.57-19.31-47.75-8.84-68.12,13.01-25.32,38.39-35.18,60.74-32.53Z"/><path d="M48.66,152.31c28.86-10.53,45.63-30.07,45.59-59.73-.03-29.76-16.34-49.69-44.54-59.96,14.32-3.91,38.58,4.09,52.6,20.98,18.24,21.99,17.4,54.42,2.27,74.72-14.39,19.31-40.03,27.14-55.92,24Z"/><path d="M0,92.47c14.67-2.37,22.48-10.83,24.99-25.26,2.3,14.59,10.34,22.71,24.86,25.11-14.29,2.84-22.49,10.75-24.81,25.33-2.63-14.22-10.23-22.87-25.04-25.18Z"/><path d="M598.8,91.73c13.9-1.83,22.44-9.56,24.56-24.35,2.64,14.14,10.36,22.58,24.87,24.95-14.24,2.94-22.45,10.89-23.91,25.49-3.06-6.12-4.78-12.67-8.89-16.9-4.07-4.18-10.56-6-16.63-9.2Z"/></g></svg>

        <p class="run-prompt">Which card will the Oracle choose?</p>

        <div class="cards-container">
          <button
            v-for="(card, index) in cards"
            :key="`${history.length}-${index}`"
            class="card"
            :class="{ flipped: card.flipped }"
            :disabled="revealing"
            :aria-label="`Card ${index + 1}, ${symbolName(card.symbol)}`"
            :style="{ animationDelay: `0.${index}s` }"
            @click="selectCard(index)"
          >
            <span class="card-inner">
              <span class="card-front">
                <ZenerSymbol :symbol="card.symbol" />
              </span>
              <span class="card-back" :class="{ chosen: card.isChosen }">
                <span class="card-mark" :class="{ chosen: card.isChosen }">
                  {{ card.isChosen ? '★' : '✗' }}
                </span>
              </span>
            </span>
          </button>
        </div>

        <p class="run-feedback" :class="{ hit: lastHit === true, miss: lastHit === false }" role="status">
          {{ feedback }}
        </p>

        <div class="start-over-container">
          <button @click="endSession" class="secondary small">Close Session</button>
        </div>
      </div>

      <div v-else class="game-screen">
        <h3>Run Complete</h3>

        <div class="run-score">
          <span class="run-score-hits">{{ hits }}</span>
          <span class="run-score-of">of {{ TRIALS }}</span>
        </div>

        <ol class="run-tape">
          <li
            v-for="(trial, index) in history"
            :key="index"
            :class="{ hit: trial.hit }"
            :title="`Card ${index + 1}: ${trial.hit ? 'hit' : 'miss'}`"
          >
            <span class="visually-hidden">Card {{ index + 1 }}: {{ trial.hit ? 'hit' : 'miss' }}</span>
          </li>
        </ol>

        <dl class="run-stats">
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

        <p class="run-verdict">{{ verdict }}</p>

        <p class="run-protocol">
          Protocol note: the Oracle selects only <em>after</em> your call is recorded. Any
          agreement is therefore precognition rather than mere clairvoyance.
        </p>

        <p v-if="lifetime.runs > 0" class="run-lifetime">
          Lifetime record: {{ lifetime.hits }} of {{ lifetime.trials }} ({{ lifetimeRate }}%)
          across {{ lifetime.runs }} {{ lifetime.runs === 1 ? 'run' : 'runs' }}. Chance is 33%.
        </p>

        <div class="run-actions">
          <button @click="beginRun">Run Again</button>
          <button @click="endSession" class="secondary">Close Session</button>
        </div>
      </div>
    </div>
  </SessionStage>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, defineProps } from 'vue'
import SessionStage from '../SessionStage.vue'
import LotusAnimation from '../animations/LotusAnimation.vue'
import ZenerSymbol from '../icons/ZenerSymbol.vue'
import zenerSymbols, { zenerSymbolName as symbolName } from '../../data/zenerSymbols'
import { useSession } from '../../composables/useSession'

const props = defineProps(['scrollToElement'])

const { phase, isActive, begin, goTo, reset, failMessage } = useSession({
  selector: '.card-game',
  scrollToElement: props.scrollToElement
})

// A run of 24 gives a whole-number expectation on a three-way choice: chance is
// 1-in-3, so 8 hits is what guessing alone produces. The standard deviation
// below is the real one for that distribution, which makes z honest arithmetic
// rather than a number we invented.
const CARDS_PER_TRIAL = 3
const TRIALS = 24
const EXPECTED = TRIALS / CARDS_PER_TRIAL
const SD = Math.sqrt(TRIALS * (1 / CARDS_PER_TRIAL) * (1 - 1 / CARDS_PER_TRIAL))

const REVEAL_MS = 1500
const LIFETIME_KEY = 'rvc-precog-lifetime'

const cards = ref([])
const history = ref([])
const lastHit = ref(null)
const feedback = ref('')
const lifetime = ref(readLifetime())

let revealTimer = null

const hits = computed(() => history.value.filter((trial) => trial.hit).length)
const revealing = computed(() => cards.value.some((card) => card.flipped))
const trialNumber = computed(() =>
  revealing.value ? history.value.length : Math.min(history.value.length + 1, TRIALS)
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

function dealTrial() {
  // Three distinct faces from the Zener deck. Nothing is chosen yet: see selectCard.
  const faces = [...zenerSymbols].sort(() => 0.5 - Math.random()).slice(0, CARDS_PER_TRIAL)

  cards.value = faces.map((face) => ({
    symbol: face.id,
    isChosen: false,
    flipped: false
  }))
}

function beginRun() {
  clearTimeout(revealTimer)
  history.value = []
  lastHit.value = null
  feedback.value = ''
  dealTrial()
  begin('running')
}

function selectCard(index) {
  if (revealing.value) return

  // The Oracle chooses only now, after the call is locked in. In Rhine's
  // protocol that ordering is the whole difference between a precognition test
  // and a clairvoyance one.
  const chosenIndex = Math.floor(Math.random() * CARDS_PER_TRIAL)
  cards.value[chosenIndex].isChosen = true

  const hit = index === chosenIndex
  lastHit.value = hit
  feedback.value = hit ? 'Hit — you named it before it was chosen.' : 'Miss.'
  history.value.push({ hit })

  cards.value.forEach((card) => {
    card.flipped = true
  })

  revealTimer = setTimeout(() => {
    if (history.value.length >= TRIALS) {
      recordLifetime()
      goTo('result')
      return
    }

    lastHit.value = null
    feedback.value = ''
    dealTrial()
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

<style scoped>
.game-screen {
  min-height: 100px;
  transition: min-height var(--dur-base) var(--ease-settle);
  margin-top: -20px;
  padding-top: 2rem;
}

.run-tally {
  display: flex;
  justify-content: space-between;
  max-width: 420px;
  margin: 0 auto;
  font-family: var(--font-ui);
  font-size: var(--text-base);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--the-yellow);
}

.run-progress-bar {
  height: 10px;
  background-color: var(--leather-raised);
  border-radius: 5px;
  overflow: hidden;
  margin: 10px auto 0 auto;
  max-width: 420px;
}

.run-progress-bar .progress {
  height: 100%;
  background-color: var(--btn-accent);
  transition: width 0.3s ease;
}

.run-prompt {
  margin: 1rem auto 0 auto;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: #fff;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0 30px 0;
  flex-wrap: wrap;
}

@keyframes openUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* The cards are real buttons now, so they reset the shared button styling. */
.card {
  all: unset;
  box-sizing: border-box;
  width: 150px;
  height: 210px;
  perspective: 1000px;
  cursor: pointer;
  animation: openUp 0.5s forwards;
}

.card:disabled {
  cursor: default;
}

.card-inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-front {
  color: var(--the-yellow);
  border: 2px solid #fff;
  transition: transform var(--dur-base) var(--ease-settle), background-color var(--dur-base) var(--ease-out);
  transform-origin: center;
  background-color: var(--oxblood);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='church-on-sunday' fill='%23ff0000' fill-opacity='0.75'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.card-front :deep(.zener-glyph) {
  width: 60%;
  height: 60%;
}

.card:hover:not(:disabled) .card-front {
  border-width: 5px;
  background-color: var(--cinnabar);
  transform: scale(1.1);
}

.card:focus-visible .card-front {
  outline: 3px solid var(--the-yellow);
  outline-offset: 3px;
}

.card-back {
  background-color: var(--parchment);
  transform: rotateY(180deg);
  color: var(--btn-accent);
}

.card-back.chosen {
  background-color: var(--success);
}

.card-mark {
  font-size: 88px;
  line-height: 1;
}

.card-mark.chosen {
  color: #fff;
}

.run-feedback {
  min-height: 1.6em;
  margin: 0 auto 1rem auto;
  font-family: var(--font-ui);
  font-size: var(--text-md);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: #fff;
}

.run-feedback.hit {
  color: var(--success);
}

.run-feedback.miss {
  color: var(--cinnabar);
}

/* --- results --- */
.run-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  margin: 1rem 0;
}

.run-score-hits {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  line-height: 1;
  color: var(--the-yellow);
}

.run-score-of {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: #fff;
}

.run-tape {
  list-style: none;
  padding: 0;
  margin: 0 auto 1.5rem auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  /* Wide enough for all 24 marks to read as one continuous tape. */
  max-width: 600px;
}

.run-tape li {
  display: block;
  width: 14px;
  height: 14px;
  margin: 0;
  border: 2px solid rgba(241, 243, 128, 0.35);
  border-radius: 3px;
}

.run-tape li.hit {
  background: var(--the-yellow);
  border-color: var(--the-yellow);
}

.run-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin: 0 auto 1.5rem auto;
}

.run-stats dt {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: #fff;
  opacity: 0.7;
}

.run-stats dd {
  margin: 4px 0 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--the-yellow);
}

.run-verdict {
  max-width: var(--measure);
  margin-inline: auto;
}

.run-protocol,
.run-lifetime {
  font-size: var(--text-base);
  opacity: 0.8;
  max-width: var(--measure);
  margin-inline: auto;
}

.run-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 1rem;
}

.start-over-container {
  margin-top: 10px;
}

#moon-cycle {
  max-width: 300px;
  margin: 1rem auto 0 auto;
  display: block;
  fill: var(--the-yellow);
  opacity: 0.6;
}

.lotus-anim-stage {
  margin-bottom: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .card-inner,
  .card:hover:not(:disabled) .card-front {
    animation: none;
    transition: none;
  }
}
</style>
