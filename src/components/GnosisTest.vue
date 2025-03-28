<!-- App.vue -->
<template>
  <div class="game-container stage">
    <h2>Gnosis Session</h2>
    
    <div v-if="!gameStarted" class="start-screen">
      <p>Test your knowledge of paranormal phenomena!</p>
      <button @click="startGame">Start Game</button>
    </div>
    
    <div v-else class="trivia-board">
      <div class="score-section">
        <span>Score: {{ score }}</span>
        <span>Round: {{ currentRound }}/10</span>
      </div>
      
      <div class="question-section">
        <h2>Identify the Paranormal Keyword</h2>
        <p class="description">{{ currentQuestion.description }}</p>
      </div>
      
      <div class="answer-section">
        <input 
          v-model="userAnswer" 
          @keyup.enter="checkAnswer"
          placeholder="Type your answer" 
        />
        <button @click="checkAnswer">Submit</button>
      </div>
      
      <div v-if="feedback" class="feedback" :class="{
        'correct': isCorrect,
        'incorrect': !isCorrect
      }">
        {{ feedback }}
      </div>
      
      <div v-if="showDetails" class="details-section">
        <h3>{{ currentQuestion.keyword }}</h3>
        <p>{{ currentQuestion.explanation }}</p>
      </div>
      
      <div class="game-controls">
        <button 
          v-if="showDetails" 
          @click="nextQuestion"
        >
          Next Question
        </button>
      </div>
    </div>
    
    <div v-if="gameOver" class="game-over-screen">
      <h2>Game Over!</h2>
      <p>Final Score: {{ score }}/10</p>
      <button @click="resetGame">Play Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const paranormalQuestions = [
  {
    keyword: "Poltergeist",
    description: "A type of supernatural phenomenon characterized by noisy disturbances and objects moving seemingly by themselves.",
    explanation: "Derived from German words 'poltern' (to make noise) and 'geist' (ghost). Often associated with adolescent-centered hauntings and unexplained physical disturbances."
  },
  {
    keyword: "Cryptid",
    description: "A creature whose existence is unproven by scientific consensus, often part of local folklore or mythology.",
    explanation: "Examples include Bigfoot, Loch Ness Monster, and Chupacabra. These legendary animals are studied by cryptozoology, a pseudoscience focused on proving their existence."
  },
  {
    keyword: "Ectoplasm",
    description: "A supposed supernatural viscous substance said to exude from the body of a medium during a spiritualistic trance.",
    explanation: "Popularized in the early 20th century, ectoplasm was claimed to be physical evidence of spirit manifestation during séances."
  },
  {
    keyword: "Skinwalker",
    description: "A type of harmful witch in Navajo tradition with the ability to transform into, possess, or disguise themselves as animals.",
    explanation: "In Navajo culture, skinwalkers are shapeshifters associated with dark magic and considered taboo to discuss openly."
  },
  {
    keyword: "EVP",
    description: "An acronym standing for a specific type of paranormal audio recording technique.",
    explanation: "Electronic Voice Phenomenon (EVP) involves capturing unexplained voices or sounds on electronic recording devices, often believed to be communications from spirits."
  },
  {
    keyword: "Tulpa",
    description: "A concept from Tibetan mysticism describing a being created through spiritual or mental concentration.",
    explanation: "In theory, a tulpa is a sentient, independent thought-form that can be manifested through intense meditation and visualization."
  },
  {
    keyword: "Doppelganger",
    description: "A ghostly double of a living person, often considered an omen of bad luck or impending death.",
    explanation: "From German meaning 'double-walker', a doppelganger is a look-alike or double of a living person that is considered paranormal."
  },
  {
    keyword: "Banshee",
    description: "A female spirit in Irish folklore known for her haunting wail that signals an impending death in a family.",
    explanation: "In Celtic mythology, a banshee's mournful cry is a supernatural warning of an upcoming tragedy or loss of life."
  },
  {
    keyword: "Wendigo",
    description: "A cannibalistic creature from Algonquian-speaking First Nations folklore, associated with winter, coldness, and hunger.",
    explanation: "A mythological man-eating monster that symbolizes the desperation and taboo of cannibalism in Native American legends."
  },
  {
    keyword: "Zeitgeist",
    description: "While not strictly paranormal, this term relates to the spirit or mood of a particular period in history.",
    explanation: "From German, meaning 'spirit of the time'. Used to describe the intellectual and cultural climate of an era."
  }
]

const gameStarted = ref(false)
const gameOver = ref(false)
const currentRound = ref(0)
const score = ref(0)
const userAnswer = ref('')
const feedback = ref('')
const isCorrect = ref(false)
const showDetails = ref(false)

const currentQuestion = ref(null)

function startGame() {
  gameStarted.value = true
  currentRound.value = 1
  score.value = 0
  nextQuestion()
}

function nextQuestion() {
  if (currentRound.value >= 10) {
    gameOver.value = true
    return
  }
  
  currentQuestion.value = paranormalQuestions[currentRound.value - 1]
  userAnswer.value = ''
  feedback.value = ''
  showDetails.value = false
  currentRound.value++
}

function checkAnswer() {
  if (!userAnswer.value) return

  const normalizedUserAnswer = userAnswer.value.toLowerCase().trim()
  const normalizedCorrectAnswer = currentQuestion.value.keyword.toLowerCase().trim()

  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    feedback.value = 'Correct! Well done!'
    isCorrect.value = true
    score.value++
  } else {
    feedback.value = `Incorrect. The correct answer was "${currentQuestion.value.keyword}".`
    isCorrect.value = false
  }
  
  showDetails.value = true
}

function resetGame() {
  gameStarted.value = false
  gameOver.value = false
  currentRound.value = 0
  score.value = 0
}
</script>

<style>
.start-screen, .game-over-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #e94560;
}

.question-section {
  margin-bottom: 20px;
}

.description {
  font-style: italic;
  color: #c7c7c7;
}

.answer-section {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 2px solid #0f3460;
  background-color: #1a1a2e;
  color: #e0e0e0;
}

button {
  padding: 10px 15px;
  background-color: #0f3460;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #e94560;
}

.feedback {
  margin-bottom: 20px;
  font-weight: bold;
}

.feedback.correct {
  color: #00ff00;
}

.feedback.incorrect {
  color: #ff0000;
}

.details-section {
  background-color: #0f3460;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.details-section h3 {
  color: #e94560;
  margin-bottom: 10px;
}
</style>