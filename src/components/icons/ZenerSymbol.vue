<template>
  <svg class="zener-glyph" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle v-if="symbol === 'circle'" cx="50" cy="50" r="32" />

    <path v-else-if="symbol === 'cross'" d="M50,18 V82 M18,50 H82" />

    <g v-else-if="symbol === 'waves'">
      <path d="M20,32 q10,-12 20,0 t20,0 t20,0" />
      <path d="M20,50 q10,-12 20,0 t20,0 t20,0" />
      <path d="M20,68 q10,-12 20,0 t20,0 t20,0" />
    </g>

    <rect v-else-if="symbol === 'square'" x="18" y="18" width="64" height="64" />

    <path
      v-else-if="symbol === 'star'"
      d="M50,16 L57.94,39.08 L82.34,39.49 L62.84,54.17 L69.99,77.51 L50,63.5 L30.01,77.51 L37.16,54.17 L17.66,39.49 L42.06,39.08 Z"
    />
  </svg>
</template>

<script setup>
import { defineProps } from 'vue'

// The five Rhine/Zener symbols, drawn once and reused by the card faces, the
// choice buttons and the intro animation.
defineProps({
  symbol: {
    type: String,
    required: true,
    validator: (value) => ['circle', 'cross', 'waves', 'square', 'star'].includes(value)
  }
})
</script>

<style>
.zener-glyph circle,
.zener-glyph rect,
.zener-glyph path {
  fill: none;
  stroke: currentColor;
  stroke-width: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
</style>
