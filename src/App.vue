<template>
  <AppStage />

  <!-- the eye that opens in the tooling; behind everything, never over a word -->
  <div ref="latticeEye" class="lattice-eye" aria-hidden="true"></div>

  <!--
    The room losing focus while the arms have hold of it. It sits above the
    page but under the arms, so what it softens is everything painted
    before it -- the leather, the tooling, the eye and the whole page -- and
    never the arms, which are painted after and stay in focus.
  -->
  <div class="siege-haze" aria-hidden="true"></div>

  <!-- how the Club says things; raised from anywhere via showPlacard() -->
  <ThePlacard />
</template>

<script>
import AppStage from './components/AppStage.vue'
import ThePlacard from './components/ThePlacard.vue'
import { startWatchingLattice } from './composables/useWatchingLattice'

export default {
  name: 'App',
  components: {
    AppStage,
    ThePlacard
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
