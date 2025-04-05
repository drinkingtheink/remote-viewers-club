<template>
  <div class="signature-pad-container">
    <div class="canvas-container" ref="canvasContainer">
      <canvas 
        ref="signatureCanvas"
        :width="width"
        :height="height"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
      ></canvas>
      <canvas 
        ref="dripsCanvas" 
        :width="width"
        :height="height"
        class="drips-canvas"
      ></canvas>
    </div>
    <div class="controls">
      <button type="button" class="clear-button" @click="clearSignature">Clear</button>
      <button type="button" class="save-button" @click="saveSignature">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  width: {
    type: Number,
    default: 500
  },
  height: {
    type: Number,
    default: 200
  },
  lineWidth: {
    type: Number,
    default: 3
  },
  backgroundColor: {
    type: String,
    default: '#fff'
  },
  bloodColor: {
    type: String,
    default: '#8B0000'
  },
  drippingProbability: {
    type: Number,
    default: 0.5 // Increased probability for more drips
  },
  drippingSpeed: {
    type: Number,
    default: 2 // Increased speed
  }
})

// Emits
const emit = defineEmits(['save', 'clear'])

// Refs
const canvasContainer = ref(null)
const signatureCanvas = ref(null)
const dripsCanvas = ref(null)
const isDrawing = ref(false)
const context = ref(null)
const dripsContext = ref(null)
const lastX = ref(0)
const lastY = ref(0)
const drips = ref([])
const animationFrameId = ref(null)
const isAnimating = ref(false)

// Methods
const setupCanvas = () => {
  const canvas = signatureCanvas.value
  context.value = canvas.getContext('2d')
  
  // Set canvas background
  context.value.fillStyle = props.backgroundColor
  context.value.fillRect(0, 0, canvas.width, canvas.height)
  
  // Set drawing style
  context.value.strokeStyle = props.bloodColor
  context.value.lineWidth = props.lineWidth
  context.value.lineCap = 'round'
  context.value.lineJoin = 'round'
  
  // Setup drips canvas
  dripsContext.value = dripsCanvas.value.getContext('2d')
  dripsContext.value.clearRect(0, 0, dripsCanvas.value.width, dripsCanvas.value.height)
}

const handleResize = () => {
  const container = canvasContainer.value
  const canvas = signatureCanvas.value
  const dripsCanvasEl = dripsCanvas.value
  
  // Save current canvas content
  const imageData = canvas.toDataURL()
  
  // Adjust canvas size based on container
  canvas.width = container.clientWidth
  canvas.height = props.height
  dripsCanvasEl.width = container.clientWidth
  dripsCanvasEl.height = props.height
  
  // Restore canvas settings
  setupCanvas()
  
  // Restore previous signature if exists
  if (imageData) {
    const img = new Image()
    img.onload = () => {
      context.value.drawImage(img, 0, 0)
    }
    img.src = imageData
  }
}

const getCoordinates = (event) => {
  const canvas = signatureCanvas.value
  const rect = canvas.getBoundingClientRect()
  
  if (event.type.includes('touch')) {
    return {
      offsetX: event.touches[0].clientX - rect.left,
      offsetY: event.touches[0].clientY - rect.top
    }
  } else {
    return {
      offsetX: event.offsetX,
      offsetY: event.offsetY
    }
  }
}

const startDrawing = (event) => {
  isDrawing.value = true
  const { offsetX, offsetY } = getCoordinates(event)
  lastX.value = offsetX
  lastY.value = offsetY
  
  // Make sure animation is running when drawing starts
  if (!isAnimating.value) {
    startAnimation()
  }
}

const addDrip = (x, y) => {
  // Randomly decide if this point should drip
  if (Math.random() < props.drippingProbability) {
    drips.value.push({
      x,
      y,
      length: 0,
      maxLength: 20 + Math.random() * 100, // Longer drips
      width: (props.lineWidth / 2) * (0.5 + Math.random() * 0.8), // Vary the drip width
      speed: props.drippingSpeed * (0.7 + Math.random() * 1.2), // Vary the speed
      active: true,
      // Add some variation to each drip
      opacity: 0.7 + Math.random() * 0.3,
      delay: Math.random() * 10 // Small random delay before drip starts growing
    })
    
    // Force animation to run if it's not already
    if (!isAnimating.value) {
      startAnimation()
    }
  }
}

const draw = (event) => {
  if (!isDrawing.value) return
  
  const { offsetX, offsetY } = getCoordinates(event)
  
  // Draw the signature line
  context.value.beginPath()
  context.value.moveTo(lastX.value, lastY.value)
  context.value.lineTo(offsetX, offsetY)
  context.value.stroke()
  
  // Calculate distance moved
  const distance = Math.sqrt(
    Math.pow(offsetX - lastX.value, 2) + 
    Math.pow(offsetY - lastY.value, 2)
  )
  
  // Add drips along the path for smoother distribution
  if (distance > 5) {
    // Add drips at intervals along the line
    const steps = Math.floor(distance / 5)
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const x = lastX.value + (offsetX - lastX.value) * t
      const y = lastY.value + (offsetY - lastY.value) * t
      addDrip(x, y)
    }
  } else {
    // Add a drip at the current position
    addDrip(offsetX, offsetY)
  }
  
  lastX.value = offsetX
  lastY.value = offsetY
}

const stopDrawing = () => {
  isDrawing.value = false
}

const updateDrips = () => {
  dripsContext.value.clearRect(0, 0, dripsCanvas.value.width, dripsCanvas.value.height)
  
  let activeCount = 0
  
  drips.value.forEach((drip) => {
    if (!drip.active) return
    
    // Handle delay before drip starts growing
    if (drip.delay > 0) {
      drip.delay -= 1
      activeCount++
      return
    }
    
    drip.length += drip.speed
    
    if (drip.length >= drip.maxLength) {
      drip.active = false
      return
    }
    
    activeCount++
    
    // Create gradient for the drip
    const gradient = dripsContext.value.createLinearGradient(drip.x, drip.y, drip.x, drip.y + drip.length)
    gradient.addColorStop(0, props.bloodColor)
    gradient.addColorStop(1, `rgba(139, 0, 0, 0)`)
    
    // Draw the drip
    dripsContext.value.beginPath()
    
    // Draw the top of the drip (connecting to the signature line)
    dripsContext.value.arc(drip.x, drip.y, drip.width, 0, Math.PI * 2)
    
    // Create teardrop shape
    if (drip.length > 5) {
      const topWidth = drip.width
      const endWidth = topWidth * 0.5
      
      dripsContext.value.moveTo(drip.x + topWidth, drip.y)
      dripsContext.value.quadraticCurveTo(
        drip.x + endWidth, drip.y + drip.length * 0.5,
        drip.x, drip.y + drip.length
      )
      dripsContext.value.quadraticCurveTo(
        drip.x - endWidth, drip.y + drip.length * 0.5,
        drip.x - topWidth, drip.y
      )
    }
    
    // Set opacity based on drip's properties
    dripsContext.value.fillStyle = gradient
    dripsContext.value.fill()
    
    // Occasionally create a drop at the end of a drip
    if (drip.length > drip.maxLength * 0.7 && Math.random() < 0.05) {
      dripsContext.value.beginPath()
      const dropSize = drip.width * (1 + Math.random())
      dripsContext.value.arc(
        drip.x + (Math.random() * 2 - 1), 
        drip.y + drip.length, 
        dropSize, 
        0, 
        Math.PI * 2
      )
      dripsContext.value.fillStyle = props.bloodColor
      dripsContext.value.fill()
    }
  })
  
  // Continue animation
  if (activeCount > 0 || isDrawing.value) {
    isAnimating.value = true
    animationFrameId.value = requestAnimationFrame(updateDrips)
  } else {
    isAnimating.value = false
  }
}

const startAnimation = () => {
  // Clear any existing animation
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  
  isAnimating.value = true
  
  // Start animation loop
  animationFrameId.value = requestAnimationFrame(updateDrips)
}

const clearSignature = () => {
  const canvas = signatureCanvas.value
  context.value.fillStyle = props.backgroundColor
  context.value.fillRect(0, 0, canvas.width, canvas.height)
  
  // Clear drips
  drips.value = []
  dripsContext.value.clearRect(0, 0, dripsCanvas.value.width, dripsCanvas.value.height)
  
  // Cancel any ongoing animation
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }
  isAnimating.value = false
  
  emit('clear')
}

const saveSignature = () => {
  // Create a temporary canvas to merge signature and drips
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = signatureCanvas.value.width
  tempCanvas.height = signatureCanvas.value.height
  const tempContext = tempCanvas.getContext('2d')
  
  // Draw background
  tempContext.fillStyle = props.backgroundColor
  tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
  
  // Draw signature
  tempContext.drawImage(signatureCanvas.value, 0, 0)
  
  // Draw drips
  tempContext.drawImage(dripsCanvas.value, 0, 0)
  
  // Get combined image data
  const imageData = tempCanvas.toDataURL('image/png')
  // emit('save', imageData)
  submitData(imageData)
}

const submitData = (sigImgData) => {
  // Get form data
  const formData = {
    signatureImgData: sigImgData
  };

  // Create a hidden iframe approach (CORS bypass for Google Scripts)
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://script.google.com/macros/s/AKfycbxobKLN96g3YMev65nBc8woLP63Z6ah8oJyAxLYJyWxY_WDSb1Hiv1OuBnips9SvTYv/exec';
  form.target = 'hidden-iframe';
  form.style.display = 'none';
  
  // Add a hidden input with the stringified JSON
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = JSON.stringify(formData);
  form.appendChild(input);
  
  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.name = 'hidden-iframe';
  iframe.style.display = 'none';
  
  // Add success/error handlers
  iframe.onload = function() {    
    // Clean up
    setTimeout(function() {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 500);
  };
  
  // Add elements to DOM and submit
  document.body.appendChild(iframe);
  document.body.appendChild(form);
  form.submit();
}

const handleTouchStart = (event) => {
  event.preventDefault()
  startDrawing(event)
}

const handleTouchMove = (event) => {
  event.preventDefault()
  draw(event)
}

// Set up a default drip to make sure the dripping effect is visible immediately
const createInitialDrips = () => {
  // Add a few invisible starter drips to prime the animation system
  for (let i = 0; i < 3; i++) {
    drips.value.push({
      x: -10, // Off-screen
      y: -10,
      length: 0,
      maxLength: 1,
      width: 1,
      speed: 0.1,
      active: true,
      opacity: 0,
      delay: 0
    })
  }
  
  // Start the animation
  startAnimation()
}

// Lifecycle hooks
onMounted(() => {
  setupCanvas()
  window.addEventListener('resize', handleResize)
  
  // Create some initial drips and start animation immediately
  createInitialDrips()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  
  // Clean up animation
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<style scoped>
.signature-pad-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.canvas-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  position: relative;
  height: 200px; /* Fixed height to match canvas height */
}

canvas {
  display: block;
  touch-action: none;
  position: absolute;
  top: 0;
  left: 0;
}

.drips-canvas {
  pointer-events: none;
  z-index: 1; /* Ensure drips appear above signature */
}

.controls {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: none;
}

button {
    background-color: red;
    color: white;
    text-transform: uppercase;
    padding: 0.5rem 3rem;
}

.save-button {
  background-color: #4caf50;
  color: white;
}
</style>