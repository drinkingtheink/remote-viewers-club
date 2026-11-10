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
   * number. The two series are related but not the same: a praxis session
   * is a procedure and gets a form, a specimen is a collection object and
   * gets accessioned under the form that produced it, which is why a badge
   * reads RVC 24.44.7 against this session's RVC FORM 24-A. Change a form
   * number here and the matching accessions in AppStage's badgeMap go with
   * it.
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
