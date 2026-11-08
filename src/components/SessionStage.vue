<template>
  <div class="stage" :class="[containerClass, { active: isActive }]">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// The panel shell every Praxis session shares: the `.stage` chrome, the
// `.active` flag that widens it mid-session, and the heading. Each session
// keeps its own container class so its existing scoped selectors still apply.
defineProps({
  title: {
    type: String,
    required: true
  },
  containerClass: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>
