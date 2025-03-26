<template>
  <div class="remote-viewing-container">
    <div v-if="stage === 'intro'" class="stage panel">
      <h2>Remote Viewing Session</h2>
      <p>Focus your mind and prepare to connect with the target coordinates.</p>

      <!-- <RemoteViewingIcon class="rv-icon" /> -->

      <button @click="beginSession" class="btn-primary">Begin Session</button>
    </div>

    <div v-else-if="stage === 'coordinates'" class="stage coordinates">
      <h3>Target Coordinates</h3>
      <div class="coordinate-display">{{ coordinates }}</div>
      <p>Focus on these coordinates. Clear your mind and visualize what exists at this location.</p>
      <div class="progress-bar">
        <div :style="{ width: `${focusProgress}%` }" class="progress"></div>
      </div>

      <!-- <RemoteViewingIcon class="rv-icon" /> -->

      <p class="status-text">{{ statusMessage }}</p>
      <button @click="submitImpression" :disabled="!canSubmit" class="btn-primary">
        Submit Impression
      </button>
    </div>

    <div v-else-if="stage === 'drawing'" class="stage drawing">
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
          <button @click="clearCanvas" class="btn-tool">Clear</button>
          <input type="color" v-model="penColor" class="color-picker" />
          <input type="range" v-model="penSize" min="1" max="20" class="pen-size" />
        </div>
      </div>
      <textarea 
        v-model="textualImpression" 
        placeholder="Describe what you sensed..." 
        class="impression-textarea">
      </textarea>
      <button @click="revealTarget" class="btn-primary">Reveal Target</button>
    </div>

    <div v-else-if="stage === 'reveal'" class="stage reveal">
      <h3>Target Revealed</h3>
      <div class="results-container">
        <div class="user-impression">
          <h4>Your Impression</h4>
          <img :src="userDrawingImage" alt="Your drawing" class="impression-image" />
          <div class="impression-text">{{ textualImpression || "No description provided" }}</div>
        </div>
        <div class="actual-target">
          <h4>Actual Target</h4>
          <img v-if="targetImage.includes('angkor')" src="../assets/angkor-wat.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('antelope')" src="../assets/antelope-canyon.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('ayers')" src="../assets/ayers-rock.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('bamboo')" src="../assets/bamboo-grove.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('bioluminescent')" src="../assets/bioluminescent-bay.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('hole')" src="../assets/blue-hole.webp" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('namib')" src="../assets/namib-desert.webp" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('machu')" src="../assets/machu-picchu.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('everest')" src="../assets/mount-everest.webp" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('cappadocia')" src="../assets/cappadocia.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('ha-long')" src="../assets/ha-long-bay.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('lake')" src="../assets/lake-moraine.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('petra')" src="../assets/petra.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('salar')" src="../assets/salar-de-uyuni.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('santorini')" src="../assets/santorini.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('serengeti')" src="../assets/serengeti.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('taj')" src="../assets/taj-mahal.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('tromso')" src="../assets/tromso.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('venice')" src="../assets/venice.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('victoria')" src="../assets/victoria-falls.webp" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('zhangjiajie')" src="../assets/zhangjiajie.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('canyon')" src="../assets/grand-canyon.png" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('barrier')" src="../assets/great-barrier-reef.jpg" alt="Target" class="target-image" />
          <img v-if="targetImage.includes('easter')" src="../assets/easter-island.jpg" alt="Target" class="target-image" />
          <h5>{{ targetName }}</h5>
          <div class="target-description">{{ targetDescription }}</div>
        </div>
      </div>
      <div class="accuracy-container">
        <h4>Analysis</h4>
        <div class="accuracy-score">
          <span>Accuracy Score:</span> <span class="score">{{ accuracyScore }}%</span>
        </div>
        <p class="accuracy-notes">{{ accuracyNotes }}</p>
      </div>
      <button @click="resetSession" class="btn-primary">Start New Session</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
// import RemoteViewingIcon from './icons/RemoteViewingIcon';
import sites from '../data/latLongSites';
import failMsgs from '../data/failureFeedback';

// State variables
const stage = ref('intro');
const coordinates = ref('');
const focusProgress = ref(0);
const statusMessage = ref('Beginning mental focusing...');
const canSubmit = ref(false);
const textualImpression = ref('');
const userDrawingImage = ref('');
const targetImage = ref('');
const targetName = ref('');
const targetDescription = ref('');
const accuracyScore = ref(0);
const accuracyNotes = ref('');

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
  
  // This makes it seem random but actually selects based on something deterministic
  // like the current hour of the day or some other factor
  const targetIndex = getRandomInt(possibleTargets.length);
  const target = possibleTargets[targetIndex];
  coordinates.value = target.coordinates;
  targetImage.value = target.image;
  targetDescription.value = target.description;
  targetName.value = target.name;
  
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
  }, 2);
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

const revealTarget = () => {
  let noTextEntered = true;

  // Capture the canvas as an image
  if (canvas.value) {
    userDrawingImage.value = canvas.value.toDataURL('image/png');
  }
  
  // Calculate a seemingly objective score based on timing and user input
  // In reality, this could be determined by factors like:
  // - Length of time spent drawing
  // - Complexity of drawing
  // - Keywords in textual description that match target
  
  // const lengthFactor = Math.min(textualImpression.value.length / 50, 1);
//   const timeFactor = Math.min(focusProgress.value / 100, 1);
  
  // A pseudo-random but actually deterministic score
  // For demo purposes we'll make it always quite impressive
  let maxAccScore = 100;

  if (!!textualImpression.value && textualImpression.value !== '') {
    noTextEntered = false;
  } else {
    maxAccScore = maxAccScore - 30;
  }

  accuracyScore.value = getRandomInt(maxAccScore);
  
  // Generate analysis notes
  if (accuracyScore.value > 80) {
    accuracyNotes.value = 'Exceptional accuracy! Your impression captured key elements of the target with remarkable precision.';
  } else if (accuracyScore.value > 65) {
    accuracyNotes.value = 'Good accuracy. Several important aspects of the target were identified in your impression.';
  } else if (accuracyScore.value > 40) {
    accuracyNotes.value = getFailMsg();
  } else {
    accuracyNotes.value = getFailMsg();
  }

  if (noTextEntered) {
    accuracyNotes.value = accuracyNotes.value + ' At least try entering a description.';
  }
  
  stage.value = 'reveal';
};

const resetSession = () => {
  // Reset all state variables
  stage.value = 'intro';
  coordinates.value = '';
  focusProgress.value = 0;
  statusMessage.value = 'Beginning mental focusing...';
  canSubmit.value = false;
  textualImpression.value = '';
  userDrawingImage.value = '';
  isDrawing.value = false;
  ctx.value = null;
};

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
.remote-viewing-container {
  margin: 0 auto;
}

.remote-viewing-container .stage h2, 
.remote-viewing-container .stage h3, 
.remote-viewing-container .stage h4 {
  /* color: #2c3e50; */
  margin-top: 0;
}

.remote-viewing-container .btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.remote-viewing-container .coordinate-display {
  font-family: 'Courier New', monospace;
  font-size: 230%;
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
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin: 20px 0;
}

.remote-viewing-container .progress-bar .progress {
  height: 100%;
  background-color: red;
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
  border: 1px solid #ccc;
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

.remote-viewing-container .canvas-container .canvas-tools .btn-tool {
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
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

.remote-viewing-container .impression-textarea {
  width: 90%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
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
  background-color: black;
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
  font-size: 1.2rem;
  margin: 0 0 10px 0;
}

.remote-viewing-container .accuracy-container {
  background-color: black;
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
  color: white;
}

.remote-viewing-container .accuracy-container .accuracy-notes {
  font-style: italic;
}

.intro {
  background: rgba(0,0,0,0.6);
  padding: 10px 0.5rem;
  border-bottom: 3px solid red;
}

.rv-icon {
  max-width: 50%;
  margin: 0 auto;
}


</style>