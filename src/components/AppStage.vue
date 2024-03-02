<template>
  <div class="app-stage">
    <h1>REMOTE VIEWERS CLUB</h1>
    <main>
      <Badge1 />
      <Badge2 />
    </main>
  </div>
</template>

<script>
import Badge1 from './Badge1.vue'
import Badge2 from './Badge2.vue'

export default {
  name: 'AppStage',
  components: {
    Badge1,
    Badge2
  }
}
</script>

<style scoped>
h1 {
  color: #eaeaea;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

main {
  /* display: flex;
  justify-content: center;
  align-content: center; */
}

.badge {
  max-width: 600px;
}
</style>
