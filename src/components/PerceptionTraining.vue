<template>
  <div class="prediction-container stage panel">
    <h2>Precognition Session</h2>
    <p>Can you devine the colors chosen by the oracle?</p>

    <div class="session-stats">
      <div class="stat-box">
        <span class="stat-label">Matches</span>
        <span class="stat-value matches">{{ sessionStats.matches }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Misses</span>
        <span class="stat-value misses">{{ sessionStats.misses }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Accuracy</span>
        <span class="stat-value accuracy">{{ accuracyPercentage }}%</span>
      </div>
    </div>
    
    <div class="prediction-grid">
      <button 
        v-for="(color, index) in predictionColors" 
        :key="index"
        @click="makePrediction(color)"
        :style="{ backgroundColor: color }"
        :disabled="predictionResult !== null"
      >
        <span class="color-mask">{{ color }}</span>
      </button>
    </div>

    <div v-if="predictionResult" class="prediction-result">
      <p>Your Prediction: <span class="value">{{ userPrediction }}</span> <span class="prediction-swatch" :style="{ backgroundColor: userPrediction }"></span></p>
      <p>Actual Result: <span class="value">{{ actualColor }}</span> <span class="prediction-swatch" :style="{ backgroundColor: actualColor }"></span></p>
      <p class="result-text" :class="{ 'correct': predictionResult.includes('Correct Prediction') }">{{ predictionResult }}</p>
      
      <button 
        @click="resetChallenge" 
        class="restart-btn"
      >
        Next Round
      </button>
    </div>

    <button 
      @click="resetSession" 
      class="reset-session-btn"
    >
      Reset Session
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const generateRandomColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
}

const predictionColors = ref([])
const userPrediction = ref(null)
const actualColor = ref(null)
const predictionResult = ref(null)
const sessionStats = ref({
  matches: 0,
  misses: 0
})
const sessionCount = ref(0)

const accuracyPercentage = computed(() => {
  const totalRounds = sessionStats.value.matches + sessionStats.value.misses
  return totalRounds > 0 
    ? Math.round((sessionStats.value.matches / totalRounds) * 100)
    : 0
})

const generateColorOptions = () => {
  // Generate 3 unique random colors
  const colors = new Set()
  while (colors.size < 3) {
    colors.add(generateRandomColor())
  }
  predictionColors.value = Array.from(colors)
}

const makePrediction = (color) => {
  userPrediction.value = color
  actualColor.value = predictionColors.value[Math.floor(Math.random() * predictionColors.value.length)]
  
  if (userPrediction.value === actualColor.value) {
    predictionResult.value = 'Correct Prediction! 🔮'
    sessionStats.value.matches++
    sessionCount.value++
  } else {
    predictionResult.value = 'Close, but not quite...'
    sessionStats.value.misses++
    sessionCount.value++
  }
}

const resetChallenge = () => {
  generateColorOptions()
  userPrediction.value = null
  actualColor.value = null
  predictionResult.value = null
}

const resetSession = () => {
  sessionStats.value = {
    matches: 0,
    misses: 0
  }
  resetChallenge()
}

// Generate initial color options when component mounts
onMounted(generateColorOptions)
</script>

<style>
.prediction-container {
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
  background: rgba(0,0,0,0.6);
}

.session-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-box {
  background-color: black;
  border-radius: 5px;
  padding: 10px;
  flex-grow: 1;
  margin: 0 5px;
}

.stat-label {
  display: block;
  font-size: 0.8em;
  color: #e2e2e2;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
}

.stat-value.matches {
  color: #4CAF50;
}

.stat-value.misses {
  color: #F44336;
}

.stat-value.accuracy {
  color: #2196F3;
}

.prediction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.prediction-grid button {
  color: white;
  border: none;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  text-transform: capitalize;
  transition: opacity 0.3s ease;
  border: 3px solid transparent;
  transition: all 0.3s;
}

.prediction-grid button span {
    background: rgba(0,0,0,0.6);
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
}

.prediction-grid button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prediction-result {
  background-color: black;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.prediction-result .value {
  color: yellow;
  font-family: Arial, Helvetica, sans-serif;
}

.prediction-result .prediction-swatch {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: inline-block;
  margin-left: 5px;
  border: 2px solid rgba(255,255,255,0.3);
}

.restart-btn, .reset-session-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.restart-btn:hover, .reset-session-btn:hover {
  background-color: rgb(121, 3, 3);
}

.reset-session-btn {
  background-color: #2196F3;
  margin-top: 20px;
}

.reset-session-btn:hover {
  background-color: #1976D2;
}

.result-text {
  color: yellow !important;
  font-size: 1.8rem !important;
  border-radius: 10px !important;
}

.result-text.correct {
  background-color: rgb(75, 189, 75) !important;
  color: white !important;
  padding: 1rem 0;
}
</style>