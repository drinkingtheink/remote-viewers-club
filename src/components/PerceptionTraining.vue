<template>
  <div class="card-game stage">
    <h2>Perception Training Session</h2>
    
    <div class="game-container">
      <transition name="fade">
        <div v-if="gameState === 'intro'" class="game-screen">
          <p>Try to guess which card is the chosen one.</p>
          <button @click="startGame" class="btn">Start Game</button>
        </div>
        
        <div v-else-if="gameState === 'playing'" class="game-screen">
          <div class="cards-container">
            <div 
              v-for="(card, index) in cards" 
              :key="index"
              class="card"
              :class="{ 'flipped': card.flipped }"
              @click="selectCard(index)"
            >
              <div class="card-inner">
                <div class="card-front">
                  <div class="card-symbol">{{ card.frontSymbol }}</div>
                </div>
                <div class="card-back">
                  <div class="card-symbol" :class="{ 'chosen': card.isChosen }">
                    {{ card.isChosen ? '★' : '✗' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="gameState === 'result'" class="game-screen">
          <p>{{ resultMessage }}</p>
          <button @click="resetGame" class="btn">Play Again</button>
        </div>
      </transition>
      
      <div class="stats">
        <p>Wins: {{ stats.wins }} | Attempts: {{ stats.attempts }}</p>
      </div>
      
      <!-- Start Over button (visible when not on intro screen) -->
      <div v-if="gameState !== 'intro'" class="start-over-container">
        <button @click="startOver" class="btn btn-secondary">Start Over</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// Game state
const gameState = ref('intro'); // 'intro', 'playing', 'result'
const chosenCardIndex = ref(0);
const cards = ref([]);
const stats = reactive({
  wins: 0,
  attempts: 0
});

// Array of symbols for card fronts
const cardSymbols = ['♠', '♥', '♣', '♦', '♤', '♡', '♧', '♢', '✪', '✿', '❁', '✾'];

// Computed message for result screen
const resultMessage = computed(() => {
  return stats.wins === stats.attempts 
    ? `Congratulations! You found the chosen card!` 
    : `Sorry! Try again next time!`;
});

// Initialize cards
function initializeCards() {
  // Get random symbols from the array
  const shuffledSymbols = [...cardSymbols].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  cards.value = [
    { isChosen: false, flipped: false, frontSymbol: shuffledSymbols[0] },
    { isChosen: false, flipped: false, frontSymbol: shuffledSymbols[1] },
    { isChosen: false, flipped: false, frontSymbol: shuffledSymbols[2] }
  ];
  
  // Randomly select the chosen card
  chosenCardIndex.value = Math.floor(Math.random() * 3);
  cards.value[chosenCardIndex.value].isChosen = true;
}

// Start a new game
function startGame() {
  initializeCards();
  gameState.value = 'playing';
}

// Handle card selection
function selectCard(index) {
  // Prevent selection if cards are already flipped
  if (cards.value.some(card => card.flipped)) return;
  
  stats.attempts++;
  
  // Flip all cards
  cards.value.forEach((card) => {
    card.flipped = true;
  });
  
  // Check if player won
  if (index === chosenCardIndex.value) {
    stats.wins++;
  }
  
  // Show result after a delay
  setTimeout(() => {
    gameState.value = 'result';
  }, 1500);
}

// Reset the game (continue playing)
function resetGame() {
  initializeCards();
  gameState.value = 'playing';
}

// Start over (completely reset game and stats)
function startOver() {
  stats.wins = 0;
  stats.attempts = 0;
  gameState.value = 'intro';
}
</script>

<style scoped>
.card-game {

}

h1 {
  margin-bottom: 20px;
}

.game-container {

}

.game-screen {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.card {
  width: 120px;
  height: 180px;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-front {
  background-color: #2c3e50;
  color: white;
}

.card-back {
  background-color: #ecf0f1;
  transform: rotateY(180deg);
}

.card-symbol {
  font-size: 48px;
  font-weight: bold;
}

.card-symbol.chosen {
  color: #f1c40f;
}

.btn {
  margin-top: 20px;
}

.btn:hover {

}

.btn-secondary {
  margin-top: 10px;
}

.stats {
  margin-top: 20px;
  font-weight: bold;
  color: #7f8c8d;
}

.start-over-container {
  margin-top: 10px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>