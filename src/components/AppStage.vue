<template>
  <div class="app-stage">
    <h1>REMOTE VIEWERS CLUB</h1>
    <p class="intro">Animated vignettes inspired by military and astronomical mission badges and other ephemera.</p>
    <main>
      <div class="badge" v-for="badge in badgeMap" :key="badge.title">
        <component :is="`Badge${badge.id}`"></component>

        <div class="badge-details">
          <h3>{{ badge.title }}</h3>
          <h4>{{ badge.desc }}</h4>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Badge1 from './Badge1.vue'
import Badge2 from './Badge2.vue'
import Badge3 from './Badge3.vue'
import Badge4 from './Badge4.vue'
import Badge5 from './Badge5.vue'

const badgeMap = [
  {
    title: 'Remote Viewing Task Force',
    desc: 'For Stillwater',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 1,
  },
  {
    title: 'Electronic Phantoms',
    desc: '9716th Radar Decoy Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 2,
  },
  {
    title: '960th PSYWACs',
    desc: '',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 3,
  },
  {
    title: 'Vigilance and Speed',
    desc: '3rd Special Interceptor Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 4,
  },
  {
    title: 'See You Yesterday',
    desc: '37th Temporal Reconaissance Wing',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 5,
  },
];

export default {
  name: 'AppStage',
  components: {
    Badge1,
    Badge2,
    Badge3,
    Badge4,
    Badge5,
  },
  data() {
    return {
      badgeMap: badgeMap,
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anta&family=Exo:wght@300;700&family=Russo+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amita:wght@400;700&display=swap');

body {
  font-family: "Anta", sans-serif;
  font-weight: 400;
  font-style: normal;
  padding-bottom: 10rem;
  margin: 0;
}

h1 {
  color: #eaeaea;
  font-weight: 400;
  font-style: normal;
  font-size: 330%;
  background: rgba(0,0,0,0.6);
  padding: 10px 0;
  margin-bottom: 0;
}

@media only screen and (max-width: 60em) {
  h1 {
    font-size: 200%;
  }
}

p.intro {
  background: rgba(0,0,0,0.6);
  padding: 0 0 1rem 0;
  margin: 0;
  font-family: "Amita", serif;
  font-weight: 700;
  font-style: normal;
  font-size: 140%;
}

@media only screen and (max-width: 60em) {
  p.intro {
    font-size: 100%;
  }
}

h1, h2, h3, h4 {
  font-family: "Anta", sans-serif;
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
  padding: 0 3rem;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

@media only screen and (max-width: 60em) {
  main {
    display: block;
    text-align: center;
    padding: 0;
  }
}

.badge {
  filter: drop-shadow(10px 0 10px #111);
  width: 30%;
  padding: 1rem 1rem 0 0;
  margin: 1rem 1rem 0 0;
}

@media only screen and (max-width: 60em) {
  .badge {
    padding: 1rem 0;
    margin: 0 auto;
    width: 100%;
  }
}

.badge-details {
  background: rgba(0,0,0,0.6);
  padding: 10px 5px;
  margin-top: 20px;
}

.badge-details h3 {
  margin: 0;
  text-transform: uppercase;
}

.badge-details h4 {
  margin: 10px 0;
  color: white;
}
</style>
