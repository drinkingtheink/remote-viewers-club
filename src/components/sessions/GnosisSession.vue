<template>
  <div class="gnosis-container stage"
    :class="{ 
      'active': gameStarted || gameOver
    }"
  >
    <p class="session-form">RVC FORM 17-E</p>
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
          }">
          {{ choice }}
        </button>
      </div>

      <div class="score-section">
        <span>Score: {{ score }}</span>
        <span>Round: {{ currentRound }}/{{ roundsPerGame }}</span>
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
      <p>Final Score: {{ score }}/{{ roundsPerGame }}</p>
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

// One round per available question. The deck is a per-game copy so shuffling
// doesn't mutate the array exported by data/trivia.js.
const roundsPerGame = questions.length
const deck = ref([])

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

  deck.value = [...questions].sort(() => Math.random() - 0.5)
  
  gameStarted.value = true
  gameOver.value = false
  score.value = 0
  nextQuestion()
}

function nextQuestion() {
  currentRound.value++

  if (currentRound.value > roundsPerGame) {
    gameOver.value = true
    return
  } 
  
  currentQuestion.value = deck.value[currentRound.value - 1]
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
  background-color: var(--leather-deep);
  padding: 10px;
}

.question-section {
  margin-bottom: 20px;
}

.question-section h3 {
  margin-top: 1rem;
  padding-top: 1rem;
}

/*
 * The clue is the exercise, not supporting copy; it carries the panel.
 * Container-prefixed because this block is unscoped, so a bare .description
 * loses to the global `.stage p` on specificity -- the same convention
 * RemoteViewingSession already follows.
 */
.gnosis-container .description {
  font-style: italic;
  font-size: var(--text-lg);
  color: var(--parchment);
}

.choices-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.choices-section button {
  color: var(--parchment);
  background-color: var(--leather-deep);
}

.choices-section button.selected {
  background-color: var(--leather-raised);
  border: 4px solid var(--gilt-bright);
}

.choices-section button.correct {
  background-color: var(--success);
  color: var(--leather-deep);
}

.choices-section button.correct:hover {
  background-color: var(--success);
  color: var(--leather-deep);
}

/* cinnabar rather than the off-palette #e74c3c, and light type on top */
.choices-section button.incorrect,
.choices-section button.incorrect:hover {
  background-color: var(--cinnabar);
  color: var(--parchment);
}

.feedback-section {
  margin-top: 20px;
}

.feedback {
  margin-bottom: 15px;
  font-weight: bold;
  font-size: var(--text-lg);
}

.feedback.correct {
  color: var(--signal-right);
}

.feedback.incorrect {
  color: var(--signal-wrong);
}

.details-section {
  background: var(--leather-deep);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.details-section h3 {
  margin-bottom: 10px;
  margin-top: 0;
}

.next-btn {
  margin-bottom: 10px;
}
</style>