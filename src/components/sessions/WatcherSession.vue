<template>
  <SessionStage form="RVC FORM 42-F" title="Watcher Session" container-class="watcher-session" :is-active="isActive">
    <div v-if="phase === 'intro'" class="panel">
      <p class="panel-subheader">
        The Club will watch you. Report the moments you feel it.
      </p>

      <EyeAnimation />

      <button @click="startRun" class="begin-session">Begin Session</button>
    </div>

    <div v-else-if="phase === 'watching'" class="watcher-run">
      <p class="watcher-brief">
        Over the course of one run you will be observed
        {{ WINDOWS }} times, at intervals you are not told. The observation
        leaves no mark on this page. Press when you feel it, and the Club will
        tell you afterwards whether you were right.
      </p>

      <div class="watcher-field">
        <svg class="watcher-eye" viewBox="0 0 120 64" aria-hidden="true">
          <path
            class="watcher-lid"
            d="M6 36C26 14 46 6 60 6s34 8 54 30"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            class="watcher-lash"
            d="M18 44l-6 9M42 52l-3 10M60 55v11M78 52l3 10M102 44l6 9"
            fill="none"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
        <p class="watcher-status" aria-live="polite">{{ statusLine }}</p>
      </div>

      <button class="watcher-press" :class="{ struck }" @click="feelIt">I feel it</button>

      <p class="watcher-marks" aria-live="polite">{{ markLabel }}</p>

      <!--
        Pressing lays a mark on the run's track, at the same position in the
        run that the record will later plot it. It confirms the press landed
        and shows where it fell, while saying nothing about whether it was
        right -- that would make this a reaction test. Every mark looks the
        same here; they are only told apart afterwards.
      -->
      <div class="watcher-progress" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100">
        <span class="watcher-fill" :style="{ width: `${progress * 100}%` }"></span>
        <span
          v-for="(mark, i) in presses"
          :key="`m${i}`"
          class="watcher-mark"
          :style="{ left: pct(mark.t) }"
        ></span>
      </div>

      <button class="secondary small" @click="endSession">Close Session</button>
    </div>

    <div v-else class="watcher-report">
      <h3>Observation Record</h3>

      <!--
        The run is deliberately featureless while it happens -- a visible cue
        would make this a reaction test. The timeline is the whole payoff: it
        is the first time the subject sees when they were being watched.
      -->
      <div class="watcher-timeline" aria-hidden="true">
        <span
          v-for="(w, i) in schedule"
          :key="`w${i}`"
          class="tl-window"
          :class="{ 'tl-caught': w.hit }"
          :style="{ left: pct(w.start), width: pct(w.end - w.start) }"
        ></span>
        <span
          v-for="(p, i) in presses"
          :key="`p${i}`"
          class="tl-press"
          :class="p.hit ? 'tl-press-hit' : 'tl-press-stray'"
          :style="{ left: pct(p.t) }"
        ></span>
      </div>
      <p class="watcher-legend" aria-hidden="true">
        <span class="key key-window"></span> observed
        <span class="key key-hit"></span> felt
        <span class="key key-stray"></span> stray
      </p>

      <dl class="watcher-stats">
        <div><dt>Observed</dt><dd>{{ WINDOWS }}</dd></div>
        <div><dt>Felt</dt><dd>{{ hits }}</dd></div>
        <div><dt>Stray</dt><dd>{{ falseAlarms }}</dd></div>
        <div><dt>Mean delay</dt><dd>{{ meanLatency === null ? '—' : `${meanLatency} ms` }}</dd></div>
      </dl>

      <p class="watcher-finding">{{ verdict.finding }}</p>
      <p class="watcher-note">{{ verdict.note }}</p>

      <div class="watcher-actions">
        <button @click="startRun">Run Again</button>
        <button class="secondary" @click="endSession">Close Session</button>
      </div>
    </div>
  </SessionStage>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch, defineProps } from 'vue'
import SessionStage from '../SessionStage.vue'
import EyeAnimation from '../animations/EyeAnimation.vue'
import { useSession } from '../../composables/useSession'
import { WINDOWS, WINDOW_MS, GAP_MS, SETTLE_MS, verdictFor } from '../../data/watcherVerdicts'
import { raiseSiege } from '../../composables/useSiege'

const props = defineProps(['scrollToElement'])

const { phase, isActive, begin, goTo, reset } = useSession({
  selector: '.watcher-session',
  scrollToElement: props.scrollToElement
})

const schedule = ref([])
const presses = ref([])
const progress = ref(0)
const struck = ref(false)

let startedAt = 0
let runLength = 0
let frame = null
let struckTimer = null

const between = ([min, max]) => min + Math.random() * (max - min)

/**
 * Lay out the whole run before it starts.
 *
 * Deciding each window as it comes would let the gaps drift with timer lag,
 * and the record afterwards has to be honest about when the Club was looking.
 */
const planRun = () => {
  const windows = []
  let t = SETTLE_MS

  for (let i = 0; i < WINDOWS; i += 1) {
    windows.push({ start: t, end: t + WINDOW_MS, hit: false, latency: null })
    t += WINDOW_MS + between(GAP_MS)
  }

  runLength = t
  return windows
}

const tick = () => {
  const elapsed = performance.now() - startedAt
  progress.value = Math.min(elapsed / runLength, 1)

  if (elapsed >= runLength) {
    stopClock()
    goTo('report')
    return
  }

  frame = requestAnimationFrame(tick)
}

const stopClock = () => {
  if (frame !== null) cancelAnimationFrame(frame)
  frame = null
}

const startRun = () => {
  schedule.value = planRun()
  presses.value = []
  progress.value = 0
  startedAt = performance.now()

  if (phase.value === 'intro') begin('watching')
  else goTo('watching')

  stopClock()
  frame = requestAnimationFrame(tick)
}

const feelIt = () => {
  const t = performance.now() - startedAt
  if (t > runLength) return

  // Acknowledge the press itself. Deliberately says nothing about the
  // schedule: it fires identically whether or not a window is open.
  struck.value = true
  clearTimeout(struckTimer)
  struckTimer = setTimeout(() => {
    struck.value = false
  }, 260)

  // A window can only be felt once; a second press inside the same one is a
  // stray, which is what stops leaning on the button from reading as a hit.
  const open = schedule.value.find((w) => t >= w.start && t <= w.end && !w.hit)

  if (open) {
    open.hit = true
    open.latency = Math.round(t - open.start)
    presses.value.push({ t, hit: true })
  } else {
    presses.value.push({ t, hit: false })
  }
}

const endSession = () => {
  stopClock()
  reset()
}

const markLabel = computed(() => {
  const count = presses.value.length
  if (!count) return 'No marks yet'
  return count === 1 ? '1 mark laid' : `${count} marks laid`
})

const hits = computed(() => schedule.value.filter((w) => w.hit).length)
const falseAlarms = computed(() => presses.value.filter((p) => !p.hit).length)

const meanLatency = computed(() => {
  const felt = schedule.value.filter((w) => w.hit)
  if (!felt.length) return null
  return Math.round(felt.reduce((sum, w) => sum + w.latency, 0) / felt.length)
})

const verdict = computed(() =>
  verdictFor({
    hits: hits.value,
    falseAlarms: falseAlarms.value,
    presses: presses.value.length
  })
)

/*
 * A run that told the Club nothing does not end quietly. Watched rather
 * than called at the end of the run, because the verdict is a computed and
 * this is the one place that knows the moment it settles -- and `once` so a
 * reader rereading their own result does not raise them twice.
 */
watch(
  () => verdict.value?.rouses && phase.value === 'report',
  (rouses) => {
    if (rouses) raiseSiege('watcher')
  }
)

const statusLine = computed(() =>
  progress.value < 0.04 ? 'The Club is settling.' : 'Run in progress.'
)

const pct = (ms) => `${(ms / runLength) * 100}%`

onBeforeUnmount(() => {
  stopClock()
  clearTimeout(struckTimer)
})
</script>

<style>
.watcher-session .watcher-brief {
  max-width: 54ch;
  margin: 0 auto 1.5rem;
}

.watcher-session .watcher-field {
  display: grid;
  place-items: center;
  gap: 1rem;
  min-height: 190px;
}

/*
 * The eye stays shut for the whole run. Anything that moved here would be a
 * tell, and the subject would be timing an animation rather than a feeling.
 */
.watcher-session .watcher-eye {
  width: 180px;
  max-width: 60%;
}

.watcher-session .watcher-lid,
.watcher-session .watcher-lash {
  stroke: var(--gilt-dim);
}

.watcher-session .watcher-status {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  color: var(--ash);
  margin: 0;
}

.watcher-session .watcher-press {
  min-width: 16rem;
  margin-bottom: 0.6rem;
  transition: background-color 0.12s ease, color 0.12s ease, transform 0.12s ease;
}

.watcher-session .watcher-press.struck {
  background-color: var(--gilt-bright);
  color: var(--leather-deep);
  transform: scale(0.97);
}

.watcher-session .watcher-marks {
  font-family: var(--font-mono);
  font-size: var(--text-sm) !important;
  letter-spacing: var(--tracking-wide);
  color: var(--ash);
  margin: 0 auto 1rem !important;
}

.watcher-session .watcher-progress {
  position: relative;
  width: min(28rem, 80%);
  /* taller than a bare progress bar needs: it carries the marks now */
  height: 9px;
  margin: 0 auto 1.5rem;
  background: var(--leather-raised);
  border-radius: 2px;
  overflow: hidden;
}

.watcher-session .watcher-fill {
  display: block;
  height: 100%;
  background: var(--gilt-dim);
}

.watcher-session .watcher-mark {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--gilt-bright);
}

@media (prefers-reduced-motion: reduce) {
  .watcher-session .watcher-press {
    transition: none;
  }

  .watcher-session .watcher-press.struck {
    transform: none;
  }
}

/* --- the record --- */
.watcher-session .watcher-timeline {
  position: relative;
  height: 46px;
  margin: 1.5rem auto 0.6rem;
  width: min(44rem, 92%);
  background: var(--leather-deep);
  border: 1px solid var(--gilt-dim);
  border-radius: 3px;
  overflow: hidden;
}

.watcher-session .tl-window {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(201, 162, 39, 0.26);
}

.watcher-session .tl-window.tl-caught {
  background: rgba(201, 162, 39, 0.55);
}

.watcher-session .tl-press {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
}

.watcher-session .tl-press-hit {
  background: var(--parchment);
}

.watcher-session .tl-press-stray {
  background: var(--signal-wrong);
}

.watcher-session .watcher-legend {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  color: var(--ash);
}

.watcher-session .key {
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  margin: 0 0.3rem 0 1rem;
  vertical-align: -1px;
}

.watcher-session .key-window { background: rgba(201, 162, 39, 0.4); }
.watcher-session .key-hit { background: var(--parchment); }
.watcher-session .key-stray { background: var(--signal-wrong); }

.watcher-session .watcher-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem 2.5rem;
  margin: 1.5rem 0 1.25rem;
}

.watcher-session .watcher-stats dt {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wider);
  color: var(--ash);
}

.watcher-session .watcher-stats dd {
  margin: 0.2rem 0 0;
  font-size: var(--text-xl);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--gilt-bright);
}

.watcher-session .watcher-finding {
  /* `.stage p` gives paragraphs a width and centres them with auto margins;
     zeroing the margin without the width leaves it hugging the left edge */
  width: auto;
  margin: 0 auto;
  font-size: var(--text-lg);
  font-variant-caps: all-small-caps;
  letter-spacing: var(--tracking-wide);
  color: var(--gilt-bright);
}

.watcher-session .watcher-note {
  max-width: 52ch;
  margin: 0.4rem auto 1.5rem;
  font-style: italic;
}

.watcher-session .watcher-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
