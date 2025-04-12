<template>
  <div class="dowsing-simulator stage"
    :class="{ 
        'active': gameStarted
        }"
    >
    <h2>Dowsing Session</h2>
    
    <!-- Start screen -->
    <section class="dowsing-simulator-container">
        <div v-if="!gameStarted" class="start-screen">
            <div class="start-content">
                <p class="panel-subheader">Find hidden water, minerals, or objects using your intuition.</p>
                
                <!-- <div class="setup-options">
                <div class="difficulty-selector">
                    <label>Choose Difficulty: </label>
                    <select v-model="difficulty">
                    <option value="easy">Easy (3 sources)</option>
                    <option value="medium">Medium (2 sources)</option>
                    <option value="hard">Hard (1 source)</option>
                    </select>
                </div>
                
                <div class="source-selector">
                    <label>What are you searching for? </label>
                    <select v-model="sourceType">
                    <option value="water">Water Sources</option>
                    <option value="mineral">Mineral Deposits</option>
                    <option value="energy">Energy Points</option>
                    </select>
                </div>
                </div> -->
                
                <button @click="startGame" class="start-btn begin-session">Begin Session</button>
            </div>
        </div>
        
        <!-- Game screen -->
        <div v-else>
            <div class="instructions">
                <h3>How to Dowse:</h3>
                <p>1. Focus your intuition on the grid</p>
                <p>2. Move your cursor slowly across the grid, paying attention to the sensitivity meter</p>
                <p>3. Click on cells where you sense hidden sources</p>
                <p>4. Try to find all sources with as few attempts as possible</p>
            </div>
            <div class="controls">
                <div class="difficulty-selector">
                <label>Difficulty: </label>
                <select v-model="difficulty" @change="resetGame" class="diff-selector">
                    <option value="easy">Easy (3 sources)</option>
                    <option value="medium">Medium (2 sources)</option>
                    <option value="hard">Hard (1 source)</option>
                </select>
                </div>
                
                <div class="stats">
                <p>Attempts: {{ attempts }}</p>
                <p>Hits: {{ hits }}</p>
                <p>Score: {{ score }}</p>
                </div>
                
                <button @click="resetGame" class="reset-btn">New Game</button>
            </div>

            <div class="proximity-meter">
                <div class="meter-label">Dowsing Rod Sensitivity:</div>
                <div class="meter">
                <div class="meter-fill" :style="{ width: `${proximity}%` }"></div>
                </div>
            </div>
            
            <div class="game-status" :class="{ 'success': foundAllSources }">
                <span v-if="foundAllSources">Success! You found all hidden {{ sourceType }} sources!</span>
                <span v-else>Find the {{ sourceType }} sources hidden in the grid.</span>
            </div>
            
            <div class="grid-container" :class="{ 'disabled': foundAllSources }">
                <div class="grid" 
                    :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }">
                <div v-for="(cell, index) in grid" 
                    :key="index" 
                    class="grid-cell"
                    :class="{ 
                        'revealed': cell.revealed, 
                        'hit': cell.revealed && cell.hasSource,
                        'miss': cell.revealed && !cell.hasSource,
                        'warm': getWarmthClass(index).includes('warm'),
                        'warmer': getWarmthClass(index).includes('warmer'),
                        'hot': getWarmthClass(index).includes('hot')
                    }"
                    @click="checkCell(index)"
                    @mouseover="updateProximity(index)">
                    <div v-if="cell.revealed && cell.hasSource" class="source-icon">
                    <span v-if="sourceType === 'water'">💧</span>
                    <span v-else-if="sourceType === 'mineral'">💎</span>
                    <span v-else>✨</span>
                    </div>
                    <div v-else-if="cell.revealed && !cell.hasSource" class="miss-icon">✘</div>
                </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Grid configuration
const gridSize = 10;
const totalCells = computed(() => gridSize * gridSize);
const grid = ref([]);

// Game settings
const sourceType = ref('water');
const difficulty = ref('medium');
const sourcesCount = computed(() => {
  switch(difficulty.value) {
    case 'easy': return 3;
    case 'medium': return 2;
    case 'hard': return 1;
    default: return 2;
  }
});

// Game state
const gameStarted = ref(false);
const attempts = ref(0);
const hits = ref(0);
const score = ref(0);
const proximity = ref(0);
const foundAllSources = computed(() => hits.value === sourcesCount.value);

// Initialize grid
const initializeGrid = () => {
  grid.value = Array(totalCells.value).fill().map(() => ({
    hasSource: false,
    revealed: false
  }));
  
  // Place sources randomly
  let placedSources = 0;
  while (placedSources < sourcesCount.value) {
    const randomIndex = Math.floor(Math.random() * totalCells.value);
    if (!grid.value[randomIndex].hasSource) {
      grid.value[randomIndex].hasSource = true;
      placedSources++;
    }
  }
};

// Get cell coordinates
const getCellCoordinates = (index) => {
  return {
    x: index % gridSize,
    y: Math.floor(index / gridSize)
  };
};

// Calculate distance between cells
const getDistance = (index1, index2) => {
  const pos1 = getCellCoordinates(index1);
  const pos2 = getCellCoordinates(index2);
  
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.y - pos2.y, 2)
  );
};

// Find closest source
const findClosestSource = (index) => {
  let closestDistance = Infinity;
  
  for (let i = 0; i < totalCells.value; i++) {
    if (grid.value[i].hasSource) {
      const distance = getDistance(index, i);
      if (distance < closestDistance) {
        closestDistance = distance;
      }
    }
  }
  
  return closestDistance;
};

// Update proximity based on closeness to sources
const updateProximity = (index) => {
  const closestDistance = findClosestSource(index);
  const maxDistance = Math.sqrt(2 * Math.pow(gridSize, 2));
  
  // Convert to a percentage (closer = higher percentage)
  proximity.value = Math.max(0, 100 - (closestDistance / maxDistance * 100));
};

// Get warmth class based on proximity to sources
const getWarmthClass = (index) => {
  const closestDistance = findClosestSource(index);
  
  if (closestDistance <= 1) return ['hot'];
  if (closestDistance <= 2) return ['warmer'];
  if (closestDistance <= 3) return ['warm'];
  return [];
};

// Check cell when clicked
const checkCell = (index) => {
  const cell = grid.value[index];
  
  // Skip if already revealed
  if (cell.revealed) return;
  
  // Reveal cell
  cell.revealed = true;
  attempts.value++;
  
  // Check if hit
  if (cell.hasSource) {
    hits.value++;
    
    // Calculate score based on attempts and hits
    const attemptsPerHit = attempts.value / hits.value;
    const efficiency = 1 / attemptsPerHit;
    const basePoints = 100 * difficulty.value === 'hard' ? 3 : (difficulty.value === 'medium' ? 2 : 1);
    score.value = Math.round(basePoints * sourcesCount.value * efficiency * 100);
  }
};

// Start the game
const startGame = () => {
  gameStarted.value = true;
  initializeGrid();
};

// Reset game
const resetGame = () => {
  attempts.value = 0;
  hits.value = 0;
  score.value = 0;
  proximity.value = 0;
  initializeGrid();
};

// Initialize on mount
onMounted(() => {
  // Don't initialize grid until game starts
  if (gameStarted.value) {
    initializeGrid();
  }
});

// Watch for difficulty changes
watch(difficulty, () => {
  if (gameStarted.value) {
    resetGame();
  }
});
</script>

<style scoped>
.dowsing-simulator-container {
    max-width: 800px;
    text-align: center;
    margin: 0 auto;
}
/* Start Screen Styles */
.start-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

.start-content {
  max-width: 600px;
}

.setup-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 25px 0;
  background-color: red;
  padding: 20px;
  border-radius: 8px;
}

.difficulty-selector, .source-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.difficulty-selector label, .source-selector label {
  font-weight: bold;
}

.difficulty-selector select, .source-selector select {
  width: 100%;
  padding: 10px;
  background-color: red;
  color: white;
}

.dowsing-rod-image {
  font-size: 60px;
  margin: 0 auto;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Game Screen Styles */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.grid-container {
  position: relative;
  margin: 20px auto 0 auto;
  max-width: 600px;
}

.grid {
  display: grid;
  gap: 4px;
  width: 100%;
  aspect-ratio: 1;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.grid-cell {
  background-color: #e0e0e0;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.grid-cell:hover {
  background-color: #d0d0d0;
}

.grid-cell.revealed {
  pointer-events: none;
}

.grid-cell.hit {
  background-color: #a5d6a7;
}

.grid-cell.miss {
  background-color: #ef9a9a;
}

.grid-cell.warm {
  border: 2px solid rgba(255, 235, 59, 0.3);
}

.grid-cell.warmer {
  border: 2px solid rgba(255, 152, 0, 0.5);
}

.grid-cell.hot {
  border: 2px solid rgba(244, 67, 54, 0.7);
}

.source-icon {
  font-size: 1.5em;
}

.miss-icon {
  color: #b71c1c;
  font-size: 1.2em;
}

.proximity-meter {
  margin: 20px 0;
}

.meter {
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 5px;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #81d4fa, #4fc3f7, #29b6f6, #039be5, #0288d1);
  transition: width 0.3s ease;
}

.game-status {
  background-color: black;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin: 10px 0;
}

.game-status.success {
  background-color: var(--success);
  color: white;
}

.grid-container.disabled {
  opacity: 0.8;
  pointer-events: none;
}

.instructions {
  background-color: black;
  padding: 15px;
  border-radius: 8px;
  font-size: 60%;
  margin-bottom: 10px;
}

.instructions h3 {
    margin-top: 0;
}

.instructions p {
    font-family: Arial, Helvetica, sans-serif;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .setup-options {
    gap: 10px;
  }
}
</style>