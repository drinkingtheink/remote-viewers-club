<template>
  <AppStage />

  <!-- the eye that opens in the tooling; behind everything, never over a word -->
  <div ref="latticeEye" class="lattice-eye" aria-hidden="true"></div>
</template>

<script>
import AppStage from './components/AppStage.vue'
import { startWatchingLattice } from './composables/useWatchingLattice'

export default {
  name: 'App',
  components: {
    AppStage
  },
  mounted() {
    startWatchingLattice(this.$refs.latticeEye)
  }
}
</script>

<style>
#app {
  font-family: var(--font-body);
  text-align: center;
  color: var(--the-yellow);
}
</style>
