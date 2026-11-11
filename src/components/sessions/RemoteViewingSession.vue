<template>
  <div class="remote-viewing-container stage" :class="{ 'active': stage !== 'intro' }">
    <p class="session-form">RVC FORM 09-C</p>
    <h2>Remote Viewing Session</h2>

    <div v-if="stage === 'intro'" class="panel">
      <p class="panel-subheader">Focus your mind and prepare to connect with the given coordinates.</p>

      <section class="anim">
        <WindowAnimation class="window-anim-stage" />
      </section>

      <button @click="beginSession" class="begin-session">Begin Session</button>
    </div>

    <div v-else-if="stage === 'coordinates'" class="coordinates">
      <h3>Target Coordinates</h3>
      <div class="coordinate-display">{{ coordinates }}</div>
      <p>Focus on these coordinates. Clear your mind and visualize what exists at this location.</p>
      <div class="progress-bar">
        <div :style="{ width: `${focusProgress}%` }" class="progress"></div>
      </div>

      <section class="anim">
        <WindowAnimation class="window-anim-stage" />
      </section>

      <p class="status-text">{{ statusMessage }}</p>
      <button @click="submitImpression" :disabled="!canSubmit">
        Submit Impression
      </button>
    </div>

    <div v-else-if="stage === 'drawing'" class="drawing">
      <h3>Record Your Impression</h3>
      <p>Draw or describe what you sensed at the coordinates.</p>
      <div class="canvas-container">
        <canvas 
          ref="canvas" 
          @mousedown="startDrawing" 
          @mousemove="draw" 
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          width="400" 
          height="300">
        </canvas>
        <div class="canvas-tools">
          <button @click="clearCanvas" class="secondary">Clear</button>
          <input type="color" v-model="penColor" class="color-picker" />
          <input type="range" v-model="penSize" min="1" max="20" class="pen-size" />
        </div>
      </div>
      <textarea 
        v-model="textualImpression" 
        placeholder="Describe what you sensed..." 
        class="impression-textarea"
        id="textualImpression"
      >
      </textarea>
      <label class="archive-opt-in">
        <input type="checkbox" v-model="shareWithArchive" />
        <span>File this impression with the Club archive</span>
      </label>

      <button @click="submitForJudging">Submit for Judging</button>
    </div>

    <div v-else-if="stage === 'judging'" class="judging">
      <h3>Judging</h3>
      <p class="judging-brief">
        One of these four is the target. The other three are decoys, drawn from the same
        register. Set them against your own impression and choose the one it matches best.
        Which is which is withheld until you have chosen: a judgement made after the answer
        is not a judgement.
      </p>

      <figure class="judging-impression">
        <img :src="userDrawingImage" alt="Your impression" />
        <figcaption>{{ textualImpression || 'No description recorded.' }}</figcaption>
      </figure>

      <ul class="judging-pool">
        <li v-for="(site, i) in pool" :key="site.id">
          <button type="button" class="judging-choice" @click="judge(site)">
            <img :src="imageFor(site)" :alt="`Candidate ${POOL_LABELS[i]}`" />
            <span class="judging-letter">{{ POOL_LABELS[i] }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div v-else-if="stage === 'reveal'" class="reveal">
      <h3>{{ wasHit ? 'First-place match' : 'No match' }}</h3>

      <ul class="judging-pool is-resolved">
        <li v-for="(site, i) in pool" :key="site.id">
          <figure
            class="judging-result"
            :class="{ 'is-target': site.id === targetSite.id, 'is-chosen': site.id === chosenSite.id }"
          >
            <img :src="imageFor(site)" :alt="site.name" />
            <figcaption>
              <span class="judging-letter">{{ POOL_LABELS[i] }}</span>
              <strong>{{ site.name }}</strong>
              <span v-if="site.id === targetSite.id" class="judging-tag is-target-tag">the target</span>
              <span v-if="site.id === chosenSite.id" class="judging-tag is-choice-tag">your choice</span>
            </figcaption>
          </figure>
        </li>
      </ul>

      <p class="target-description">{{ targetSite.description }}</p>

      <div class="accuracy-container">
        <h4>Analysis</h4>
        <p class="accuracy-notes">{{ verdict }}</p>
        <p class="session-note">{{ lifetimeLine }}</p>
      </div>

      <button @click="resetSession">Start New Session</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, defineProps } from 'vue';
import sites from '../../data/latLongSites';
import targetImages from '../../data/targetImages';
import failMsgs from '../../data/failureFeedback';
import WindowAnimation from '../animations/WindowAnimation.vue';

const props = defineProps(['scrollToElement'])

// State variables
const stage = ref('intro');
const coordinates = ref('');
const focusProgress = ref(0);
const statusMessage = ref('Beginning mental focusing...');
const canSubmit = ref(false);
const textualImpression = ref('');
// Impressions used to be uploaded on every reveal with nothing on screen to
// say so. Nothing leaves the browser now unless this is ticked.
const shareWithArchive = ref(false);
const userDrawingImage = ref('');
const targetSite = ref(null);
const chosenSite = ref(null);
const pool = ref([]);

/*
 * Rank-order judging, which is how the protocol is actually scored.
 *
 * The score here used to be getRandomInt(100) dressed as analysis -- the one
 * place in the Club where the statistics were not real. Everywhere else the
 * joke works because the arithmetic does: Precognition computes a genuine
 * z-score and will tell you when you are below chance.
 *
 * So the target is no longer revealed. It is hidden among three decoys from
 * the same register and you pick the one your own impression matches, blind.
 * That is a real trial with a known chance rate -- one in four -- and it can
 * be counted honestly over a lifetime of sittings.
 */
const POOL_SIZE = 4;
const POOL_LABELS = ['A', 'B', 'C', 'D'];
const CHANCE = 1 / POOL_SIZE;
const LIFETIME_KEY = 'rvc-rv-lifetime';

const readLifetime = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LIFETIME_KEY));
    if (saved && Number.isFinite(saved.trials) && Number.isFinite(saved.hits)) return saved;
  } catch {
    // unreadable or hand-edited; start the record over
  }
  return { trials: 0, hits: 0 };
};

const lifetime = ref(readLifetime());

const imageFor = (site) => targetImages[site.image];
const wasHit = computed(() => !!chosenSite.value && chosenSite.value.id === targetSite.value.id);

const shuffle = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const verdict = computed(() => {
  if (!chosenSite.value) return '';
  if (wasHit.value) {
    return `Your impression was judged against four candidates and placed the target first. One sitting proves nothing on its own -- a viewer guessing lands this one time in four -- but it is recorded.`;
  }
  return `The target placed below your choice. ${getFailMsg()}`;
});

/*
 * The only number worth printing. A single trial at one-in-four says almost
 * nothing, so the honest reading is the run of them: what chance expects,
 * what you got, and how far apart those are in standard deviations.
 */
const lifetimeLine = computed(() => {
  const { trials, hits } = lifetime.value;
  if (!trials) return '';
  const expected = trials * CHANCE;
  const sd = Math.sqrt(trials * CHANCE * (1 - CHANCE));
  const z = sd ? (hits - expected) / sd : 0;
  const sittings = trials === 1 ? 'sitting' : 'sittings';
  return `${hits} first-place ${hits === 1 ? 'match' : 'matches'} in ${trials} ${sittings}. `
    + `Chance expects ${expected.toFixed(1)}. `
    + (trials < 8
      ? 'Too few sittings to say anything either way.'
      : `That is ${Math.abs(z).toFixed(2)} standard deviations ${z >= 0 ? 'above' : 'below'} chance.`);
});

// Canvas-related state
const canvas = ref(null);
const isDrawing = ref(false);
const ctx = ref(null);
const penColor = ref('#000000');
const penSize = ref(3);

const possibleTargets = sites;

// Methods
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const getFailMsg = () => {
  if (failMsgs.length) {
    return failMsgs[Math.floor(Math.random() * failMsgs.length)];
  }
}

const beginSession = () => {
  stage.value = 'coordinates';

  props.scrollToElement('.remote-viewing-container.stage.active');
  
  const target = possibleTargets[getRandomInt(possibleTargets.length)];
  coordinates.value = target.coordinates;
  targetSite.value = target;
  chosenSite.value = null;

  // Built now rather than at judging time, so the decoys cannot be chosen
  // with any knowledge of what was drawn.
  const decoys = shuffle(possibleTargets.filter((site) => site.id !== target.id))
    .slice(0, POOL_SIZE - 1);
  pool.value = shuffle([target, ...decoys]);
  
  // Start the "focusing" process
  const interval = setInterval(() => {
    if (focusProgress.value < 100) {
      focusProgress.value += 1;
      
      if (focusProgress.value === 25) {
        statusMessage.value = 'Initial impressions forming...';
      } else if (focusProgress.value === 50) {
        statusMessage.value = 'Mental connection strengthening...';
      } else if (focusProgress.value === 75) {
        statusMessage.value = 'Target signature detected...';
      } else if (focusProgress.value === 100) {
        statusMessage.value = 'Connection established!';
        canSubmit.value = true;
      }
    } else {
      clearInterval(interval);
    }
  }, 200);
};

const submitImpression = () => {
  stage.value = 'drawing';
  // Initialize the canvas in the next tick when it's rendered
  setTimeout(() => {
    initCanvas();
  }, 0);
};

const initCanvas = () => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    ctx.value.fillStyle = '#ffffff';
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.value.lineJoin = 'round';
    ctx.value.lineCap = 'round';
  }
};

const startDrawing = (e) => {
  isDrawing.value = true;
  draw(e);
};

const draw = (e) => {
  if (!isDrawing.value || !ctx.value) return;
  
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ctx.value.strokeStyle = penColor.value;
  ctx.value.lineWidth = penSize.value;
  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  ctx.value.beginPath();
  ctx.value.moveTo(x, y);
};

const stopDrawing = () => {
  if (isDrawing.value && ctx.value) {
    ctx.value.beginPath();
    isDrawing.value = false;
  }
};

const clearCanvas = () => {
  if (ctx.value) {
    ctx.value.fillStyle = '#ffffff';
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  }
};

const submitForJudging = () => {
  if (canvas.value) {
    userDrawingImage.value = canvas.value.toDataURL('image/png');
  }

  stage.value = 'judging';
  props.scrollToElement('.remote-viewing-container.stage.active');
};

const judge = (site) => {
  if (chosenSite.value) return;
  chosenSite.value = site;

  lifetime.value = {
    trials: lifetime.value.trials + 1,
    hits: lifetime.value.hits + (site.id === targetSite.value.id ? 1 : 0)
  };
  try {
    localStorage.setItem(LIFETIME_KEY, JSON.stringify(lifetime.value));
  } catch {
    // private window; the record simply does not carry over
  }

  if (shareWithArchive.value) {
    submitData();
  }

  stage.value = 'reveal';
  props.scrollToElement('.remote-viewing-container.stage.active');
};

const resetSession = () => {
  // Reset all state variables
  stage.value = 'intro';
  coordinates.value = '';
  focusProgress.value = 0;
  statusMessage.value = 'Beginning mental focusing...';
  canSubmit.value = false;
  textualImpression.value = '';
  shareWithArchive.value = false;
  userDrawingImage.value = '';
  isDrawing.value = false;
  ctx.value = null;
  targetSite.value = null;
  chosenSite.value = null;
  pool.value = [];
};

const submitData = () => {
  // Get form data
  const formData = {
    coordinates: coordinates.value,
    illustration: userDrawingImage.value,
    description: textualImpression.value,
    accuracyNotes: verdict.value,
    actualTarget: targetSite.value.name,
    // was: accuracyScore, a random number. A judgement is the thing worth
    // filing, so the sheet gets which candidate was picked and whether it
    // was the right one.
    chosenTarget: chosenSite.value.name,
    firstPlaceMatch: wasHit.value
  };

  // Create a hidden iframe approach (CORS bypass for Google Scripts)
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://script.google.com/macros/s/AKfycbwSRoSXOVHURDBw2hXGYZJsYW6aucSCP1nWpWe0d0naSRwotRoqQ0rzsOPraBrBTIS-/exec';
  form.target = 'hidden-iframe';
  form.style.display = 'none';
  
  // Add a hidden input with the stringified JSON
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = JSON.stringify(formData);
  form.appendChild(input);
  
  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.name = 'hidden-iframe';
  iframe.style.display = 'none';
  
  // Add success/error handlers
  iframe.onload = function() {    
    // Clean up
    setTimeout(function() {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 500);
  };
  
  // Add elements to DOM and submit
  document.body.appendChild(iframe);
  document.body.appendChild(form);
  form.submit();
}

// Watch for changes to pen properties
watch(penColor, () => {
  if (ctx.value) {
    ctx.value.strokeStyle = penColor.value;
  }
});

watch(penSize, () => {
  if (ctx.value) {
    ctx.value.lineWidth = penSize.value;
  }
});
</script>

<style>
/* --- judging ----------------------------------------------------------- */

.remote-viewing-container .judging-brief {
  max-width: 56ch;
}

/* The impression sits above the lineup rather than beside it: it is the
   thing being held against all four, not a fifth candidate. */
.remote-viewing-container .judging-impression {
  margin: 1.5rem auto;
  max-width: 24rem;
}

.remote-viewing-container .judging-impression img {
  display: block;
  width: 100%;
  border: 1px solid var(--gilt-dim);
  background: var(--parchment);
}

.remote-viewing-container .judging-impression figcaption {
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-style: italic;
  font-size: var(--text-sm);
  color: var(--parchment);
}

.remote-viewing-container .judging-pool {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
  gap: 1rem;
  max-width: 62rem;
  margin: 1.5rem auto 0;
  padding: 0;
  list-style: none;
}

.remote-viewing-container .judging-choice {
  all: unset;
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  border: 2px solid var(--gilt-dim);
  transition: border-color var(--dur-quick) var(--ease-out), transform var(--dur-quick) var(--ease-out);
}

.remote-viewing-container .judging-choice:hover,
.remote-viewing-container .judging-choice:focus-visible {
  border-color: var(--gilt-bright);
  transform: translateY(-3px);
}

.remote-viewing-container .judging-choice img,
.remote-viewing-container .judging-result img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.remote-viewing-container .judging-letter {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.15rem 0.5rem;
  background: rgba(10, 8, 6, 0.86);
  border-right: 1px solid var(--gilt-dim);
  border-bottom: 1px solid var(--gilt-dim);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wider);
  color: var(--gilt);
}

/* --- the lineup, resolved --------------------------------------------- */

.remote-viewing-container .judging-result {
  position: relative;
  margin: 0;
  border: 2px solid transparent;
  opacity: 0.55;
  transition: opacity var(--dur-base) var(--ease-out);
}

.remote-viewing-container .judging-result.is-target,
.remote-viewing-container .judging-result.is-chosen {
  opacity: 1;
}

/* The target is the gold one. A choice that was not the target is marked in
   oxblood, and a choice that was gets both -- which is the whole point of
   putting them on the same plate. */
.remote-viewing-container .judging-result.is-chosen {
  border-color: var(--oxblood);
}

.remote-viewing-container .judging-result.is-target {
  border-color: var(--gilt-bright);
}

.remote-viewing-container .judging-result figcaption {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.4rem;
  font-size: var(--text-sm);
  color: var(--parchment);
}

.remote-viewing-container .judging-result .judging-letter {
  position: static;
  border: 0;
  background: none;
  padding: 0;
}

.remote-viewing-container .judging-tag {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
}

/* Both land on the same plate when the choice was right, so they have to be
   told apart at a glance -- and separated, or they read as one phrase. */
.remote-viewing-container .judging-tag.is-target-tag {
  color: var(--gilt-bright);
}

.remote-viewing-container .judging-tag.is-choice-tag {
  color: var(--cinnabar);
}

.remote-viewing-container .judging-tag + .judging-tag::before {
  content: "·";
  margin-right: 0.4rem;
  color: var(--gilt-dim);
}

.remote-viewing-container {
  margin: 0 auto;
}

.remote-viewing-container .stage h2, 
.remote-viewing-container .stage h3, 
.remote-viewing-container .stage h4 {
  /* color: #2c3e50; */
  margin-top: 0;
}


.remote-viewing-container .coordinate-display {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  padding: 15px;
  background-color: #000000;
  color: #fff;
  border-radius: 4px;
  margin: 15px 0;
  text-align: center;
  letter-spacing: 1px;
}

.remote-viewing-container .progress-bar {
  height: 10px;
  background-color: var(--leather-raised);
  border-radius: 5px;
  overflow: hidden;
  margin: 20px 0;
}

.remote-viewing-container .progress-bar .progress {
  height: 100%;
  background-color: var(--cinnabar);
  transition: width 0.3s ease;
}

.remote-viewing-container .status-text {
  text-align: center;
  font-style: italic;
  margin-bottom: 20px;
  min-height: 24px;
  color: yellow;
}

.remote-viewing-container .canvas-container {
  margin: 20px 0;
}

.remote-viewing-container .canvas-container canvas {
  border: 1px solid var(--gilt-dim);
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: crosshair;
  display: block;
  margin: 0 auto;
}

.remote-viewing-container .canvas-container .canvas-tools {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 10px;
  align-items: center;
}


.remote-viewing-container .canvas-container .canvas-tools .color-picker {
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
}

.remote-viewing-container .canvas-container .canvas-tools .pen-size {
  width: 100px;
}

.remote-viewing-container .archive-opt-in {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto 1rem auto;
  color: #fff;
  font-family: var(--font-ui);
  font-size: var(--text-base);
  cursor: pointer;
}

/* the global `input` rule pads text fields; a checkbox wants none of it */
.remote-viewing-container .archive-opt-in input {
  padding: 0;
  width: 18px;
  height: 18px;
  accent-color: var(--btn-accent);
  cursor: pointer;
}

.remote-viewing-container .impression-textarea {
  width: 90%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid var(--gilt-dim);
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  margin: 0 auto 20px auto;
}

.remote-viewing-container .results-container {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

@media (max-width: 600px) {
  .remote-viewing-container .results-container {
    flex-direction: column;
  }
}

.remote-viewing-container .results-container .user-impression,
.remote-viewing-container .results-container .actual-target {
  flex: 1;
  background-color: var(--leather-deep);
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.remote-viewing-container .results-container .user-impression h4,
.remote-viewing-container .results-container .actual-target h4 {
  text-align: center;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.remote-viewing-container .results-container .impression-image,
.remote-viewing-container .results-container .target-image {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 10px;
  min-height: 140px;
}

.actual-target h5 {
  font-size: var(--text-md);
  margin: 0 0 10px 0;
}

.remote-viewing-container .accuracy-container {
  background-color: var(--leather-deep);
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.remote-viewing-container .accuracy-container h4 {
  margin-top: 0;
}

.remote-viewing-container .accuracy-container .accuracy-score {
  font-size: 180%;
  margin: 10px 0;
}

.remote-viewing-container .accuracy-container .accuracy-score .score {
  font-weight: bold;
  color: var(--parchment);
}

.remote-viewing-container .accuracy-container .accuracy-notes {
  font-style: italic;
}

.intro {
  background: rgba(0,0,0,0.6);
  padding: 10px 0.5rem;
  border-bottom: 3px solid var(--oxblood);
}

.rv-icon {
  max-width: 50%;
  margin: 0 auto;
}

.anim {

}

.window-anim-stage {
  max-width: 300px;
  margin: 0 auto;
  padding-bottom: 1rem;
}
</style>