<template>
  <div class="card-game stage" :class="{ 'active': gameState !== 'intro' }">
    <h2>Precognition Session</h2>
    
    <p class="panel-subheader">Can you divine which card is chosen by the Hidden Oracle?</p>

    <div class="game-container">
      <transition name="fade">
        <div v-if="gameState === 'intro'" class="game-screen">

          <LotusAnimation class="lotus-anim-stage" />
          
          <button @click="startGame" class="btn begin-session">Begin Session</button>
        </div>
        
        <div v-else-if="gameState === 'playing'" class="game-screen">
          <svg id="moon-cycle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 648.23 153.1"><g id="moon-cycle"><path d="M382.93,61.49c.27,33.81-28.2,61.18-61.2,60.54-35.1-.68-60.72-27.31-60.56-61.48C261.31,26.86,287.64.25,322.6,0c32.13-.23,61.44,27.75,60.33,61.49Z"/><path d="M496.54,12.56c-23.44,12.64-37.37,31.25-37.12,58,.25,26.33,13.93,44.95,37.67,56.9-25.8,8.52-56.4-1.55-70.6-26.18-16.26-28.19-8.29-62.74,16.98-81.13,16.79-12.21,44.73-13.45,53.07-7.6Z"/><path d="M146.89,127.39c26-11.49,39.07-31.77,39.01-57.44-.06-25.47-12.85-45.77-37.37-56.76,2.86-5.49,28.8-5.27,40.87.33,31.9,14.8,44.96,48.08,33.51,77.98-12.31,32.12-44.88,44.99-76.02,35.89Z"/><path d="M595.76,32.14c-28.63,11.18-45.21,30.35-45.11,60.62.1,30.1,16.9,49.01,45.39,59.64-14.47,3.17-39.55-4.8-52.17-19.61-19.24-22.57-19.31-47.75-8.84-68.12,13.01-25.32,38.39-35.18,60.74-32.53Z"/><path d="M48.66,152.31c28.86-10.53,45.63-30.07,45.59-59.73-.03-29.76-16.34-49.69-44.54-59.96,14.32-3.91,38.58,4.09,52.6,20.98,18.24,21.99,17.4,54.42,2.27,74.72-14.39,19.31-40.03,27.14-55.92,24Z"/><path d="M0,92.47c14.67-2.37,22.48-10.83,24.99-25.26,2.3,14.59,10.34,22.71,24.86,25.11-14.29,2.84-22.49,10.75-24.81,25.33-2.63-14.22-10.23-22.87-25.04-25.18Z"/><path d="M598.8,91.73c13.9-1.83,22.44-9.56,24.56-24.35,2.64,14.14,10.36,22.58,24.87,24.95-14.24,2.94-22.45,10.89-23.91,25.49-3.06-6.12-4.78-12.67-8.89-16.9-4.07-4.18-10.56-6-16.63-9.2Z"/></g></svg>
          
          <div class="cards-container">
            <div 
              v-for="(card, index) in cards" 
              :key="index"
              class="card"
              :class="{ 'flipped': card.flipped }"
              @click="selectCard(index)"
              :style="{ animationDelay: `0.${index}` }"
            >
              <div class="card-inner">
                <div class="card-front">
                  <div class="card-symbol">{{ card.frontSymbol }}</div>
                </div>
                <div class="card-back" :class="{ 'chosen': card.isChosen }">
                  <div class="card-symbol" :class="{ 'chosen': card.isChosen }">
                    {{ card.isChosen ? '★' : '✗' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="gameState === 'result'" class="game-screen">
          <p>{{ getResultMessage() }}</p>
          <button @click="resetGame" class="btn">Play Again</button>
        </div>
      </transition>
      
      <div v-if="stats.attempts > 0" class="stats">
        <p>Wins: {{ stats.wins }} | Attempts: {{ stats.attempts }}</p>
      </div>
      
      <!-- Start Over button (visible when not on intro screen) -->
      <div v-if="gameState !== 'intro'" class="start-over-container">
        <button @click="startOver" class="btn secondary">Start Over</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps } from 'vue'
import failMsgs from '../../data/failureFeedback'
import LotusAnimation from '../animations/LotusAnimation.vue'

const props = defineProps(['scrollToElement'])

// Game state
const gameState = ref('intro'); // 'intro', 'playing', 'result'
const chosenCardIndex = ref(0);
const cards = ref([]);
const stats = reactive({
  wins: 0,
  attempts: 0
});
const correctCardChosen = ref(false);

// Array of symbols for card fronts
const cardSymbols = ['♠', '♥', '♣', '♦', '♤', '♡', '♧', '♢', '✪', '✿', '❁', '✾'];

const getResultMessage = () => {
  return correctCardChosen.value 
    ? `Congratulations! You found the chosen card!` 
    : getFailMsg();
};

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
  props.scrollToElement('.card-game.stage.active');
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
    correctCardChosen.value = true;
  }
  
  // Show result after a delay
  setTimeout(() => {
    gameState.value = 'result';
  }, 2500);
}

// Reset the game (continue playing)
function resetGame() {
  initializeCards();
  gameState.value = 'playing';
  correctCardChosen.value = false;
}

// Start over (completely reset game and stats)
function startOver() {
  stats.wins = 0;
  stats.attempts = 0;
  gameState.value = 'intro';
  correctCardChosen.value = false;
}

const getFailMsg = () => {
  if (failMsgs.length) {
    return failMsgs[Math.floor(Math.random() * failMsgs.length)];
  }
}
</script>

<style scoped>
.game-screen {
  min-height: 100px;
  transition: all 0.2s;
  margin-top: -20px;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

@keyframes openUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  width: 150px;
  height: 210px;
  perspective: 1000px;
  cursor: pointer;
  animation: openUp 0.5s forwards;
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
  color: white;
  border: 2px solid white;
  transition: all  0.2s;
  transform-origin: center;
  background-color: #6f1313;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='church-on-sunday' fill='%23ff0000' fill-opacity='0.75'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.card-front:hover {
  border: 5px solid white;
  background-color: #ff0000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='church-on-sunday' fill='%236f1313' fill-opacity='0.75'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  transform: scale(1.1);
  transition: all 0.2s;
}

.card-back {
  background-color: #ecf0f1;
  transform: rotateY(180deg);
  color: red;
}

.card-back.chosen {
  background-color: var(--success);
  transform: rotateY(180deg);
  color: red;
}

.card-symbol {
  font-size: 88px;
  font-weight: bold;
}

.card-symbol.chosen {
  color: white;
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
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.lotus-anim-stage {
  margin-top: -20px;
}


#moon-cycle {
  width: 200px;
  margin: 0 auto;
}

#moon-cycle path {
  fill: var(--the-yellow);
}
</style>