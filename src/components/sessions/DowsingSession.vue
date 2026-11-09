<template>
  <div class="dowsing-simulator stage"
    :class="{ 
        'active': gameStarted
        }"
    >
    <h2>Dowsing Session</h2>
    
    <!-- Start screen -->
    <section class="dowsing-simulator-container" @mouseover="(event) => updateProximity(event, false)"  >
        <div v-if="!gameStarted" class="start-screen">
            <div class="start-content">
                <p class="panel-subheader pull-bottom">Find hidden water , minerals, or objects using your intuition.</p>
                
                <!-- <button v-if="!showOptions" @click="showOptions = true" class="small">Options ></button>
                <button v-if="showOptions" @click="showOptions = false" class="small">Hide Options</button> -->
                
                <!-- <div class="setup-options" v-show="showOptions">
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

                <WandAnimation />

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
            
            <div class="grid-container" 
                :class="{ 'disabled': foundAllSources }"  
            >
                <div class="grid" 
                    :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }">
                    <div v-for="(cell, index) in grid" 
                        :key="index" 
                        class="grid-cell"
                        :class="{ 
                            'grass': cell.typog === 'grass',
                            'rock': cell.typog === 'rock',
                            'hasPlant': cell.typog === 'grass' && cell.hasPlant,
                            'revealed': cell.revealed, 
                            'hit': cell.revealed && cell.hasSource,
                            'miss': cell.revealed && !cell.hasSource,
                            'warm': cell.warmth === 'warm',
                            'warmer': cell.warmth === 'warmer',
                            'hot': cell.warmth === 'hot',
                            'hasSecretButton': cell.hasSecretButton,
                        }"
                        :style="{
                            '--bush-tint': cell.plantTint,
                            '--bush-turn': cell.plantTurn,
                            '--grain-x': cell.grainX,
                            '--grain-y': cell.grainY,
                        }"
                        @click="checkCell(index)"
                        @mouseenter="(event) => updateProximity(event, index)"
                    >
                        <div v-if="cell.revealed && cell.hasSource" class="source-icon">
                            <span v-if="sourceType === 'water'">💧</span>
                            <span v-else-if="sourceType === 'mineral'">💎</span>
                            <span v-else>✨</span>
                        </div>
                        <div v-else-if="cell.revealed && !cell.hasSource" class="miss-icon">✘</div>
                        <!-- masked rather than an <img>, so the scrub can be
                             coloured to the terrain instead of arriving black -->
                        <span
                            v-if="cell.hasPlant && cell.typog === 'grass' && !cell.revealed"
                            class="cell-bush"
                            aria-hidden="true"
                        ></span>

                        <button v-if="cell.hasSecretButton" class="secret-button" @click.stop="revealSecret"> * </button>
                    </div>
                </div>
            </div>
            <button @click="gameStarted = false" class="close-btn secondary">Close Session</button>
        </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps } from 'vue';
import WandAnimation from '../animations/WandAnimation.vue'

const props = defineProps(['scrollToElement'])

// Grid configuration
const gridSize = 10;
const totalCells = computed(() => gridSize * gridSize);
const grid = ref([]);

// Game settings
// const showOptions = ref(false);
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
    revealed: false,
    typog: getTypogClass(),
    hasPlant: getPlantPresence(),
    // so neighbouring scrub is never quite the same plant
    plantTint: Math.floor(Math.random() * 34) - 17,
    plantTurn: Math.floor(Math.random() * 20) - 10,
    // each cell paints its own background from its own origin, so without a
    // per-cell offset every square shows an identical arrangement of tufts
    grainX: Math.floor(Math.random() * 52),
    grainY: Math.floor(Math.random() * 52),
    hasSecretButton: false,
    warmth: null,
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

  // Warmth depends only on where the sources landed, so resolve it once here.
  grid.value.forEach((cell, index) => {
    cell.warmth = getWarmth(index);
  });

  // Exactly one easter egg per game.
  grid.value[Math.floor(Math.random() * totalCells.value)].hasSecretButton = true;
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
const updateProximity = (event, index) => {
    if (!gameStarted.value) return

    if (index === false) { proximity.value = 0 }
    else {
        const closestDistance = findClosestSource(index);
        const maxDistance = Math.sqrt(2 * Math.pow(gridSize, 2));
        
        // Convert to a percentage (closer = higher percentage)
        proximity.value = Math.max(0, 100 - (closestDistance / maxDistance * 100));
    }
};

// Warmth band for a cell, by distance to the nearest source.
const getWarmth = (index) => {
  const closestDistance = findClosestSource(index);

  if (closestDistance <= 1) return 'hot';
  if (closestDistance <= 2) return 'warmer';
  if (closestDistance <= 3) return 'warm';
  return null;
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
    const difficultyMultiplier = difficulty.value === 'hard' ? 3 : (difficulty.value === 'medium' ? 2 : 1);
    score.value = Math.round(100 * difficultyMultiplier * sourcesCount.value * efficiency);
  }
};

// Start the game
const startGame = () => {
  props.scrollToElement('.dowsing-simulator.stage.active')
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

const getTypogClass = () => {
    const classes = ['grass', 'rock', 'grass', 'grass'];
    return classes[Math.floor(Math.random() * classes.length)];
};

const getPlantPresence = () => {
    return Math.random() < 0.3;
}

const revealSecret = () => {
    console.log('Arthur and Graham are kewl!!!');
}

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
  background-color: var(--leather-deep);
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
  background-color: var(--oxblood);
  color: var(--parchment);
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

/*
 * The board is a survey plate, not a tile map. The gap lets the dark board
 * show between cells as ruled lines, which is what makes it read as a
 * surveyed grid rather than a field of squares.
 */
.grid {
  display: grid;
  gap: 1px;
  width: 100%;
  aspect-ratio: 1;
  padding: 1px;
  background-color: rgba(138, 111, 46, 0.45);
  border: 1px solid var(--gilt-dim);
  border-radius: 4px;
  overflow: hidden;
}

.grid-cell {
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color var(--dur-base) var(--ease-out), border-color var(--dur-quick) var(--ease-out);
  /* border-radius: 4px; */
  position: relative;
}

.grid-cell.grass {
    background-color: #2c3a28;
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'><g fill='none' stroke='%236d8a5f' stroke-opacity='.42' stroke-width='1.1' stroke-linecap='round'><path d='M7 9 l-2.6 -5.4 M7 9 l0 -6.2 M7 9 l2.6 -5.4'/><path d='M26 20 l-2.6 -5.4 M26 20 l0 -6.2 M26 20 l2.6 -5.4'/><path d='M14 31 l-2.6 -5.4 M14 31 l0 -6.2 M14 31 l2.6 -5.4'/><path d='M33 38 l-2.6 -5.4 M33 38 l0 -6.2 M33 38 l2.6 -5.4'/><path d='M4 24 l-2.6 -5.4 M4 24 l0 -6.2 M4 24 l2.6 -5.4'/><path d='M22 5 l-2.6 -5.4 M22 5 l0 -6.2 M22 5 l2.6 -5.4'/><path d='M36 13 l-2.6 -5.4 M36 13 l0 -6.2 M36 13 l2.6 -5.4'/><path d='M18 44 l-2.6 -5.4 M18 44 l0 -6.2 M18 44 l2.6 -5.4'/><path d='M41 30 l-2.6 -5.4 M41 30 l0 -6.2 M41 30 l2.6 -5.4'/><path d='M29 47 l-2.6 -5.4 M29 47 l0 -6.2 M29 47 l2.6 -5.4'/></g></svg>");
    background-size: 52px 52px;
    background-position: calc(var(--grain-x, 0) * -1px) calc(var(--grain-y, 0) * -1px);
}

.grid-cell.rock {
  background-color: #463f37;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g fill='%238c8275' fill-opacity='.4'><circle cx='7.8' cy='3.6' r='0.89'/><circle cx='1.7' cy='12.9' r='0.72'/><circle cx='1.4' cy='12.2' r='0.52'/><circle cx='10.4' cy='1.7' r='0.55'/><circle cx='10.2' cy='19.8' r='0.57'/><circle cx='5.4' cy='15.1' r='1.07'/><circle cx='13.9' cy='9.5' r='1.09'/><circle cx='1.1' cy='20.6' r='0.67'/><circle cx='3.5' cy='2.8' r='0.69'/><circle cx='19.6' cy='4.3' r='0.85'/><circle cx='15.3' cy='8.9' r='0.83'/><circle cx='1.5' cy='1.4' r='0.62'/><circle cx='16.3' cy='10.3' r='0.69'/><circle cx='14.1' cy='10.9' r='0.68'/><circle cx='19.1' cy='16.8' r='0.65'/><circle cx='13.8' cy='12.6' r='1.03'/><circle cx='17.5' cy='6.9' r='1.09'/><circle cx='2.8' cy='10.0' r='0.95'/><circle cx='3.6' cy='11.7' r='0.52'/><circle cx='16.0' cy='18.3' r='0.84'/><circle cx='21.0' cy='7.5' r='0.92'/><circle cx='14.3' cy='13.9' r='0.77'/><circle cx='20.2' cy='22.7' r='0.78'/><circle cx='15.9' cy='1.5' r='0.92'/><circle cx='15.5' cy='23.8' r='0.99'/><circle cx='6.8' cy='9.3' r='0.9'/></g></svg>");
  background-size: 24px 24px;
  background-position: calc(var(--grain-x, 0) * -1px) calc(var(--grain-y, 0) * -1px);
}

/*
 * Scrub. The asset is a silhouette, so it is used as a mask and filled with
 * a colour that belongs to the terrain -- as an <img> it could only ever be
 * the flat near-black it was drawn in.
 *
 * The tint and the slight rotation are keyed off the cell index, so no two
 * neighbouring bushes are quite the same plant.
 */
.cell-bush {
  width: 62%;
  height: 62%;
  background-color: color-mix(in srgb, #7fa36b calc(62% + var(--bush-tint, 0) * 1%), #38472f);
  -webkit-mask: url("../../assets/bush-1.svg") center / contain no-repeat;
  mask: url("../../assets/bush-1.svg") center / contain no-repeat;
  rotate: calc(var(--bush-turn, 0) * 1deg);
  opacity: 0.88;
  pointer-events: none;
}

.secret-button {
  all: unset;
  cursor: pointer;
  font-size: 1.4em;
  line-height: 0;
  color: rgba(0, 0, 0, 0.55);
}

.grid-cell.hasSecretButton {
  border: 2px solid rgba(0,0,0,0.8);
}

.grid-cell:hover {
  border: 4px solid var(--gilt);
}

.grid-cell.revealed {
  pointer-events: none;
}

.grid-cell.hit {
  background-color: var(--parchment);
  background-image: none;
}

/*
 * A struck square, not a red tile. Cinnabar at full strength was the one
 * loud thing left on a muted plate; oxblood sits in the survey while the
 * parchment cross keeps the mark just as readable.
 */
.grid-cell.miss {
  background-color: var(--oxblood);
  background-image: none;
  box-shadow: inset 0 0 0 1px rgba(232, 220, 192, 0.18);
}

/* .grid-cell.warm {
  border: 2px solid rgba(255, 235, 59, 0.3);
}

.grid-cell.warmer {
  border: 2px solid rgba(255, 152, 0, 0.5);
}

.grid-cell.hot {
  border: 2px solid rgba(244, 67, 54, 0.7);
} */

.source-icon {
  font-size: 1.5em;
}

.miss-icon {
  color: var(--parchment);
  opacity: 0.86;
  font-size: 2.2em;
}

.proximity-meter {
  margin: 20px 0;
}

.meter {
  height: 20px;
  background-color: #858383;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 5px;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #f7c74d, #f78e4d, #f76f4d, #ee522c, red);
  transition: width 0.3s ease;
}

.game-status {
  background-color: var(--leather-deep);
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin: 10px 0;
}

.game-status.success {
  background-color: var(--success);
  color: var(--parchment);
}

.grid-container.disabled {
  opacity: 0.8;
  pointer-events: none;
}

.instructions {
  background-color: var(--leather-deep);
  padding: 15px;
  border-radius: 8px;
  font-size: 60%;
  margin-bottom: 10px;
}

.instructions h3 {
    margin-top: 0;
}

.instructions p {
    font-family: var(--font-body);
}

.pull-bottom {
  margin-bottom: -50px;
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

.close-btn {
    margin-top: 20px;
}
</style>