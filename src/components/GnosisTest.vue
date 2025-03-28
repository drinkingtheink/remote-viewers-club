<!-- App.vue -->
<template>
  <div class="game-container stage">
    <h2>Gnosis Session</h2>
    
    <div v-if="!gameStarted" class="start-screen">
      <p>Test your knowledge of paranormal phenomena!</p>
      <button @click="startGame">Start Game</button>
    </div>
    
    <div v-else-if="!gameOver" class="trivia-board">
      <div class="score-section">
        <span>Score: {{ score }}</span>
        <span>Round: {{ currentRound }}/10</span>
      </div>
      
      <div class="question-section">
        <h2>Identify the Paranormal Keyword</h2>
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
    </div>
    
    <div v-else class="game-over-screen">
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
    explanation: "Derived from German words 'poltern' (to make noise) and 'geist' (ghost). Often associated with adolescent-centered hauntings and unexplained physical disturbances.",
    choices: ["Poltergeist", "Banshee", "Cryptid", "Zeitgeist"]
  },
  {
    keyword: "Cryptid",
    description: "A creature whose existence is unproven by scientific consensus, often part of local folklore or mythology.",
    explanation: "Examples include Bigfoot, Loch Ness Monster, and Chupacabra. These legendary animals are studied by cryptozoology, a pseudoscience focused on proving their existence.",
    choices: ["Wendigo", "Cryptid", "Tulpa", "EVP"]
  },
  {
    keyword: "Ectoplasm",
    description: "A supposed supernatural viscous substance said to exude from the body of a medium during a spiritualistic trance.",
    explanation: "Popularized in the early 20th century, ectoplasm was claimed to be physical evidence of spirit manifestation during séances.",
    choices: ["Skinwalker", "Doppelganger", "Ectoplasm", "Zeitgeist"]
  },
  {
    keyword: "Skinwalker",
    description: "A type of harmful witch in Navajo tradition with the ability to transform into, possess, or disguise themselves as animals.",
    explanation: "In Navajo culture, skinwalkers are shapeshifters associated with dark magic and considered taboo to discuss openly.",
    choices: ["Banshee", "Skinwalker", "EVP", "Tulpa"]
  },
  {
    keyword: "EVP",
    description: "An acronym standing for a specific type of paranormal audio recording technique.",
    explanation: "Electronic Voice Phenomenon (EVP) involves capturing unexplained voices or sounds on electronic recording devices, often believed to be communications from spirits.",
    choices: ["Cryptid", "Doppelganger", "EVP", "Ectoplasm"]
  },
  {
    keyword: "Tulpa",
    description: "A concept from Tibetan mysticism describing a being created through spiritual or mental concentration.",
    explanation: "In theory, a tulpa is a sentient, independent thought-form that can be manifested through intense meditation and visualization.",
    choices: ["Poltergeist", "Tulpa", "Skinwalker", "Zeitgeist"]
  },
  {
    keyword: "Doppelganger",
    description: "A ghostly double of a living person, often considered an omen of bad luck or impending death.",
    explanation: "From German meaning 'double-walker', a doppelganger is a look-alike or double of a living person that is considered paranormal.",
    choices: ["Banshee", "Doppelganger", "Wendigo", "EVP"]
  },
  {
    keyword: "Banshee",
    description: "A female spirit in Irish folklore known for her haunting wail that signals an impending death in a family.",
    explanation: "In Celtic mythology, a banshee's mournful cry is a supernatural warning of an upcoming tragedy or loss of life.",
    choices: ["Ectoplasm", "Banshee", "Cryptid", "Tulpa"]
  },
  {
    keyword: "Wendigo",
    description: "A cannibalistic creature from Algonquian-speaking First Nations folklore, associated with winter, coldness, and hunger.",
    explanation: "A mythological man-eating monster that symbolizes the desperation and taboo of cannibalism in Native American legends.",
    choices: ["Skinwalker", "Zeitgeist", "Wendigo", "Doppelganger"]
  },
  {
    keyword: "Zeitgeist",
    description: "While not strictly paranormal, this term relates to the spirit or mood of a particular period in history.",
    explanation: "From German, meaning 'spirit of the time'. Used to describe the intellectual and cultural climate of an era.",
    choices: ["EVP", "Zeitgeist", "Poltergeist", "Banshee"]
  }
]

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
  // Shuffle the questions
  paranormalQuestions.sort(() => Math.random() - 0.5)
  
  gameStarted.value = true
  currentRound.value = 1
  score.value = 0
  nextQuestion()
}

function nextQuestion() {
  if (currentRound.value > 10) {
    gameOver.value = true
    return
  }
  
  currentQuestion.value = paranormalQuestions[currentRound.value - 1]
  userAnswer.value = ''
  feedback.value = ''
  showResults.value = false
  currentRound.value++
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

.choices-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.choices-section button.selected {
  background-color: #1a2b5a;
  border: 2px solid #e94560;
}

.choices-section button.correct {
  background-color: #2ecc71;
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
}

.feedback.correct {
  color: #2ecc71;
}

.feedback.incorrect {
  color: #e74c3c;
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

.next-btn {
  padding: 10px 20px;
  background-color: #0f3460;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.next-btn:hover {
  background-color: #e94560;
}
</style>