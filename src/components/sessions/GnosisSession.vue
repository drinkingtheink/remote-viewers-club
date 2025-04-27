<template>
  <div class="gnosis-container stage"
    :class="{ 
      'active': gameStarted || gameOver
    }"
  >
    <h2>Gnosis Session</h2>
    
    <div v-if="!gameStarted" class="start-screen">
      <p class="panel-subheader">Test your knowledge of paranormal phenomena.</p>

      <BookAnimation />

      <button @click="startGame" class="begin-session">Begin Session</button>
    </div>
    
    <div v-else-if="!gameOver" class="trivia-board">
      <div class="question-section">
        <h3>Identify the Paranormal Keyword</h3>
        <p class="description">{{ currentQuestion.description }}</p>
      </div>
      
      <div class="choices-section">
        <button 
          v-for="(choice, index) in currentQuestion.choices" 
          :key="index"
          @click="selectAnswer(choice)"
          :class="{ 
            'selected': userAnswer === choice,
            'correct': showResults && choice === currentQuestion.keyword,
            'incorrect': showResults && userAnswer === choice && choice !== currentQuestion.keyword
          }"
        >
          {{ choice }}
        </button>
      </div>

      <div class="score-section">
        <span>Score: {{ score }}</span>
        <span>Round: {{ currentRound }}/20</span>
      </div>
      
      <div v-if="showResults" class="feedback-section">
        <div class="feedback" :class="{
          'correct': isCorrect,
          'incorrect': !isCorrect
        }">
          {{ feedback }}
        </div>
        
        <div class="details-section">
          <h3>{{ currentQuestion.keyword }}</h3>
          <p>{{ currentQuestion.explanation }}</p>
        </div>
        
        <button @click="nextQuestion" class="next-btn">
          Next Question
        </button>
      </div>

      <div class="header-section">
        <button @click="resetGame" class="new-game-btn secondary">New Game</button>
      </div>
    </div>
    
    <div v-else class="game-over-screen">
      <h2>Game Over!</h2>
      <p>Final Score: {{ score }}/20</p>
      <div class="game-over-buttons">
        <button @click="resetGame">New Game</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import BookAnimation from '../animations/BookAnimation.vue'
import questions from '../../data/trivia'

const props = defineProps(['scrollToElement'])

const paranormalQuestions = questions

const gameStarted = ref(false)
const gameOver = ref(false)
const currentRound = ref(0)
const score = ref(0)
const userAnswer = ref('')
const feedback = ref('')
const isCorrect = ref(false)
const showResults = ref(false)

const currentQuestion = ref(null)

function startGame() {
  props.scrollToElement('.gnosis-container.stage.active')

  // Shuffle the questions
  paranormalQuestions.sort(() => Math.random() - 0.5)
  
  gameStarted.value = true
  gameOver.value = false
  score.value = 0
  nextQuestion()
}

function nextQuestion() {
  currentRound.value++

  if (currentRound.value > 15) {
    gameOver.value = true
    return
  } 
  
  currentQuestion.value = paranormalQuestions[currentRound.value - 1]
  userAnswer.value = ''
  feedback.value = ''
  showResults.value = false
}

function selectAnswer(choice) {
  if (showResults.value) return
  
  userAnswer.value = choice
  
  if (choice === currentQuestion.value.keyword) {
    feedback.value = 'Correct! Well done!'
    isCorrect.value = true
    score.value++
  } else {
    feedback.value = `Incorrect. The correct answer was "${currentQuestion.value.keyword}".`
    isCorrect.value = false
  }
  
  showResults.value = true
}

function resetGame() {
  gameStarted.value = false
  gameOver.value = false
  currentRound.value = 0
  score.value = 0
  userAnswer.value = ''
  feedback.value = ''
  showResults.value = false
}
</script>

<style>
.start-screen, .game-over-screen {
  
}

.score-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: var(--the-yellow);
  background-color: black;
  padding: 10px;
}

.question-section {
  margin-bottom: 20px;
}

.question-section h3 {
  margin-top: 1rem;
  padding-top: 1rem;
}

.description {
  font-style: italic;
  color: #c7c7c7;
}

.choices-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.choices-section button {
  color: red;
  background-color: black;
}

.choices-section button.selected {
  background-color: #1a2b5a;
  border: 4px solid white;
}

.choices-section button.correct {
  background-color: #2ecc71;
  color: black;
}

.choices-section button.correct:hover {
  background-color: #2ecc71;
  color: black;
}

.choices-section button.incorrect {
  background-color: #e74c3c;
}

.feedback-section {
  margin-top: 20px;
}

.feedback {
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 1.4rem;
}

.feedback.correct {
  color: #2ecc71;
}

.feedback.incorrect {
  color: #e74c3c;
}

.details-section {
  background: black;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.details-section h3 {
  margin-bottom: 10px;
  margin-top: 0;
}

.next-btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
}

.next-btn:hover {
  background-color: #e94560;
}
</style>