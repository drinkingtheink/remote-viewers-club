<template>
  <div class="app-stage">
    <div class="intro-wrapper">
      <SeeYouThere class="watcher" />
      <h1>REMOTE VIEWERS CLUB</h1>
      <p class="intro">Animated vignettes inspired by military and astronomical mission badges and other ephemera.</p>
    </div>
    <main>
      <div class="badge" v-for="badge in badgeMap" :key="badge.title">
        <component :is="`Badge${badge.id}`"></component>

        <div class="badge-details">
          <h3>{{ badge.title }}</h3>
          <h4 v-if="badge.desc">{{ badge.desc }}</h4>
          <a class="inspo" :href="badge.inspo" target="_blank">Origin</a>
        </div>
      </div>
    </main>
    <footer>
      <a href="https://github.com/drinkingtheink/remote-viewers-club" target="_blank">About this App</a>
      <a href="https://www.drinkingtheink.com/" target="_blank">About the Author</a>
    </footer>
  </div>
</template>

<script>
import Badge1 from './Badge1.vue'
import Badge2 from './Badge2.vue'
import Badge3 from './Badge3.vue'
import Badge4 from './Badge4.vue'
import Badge5 from './Badge5.vue'
import Badge6 from './Badge6.vue'
import SeeYouThere from './SeeYouThere.vue'

const badgeMap = [
  {
    title: 'Remote Viewing Task Force',
    desc: 'Fort Stillwater',
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
    title: 'PSYWACs',
    desc: '960th Psychological Warfare Squadron',
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
    inspo: 'https://twitter.com/arpitingle/status/1698709125088088109',
    id: 5,
  },
  {
    title: 'Beyond All Bounds',
    desc: '24th Omnidimensional Operations Squadron',
    inspo: 'https://twitter.com/arpitingle/status/1698709125088088109',
    id: 6,
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
    Badge6,
    SeeYouThere,
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
@import url('https://fonts.googleapis.com/css2?family=Amita:wght@400;700&family=Unica+One&display=swap');
.inspo {
  display: block;
  border-bottom: 3px solid transparent;
}

.inspo:hover {
  background: #f1f380;
  color: #ED0000;
  font-weight: bold;
  border-bottom-color: #ED0000;
}

body {
  font-family: "Anta", sans-serif;
  font-weight: 400;
  font-style: normal;
  padding: 0;
  margin: 0;
}

h1 {
  color: #eaeaea;
  font-weight: 400;
  font-style: normal;
  font-size: 330%;
  background: rgba(0,0,0,0.6);
  padding: 10px 0 2rem 0;
  margin-bottom: 0;
}

@media only screen and (max-width: 60em) {
  h1 {
    font-size: 200%;
    padding: 2rem 2rem 0.5rem 2rem;
  }
}

.intro-wrapper {
  position: relative;
}

.watcher {
  position: absolute;
  top: -2rem;
  right: 5%;
  width: 160px;
  transform: rotate(20deg);
  filter: drop-shadow(10px 0 10px #111);
}

@media only screen and (max-width: 60em) {
  .watcher {
    position: static;
    margin: 0 auto;
    width: 33%;
  }
}

p.intro {
  background: rgba(0,0,0,0.6);
  padding: 0 20% 2rem 20%;
  margin: 0;
  font-family: "Unica One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 200%;
}

@media only screen and (max-width: 60em) {
  p.intro {
    font-size: 150%;
    padding: 0.5rem 1rem 2rem 1rem;
    margin-bottom: 2rem;
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
  color: #ED0000;
  text-decoration: none;
  transition: all 0.3s;
  text-transform: uppercase;
}

a:hover {
  color: #CC993E;
  text-decoration: none;
}

main {
  padding: 0 3rem 10rem;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  max-width: 2000px;
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
  position: relative;
}

@media only screen and (max-width: 60em) {
  .badge {
    padding: 1rem 0;
    margin: 0 auto;
    width: 100%;
  }
}

.badge-details {
  margin-top: 20px;
}

.badge-details * {
  background: rgba(0,0,0,0.6);
  padding: 10px 5px;
}

.badge-details h3 {
  margin: 0;
  text-transform: uppercase;
}

.badge-details h4 {
  margin: 5px 0;
  color: white;
}

footer {
  text-align: center;
  display: flex;
  justify-content: space-around;
  max-width: 800px;
  margin: 2rem auto 0 auto;
}

@media only screen and (max-width: 60em) {
  footer {
    display: block;
  }
}

footer a {
  display: block;
  background: rgba(0,0,0,0.8);
  width: 46%;
  padding: 1rem 0;
  border-left: 10px solid #ED0000;
}

@media only screen and (max-width: 60em) {
  footer a {
    width: 100%;
    margin-bottom: 10px;
  }
}

footer a:hover {
  border-color: #CC993E;
}
</style>
