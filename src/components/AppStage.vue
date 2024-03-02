<template>
  <div class="app-stage">
    <h1>REMOTE VIEWERS CLUB</h1>
    <main>
      <Badge1 />
      <Badge2 />
      <Badge3 />
    </main>
  </div>
</template>

<script>
import Badge1 from './Badge1.vue'
import Badge2 from './Badge2.vue'
import Badge3 from './Badge3.vue'

export default {
  name: 'AppStage',
  components: {
    Badge1,
    Badge2,
    Badge3,
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anta&family=Exo:wght@300;700&family=Russo+One&display=swap');
body {
  font-family: "Anta", sans-serif;
  font-weight: 400;
  font-style: normal;
}

h1 {
  color: #eaeaea;
  font-family: "Anta", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 330%;
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
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 0 3rem;
}

@media only screen and (max-width: 60em) {
  main {
    display: block;
    text-align: center;
  }
}

.badge {
  min-width: 350px;
  max-width: 600px;
  padding: 1rem 1rem 0 0;
  margin: 1rem 1rem 0 0;
  filter: drop-shadow(10px 0 10px #111);
}

@media only screen and (max-width: 60em) {
  .badge {
    margin: 0 auto;
  }
}
</style>
