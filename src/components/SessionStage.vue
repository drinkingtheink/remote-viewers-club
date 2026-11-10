<template>
  <div class="stage" :class="[containerClass, { active: isActive }]">
    <p v-if="form" class="session-form">{{ form }}</p>
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
  /*
   * The filing number, in the slot a specimen plate gives its accession
   * number. A separate series on purpose: specimens are collection objects
   * and get accessioned, a praxis session is a procedure and gets a form,
   * so the two can share the furniture without being mistaken for one
   * another.
   */
  form: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>
