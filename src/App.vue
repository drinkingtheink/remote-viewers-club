<template>
  <AppStage />

  <!-- the eye that opens in the tooling; behind everything, never over a word -->
  <div ref="latticeEye" class="lattice-eye" aria-hidden="true"></div>

  <!--
    The room losing focus while the arms have hold of it. It sits on the
    same buried layer as the binding and comes last, so what it softens is
    the leather, the tooling and the eye -- everything painted before it --
    and never the page or the arms, which are painted after.
  -->
  <div class="siege-haze" aria-hidden="true"></div>
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
