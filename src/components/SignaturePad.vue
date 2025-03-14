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
    </div>
    <div class="controls">
      <button type="button" class="clear-button" @click="clearSignature">Clear</button>
      <!-- <button type="button" class="save-button" @click="saveSignature">Save</button> -->
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
    default: 2
  },
  lineColor: {
    type: String,
    default: 'red'
  },
  backgroundColor: {
    type: String,
    default: '#fff'
  }
})

// Emits
const emit = defineEmits(['save', 'clear'])

// Refs
const canvasContainer = ref(null)
const signatureCanvas = ref(null)
const isDrawing = ref(false)
const context = ref(null)
const lastX = ref(0)
const lastY = ref(0)

// Methods
const setupCanvas = () => {
  const canvas = signatureCanvas.value
  context.value = canvas.getContext('2d')
  
  // Set canvas background
  context.value.fillStyle = props.backgroundColor
  context.value.fillRect(0, 0, canvas.width, canvas.height)
  
  // Set drawing style
  context.value.strokeStyle = props.lineColor
  context.value.lineWidth = props.lineWidth
  context.value.lineCap = 'round'
  context.value.lineJoin = 'round'
}

const handleResize = () => {
  const container = canvasContainer.value
  const canvas = signatureCanvas.value
  
  // Save current canvas content
  const imageData = canvas.toDataURL()
  
  // Adjust canvas size based on container
  canvas.width = container.clientWidth
  canvas.height = props.height
  
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
}

const draw = (event) => {
  if (!isDrawing.value) return
  
  const { offsetX, offsetY } = getCoordinates(event)
  
  context.value.beginPath()
  context.value.moveTo(lastX.value, lastY.value)
  context.value.lineTo(offsetX, offsetY)
  context.value.stroke()
  
  lastX.value = offsetX
  lastY.value = offsetY
}

const stopDrawing = () => {
  isDrawing.value = false
}

const clearSignature = () => {
  const canvas = signatureCanvas.value
  context.value.fillStyle = props.backgroundColor
  context.value.fillRect(0, 0, canvas.width, canvas.height)
  emit('clear')
}

// const saveSignature = () => {
//   const canvas = signatureCanvas.value
//   const imageData = canvas.toDataURL('image/png')
//   emit('save', imageData)
// }

const handleTouchStart = (event) => {
  event.preventDefault()
  startDrawing(event)
}

const handleTouchMove = (event) => {
  event.preventDefault()
  draw(event)
}

// Lifecycle hooks
onMounted(() => {
  setupCanvas()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
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
}

canvas {
  display: block;
  touch-action: none;
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

.clear-button {
    background-color: red;
    color: white;
    padding: 0.5rem 3rem;
    text-transform: uppercase;
}

.save-button {
  background-color: #4caf50;
  color: white;
}
</style>