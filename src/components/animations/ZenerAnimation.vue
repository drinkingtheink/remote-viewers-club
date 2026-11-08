<template>
  <div class="zener-animation">
    <svg id="zener-anim" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <g id="zener-card-art">
        <rect class="zener-card-face" x="88" y="20" width="124" height="160" rx="8" />
        <rect class="zener-card-rule" x="96" y="28" width="108" height="144" rx="4" />
      </g>

      <!-- The deck cycling past, one symbol at a time. -->
      <g id="zener-anim-symbols">
        <ZenerSymbol
          v-for="(name, index) in symbols"
          :key="name"
          :symbol="name"
          class="zener-anim-symbol"
          :style="{ animationDelay: `${index}s` }"
          x="100"
          y="50"
          width="100"
          height="100"
        />
      </g>

      <g id="zener-sparks">
        <path style="animation-delay: 0s" d="M46,58l2-7,2,7c.3,1.1,1.2,2,2.4,2.4l7,2-7,2c-1.1.3-2,1.2-2.4,2.4l-2,13.6-2-13.6c-.3-1.1-1.2-2-2.4-2.4l-7-2,7-2c1.1-.3,2-1.2,2.4-2.4Z" />
        <path style="animation-delay: 0.5s" d="M248,118l2-7,2,7c.3,1.1,1.2,2,2.4,2.4l7,2-7,2c-1.1.3-2,1.2-2.4,2.4l-2,13.6-2-13.6c-.3-1.1-1.2-2-2.4-2.4l-7-2,7-2c1.1-.3,2-1.2,2.4-2.4Z" />
        <path style="animation-delay: 1s" d="M256,40l1.4-5,1.4,5c.2.8.9,1.4,1.7,1.7l5,1.4-5,1.4c-.8.2-1.4.9-1.7,1.7l-1.4,9.7-1.4-9.7c-.2-.8-.9-1.4-1.7-1.7l-5-1.4,5-1.4c.8-.2,1.4-.9,1.7-1.7Z" />
        <path style="animation-delay: 1.5s" d="M40,140l1.4-5,1.4,5c.2.8.9,1.4,1.7,1.7l5,1.4-5,1.4c-.8.2-1.4.9-1.7,1.7l-1.4,9.7-1.4-9.7c-.2-.8-.9-1.4-1.7-1.7l-5-1.4,5-1.4c.8-.2,1.4-.9,1.7-1.7Z" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import ZenerSymbol from '../icons/ZenerSymbol.vue'
import { ZENER_SYMBOL_IDS } from '../../data/zenerSymbols'

const symbols = ZENER_SYMBOL_IDS
</script>

<style>
.zener-animation {
  max-width: 260px;
  margin: 0 auto;
  color: var(--the-yellow);
}

.zener-animation svg {
  overflow: visible;
}

.zener-card-face,
.zener-card-rule {
  fill: none;
  stroke: var(--the-yellow);
  stroke-width: 2px;
}

.zener-card-rule {
  opacity: 0.35;
}

.zener-anim-symbol {
  opacity: 0;
  animation: zenerCycle 5s infinite;
}

@keyframes zenerCycle {
  0%, 14% {
    opacity: 1;
  }
  22%, 100% {
    opacity: 0;
  }
}

#zener-sparks path {
  fill: var(--the-yellow);
  opacity: 0.7;
  animation: wobble 1s infinite alternate;
}

/* Matches the other sessions: hovering the panel wakes the artwork up. */
.zener-session:hover .zener-card-face,
.zener-session:hover .zener-card-rule {
  stroke-dasharray: 5;
  animation: dash 5s infinite alternate;
}

.zener-session:hover .zener-anim-symbol {
  animation-duration: 2.5s;
}

.zener-session:hover #zener-sparks path {
  animation: glimmer 1s infinite forwards;
}

@media (prefers-reduced-motion: reduce) {
  .zener-anim-symbol,
  #zener-sparks path,
  .zener-session:hover .zener-card-face,
  .zener-session:hover .zener-card-rule,
  .zener-session:hover .zener-anim-symbol,
  .zener-session:hover #zener-sparks path {
    animation: none;
  }

  .zener-anim-symbol:first-of-type {
    opacity: 1;
  }
}
</style>
