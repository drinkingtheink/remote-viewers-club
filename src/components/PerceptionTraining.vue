<template>
  <div class="remote-viewers-container">
    <h1 class="main-title">Remote Viewers Club</h1>
    
    <div v-if="currentChallenge === 'pattern-recognition'" class="challenge-section">
      <h2 class="challenge-title">Pattern Recognition Challenge</h2>
      <div class="pattern-grid">
        <div 
          v-for="(card, index) in recognitionCards" 
          :key="index"
          @click="selectCard(index)"
          class="pattern-card"
          :class="{
            'selected': selectedCards.includes(index),
            'revealed': !card.hidden
          }"
        >
          {{ card.hidden ? '?' : card.value }}
        </div>
      </div>
      <button 
        @click="checkPattern" 
        class="check-pattern-btn"
      >
        Check Pattern
      </button>
      <p class="attempts-counter">Attempts: {{ attempts }}</p>
    </div>

    <div v-if="currentChallenge === 'random-prediction'" class="challenge-section">
      <h2 class="challenge-title">Random Prediction Challenge</h2>
      <div class="prediction-grid">
        <button 
          v-for="(color, index) in predictionColors" 
          :key="index"
          @click="makePrediction(color)"
          class="prediction-button"
          :style="{ backgroundColor: color }"
        >
          {{ color }}
        </button>
      </div>
      <div v-if="predictionResult" class="prediction-result">
        <p>Your Prediction: {{ userPrediction }}</p>
        <p>Actual Result: {{ actualColor }}</p>
        <p>Result: {{ predictionResult }}</p>
      </div>
    </div>

    <div class="challenge-selector">
      <button 
        @click="switchChallenge('pattern-recognition')"
        class="challenge-switch-btn pattern-btn"
      >
        Pattern Recognition
      </button>
      <button 
        @click="switchChallenge('random-prediction')"
        class="challenge-switch-btn prediction-btn"
      >
        Random Prediction
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Pattern Recognition Challenge
const recognitionCards = ref(
  Array.from({ length: 16 }, () => ({
    value: Math.floor(Math.random() * 10),
    hidden: true
  }))
)
const selectedCards = ref([])
const attempts = ref(0)

const selectCard = (index) => {
  if (!selectedCards.value.includes(index)) {
    selectedCards.value.push(index)
  }
}

const checkPattern = () => {
  attempts.value++
  const pattern = recognitionCards.value
    .map((card, index) => selectedCards.value.includes(index) ? card.value : null)
    .filter(val => val !== null)

  // Simple pattern detection logic
  const isUniquePattern = new Set(pattern).size === pattern.length
  
  if (isUniquePattern) {
    recognitionCards.value.forEach((card) => {
      card.hidden = false
    })
    alert('Interesting pattern detected!')
  } else {
    alert('Try again. Look for unique connections.')
  }

  selectedCards.value = []
}

// Random Prediction Challenge
const predictionColors = ['red', 'blue', 'green']
const userPrediction = ref(null)
const actualColor = ref(null)
const predictionResult = ref(null)

const makePrediction = (color) => {
  userPrediction.value = color
  actualColor.value = predictionColors[Math.floor(Math.random() * predictionColors.length)]
  
  predictionResult.value = userPrediction.value === actualColor.value 
    ? 'Correct Prediction! 🔮' 
    : 'Close, but not quite...'
}

// Challenge Switching
const currentChallenge = ref('pattern-recognition')

const switchChallenge = (challenge) => {
  currentChallenge.value = challenge
  // Reset states when switching
  selectedCards.value = []
  attempts.value = 0
  predictionResult.value = null
}
</script>

<style>
.remote-viewers-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: Arial, sans-serif;
  text-align: center;
}

.main-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.challenge-section {
  background-color: #f4f4f4;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.challenge-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.pattern-card {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pattern-card:hover {
  background-color: #2980b9;
}

.pattern-card.selected {
  background-color: #2ecc71;
}

.pattern-card.revealed {
  background-color: #2c3e50;
}

.check-pattern-btn {
  background-color: #9b59b6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.check-pattern-btn:hover {
  background-color: #8e44ad;
}

.attempts-counter {
  margin-top: 0.5rem;
  color: #7f8c8d;
}

.prediction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.prediction-button {
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
  text-transform: capitalize;
}

.prediction-result {
  margin-top: 1rem;
  background-color: #ecf0f1;
  padding: 1rem;
  border-radius: 6px;
}

.challenge-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.challenge-switch-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.pattern-btn {
  background-color: #9b59b6;
}

.pattern-btn:hover {
  background-color: #8e44ad;
}

.prediction-btn {
  background-color: #1abc9c;
}

.prediction-btn:hover {
  background-color: #16a085;
}
</style>