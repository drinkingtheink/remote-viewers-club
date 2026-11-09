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
                <h3>How to Dowse</h3>
                <ol class="dowse-steps">
                    <li>Focus your intuition on the grid.</li>
                    <li>Move slowly, watching the sensitivity meter.</li>
                    <li>Click where you sense a hidden source.</li>
                    <li>Find them all in as few attempts as you can.</li>
                </ol>
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
                
                <dl class="stats">
                    <div><dt>Attempts</dt><dd>{{ attempts }}</dd></div>
                    <div><dt>Hits</dt><dd>{{ hits }}</dd></div>
                    <div><dt>Score</dt><dd>{{ score }}</dd></div>
                </dl>
                
                <button @click="resetGame" class="reset-btn">New Game</button>
            </div>

            <div class="proximity-meter">
                <div class="meter-label">Dowsing Rod Sensitivity</div>
                <div class="meter">
                <div class="meter-fill" :style="{ width: `${proximity}%` }"></div>
                </div>
            </div>
            
            <p class="game-status" :class="{ 'success': foundAllSources }">
                <span v-if="foundAllSources">Success! You found all hidden {{ sourceType }} sources!</span>
                <span v-else>Find the {{ sourceType }} sources hidden in the grid.</span>
            </p>
            
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
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* The running totals are meta, not headlines; same compact row the other
   sessions use for their tallies. */
.stats {
  display: flex;
  gap: 1.25rem;
  margin: 0;
}

.stats dt {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--parchment);
  opacity: 0.7;
}

.stats dd {
  margin: 2px 0 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--gilt-bright);
}

.grid-container {
  position: relative;
  margin: 20px auto 0 auto;
  max-width: 600px;
}

/*
 * An overworld board. Bright and saturated on purpose -- the dowsing field
 * is a game inside the book, and it is allowed to look like one. The dark
 * seam between cells is the tile edge, not a survey rule.
 */
.grid {
  display: grid;
  gap: 1px;
  width: 100%;
  aspect-ratio: 1;
  padding: 2px;
  background-color: #1d5a22;
  border: 3px solid var(--gilt-dim);
  border-radius: 6px;
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
    background-color: #5ec75e;
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'><g fill='none' stroke='%232f9e3f' stroke-opacity='.55' stroke-width='1.6' stroke-linecap='round'><path d='M7 9 l-2.6 -5.4 M7 9 l0 -6.2 M7 9 l2.6 -5.4'/><path d='M26 20 l-2.6 -5.4 M26 20 l0 -6.2 M26 20 l2.6 -5.4'/><path d='M14 31 l-2.6 -5.4 M14 31 l0 -6.2 M14 31 l2.6 -5.4'/><path d='M33 38 l-2.6 -5.4 M33 38 l0 -6.2 M33 38 l2.6 -5.4'/><path d='M4 24 l-2.6 -5.4 M4 24 l0 -6.2 M4 24 l2.6 -5.4'/><path d='M22 5 l-2.6 -5.4 M22 5 l0 -6.2 M22 5 l2.6 -5.4'/><path d='M36 13 l-2.6 -5.4 M36 13 l0 -6.2 M36 13 l2.6 -5.4'/><path d='M18 44 l-2.6 -5.4 M18 44 l0 -6.2 M18 44 l2.6 -5.4'/><path d='M41 30 l-2.6 -5.4 M41 30 l0 -6.2 M41 30 l2.6 -5.4'/><path d='M29 47 l-2.6 -5.4 M29 47 l0 -6.2 M29 47 l2.6 -5.4'/></g></svg>");
    background-size: 52px 52px;
    background-position: calc(var(--grain-x, 0) * -1px) calc(var(--grain-y, 0) * -1px);
}

.grid-cell.rock {
  background-color: #cf9242;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g fill='%238a5a24' fill-opacity='.45'><rect x='9.0' y='11.2' width='4' height='3' rx='.6'/><rect x='10.2' y='11.7' width='3' height='3' rx='.6'/><rect x='12.6' y='15.9' width='2' height='3' rx='.6'/><rect x='6.1' y='1.8' width='2' height='3' rx='.6'/><rect x='19.3' y='13.1' width='3' height='2' rx='.6'/><rect x='16.6' y='1.3' width='2' height='2' rx='.6'/><rect x='17.6' y='12.0' width='4' height='3' rx='.6'/><rect x='8.8' y='16.8' width='3' height='3' rx='.6'/><rect x='10.0' y='13.2' width='4' height='3' rx='.6'/><rect x='8.1' y='11.0' width='2' height='3' rx='.6'/><rect x='6.3' y='4.6' width='3' height='2' rx='.6'/><rect x='1.4' y='15.3' width='4' height='2' rx='.6'/><rect x='16.9' y='7.7' width='2' height='2' rx='.6'/><rect x='4.3' y='18.5' width='2' height='3' rx='.6'/></g></svg>");
  background-size: 24px 24px;
  background-position: calc(var(--grain-x, 0) * -1px) calc(var(--grain-y, 0) * -1px);
  /* a lit top edge and a shadowed bottom: a block, not a square */
  box-shadow:
    inset 0 3px 0 rgba(255, 226, 170, 0.55),
    inset 0 -3px 0 rgba(123, 74, 20, 0.5);
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
  background-color: color-mix(in srgb, #1f8a35 calc(62% + var(--bush-tint, 0) * 1%), #0f5e23);
  -webkit-mask: url("../../assets/bush-1.svg") center / contain no-repeat;
  mask: url("../../assets/bush-1.svg") center / contain no-repeat;
  rotate: calc(var(--bush-turn, 0) * 1deg);
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
  background-color: #3ca5e0;
  background-image: none;
  box-shadow:
    inset 0 3px 0 rgba(190, 233, 255, 0.6),
    inset 0 -3px 0 rgba(20, 95, 145, 0.5);
}

.grid-cell.miss {
  background-color: #e03131;
  background-image: none;
  box-shadow:
    inset 0 3px 0 rgba(255, 180, 180, 0.5),
    inset 0 -3px 0 rgba(140, 22, 22, 0.55);
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
  color: #fff;
  font-size: 2.2em;
}

.proximity-meter {
  margin: 1rem 0;
}

.meter-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--gilt-bright);
  text-align: left;
}

.difficulty-selector label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--parchment);
  opacity: 0.7;
  display: block;
  margin-bottom: 4px;
  text-align: left;
}

.meter {
  height: 14px;
  background-color: var(--leather-deep);
  border: 1px solid var(--gilt-dim);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 6px;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gilt-dim), var(--gilt), var(--gilt-bright), var(--cinnabar));
  transition: width 0.3s ease;
}

.game-status {
  background-color: var(--leather-deep);
  padding: 0.6rem 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 0.75rem auto !important;
  font-size: var(--text-sm) !important;
  letter-spacing: var(--tracking-wide);
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
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: left;
}

.instructions h3 {
  margin: 0 0 0.5rem 0;
  font-size: var(--text-base);
  letter-spacing: var(--tracking-wide);
  color: var(--gilt-bright);
}

/* Two columns where there's room: four steps shouldn't out-rank the grid. */
.dowse-steps {
  margin: 0;
  padding-left: 1.3rem;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--parchment);
  columns: 2;
  column-gap: 2rem;
}

.dowse-steps li {
  display: list-item;
  margin: 0 0 0.3rem 0;
  break-inside: avoid;
}

@media only screen and (max-width: 767px) {
  .dowse-steps {
    columns: 1;
  }
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