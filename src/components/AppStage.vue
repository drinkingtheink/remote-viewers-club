<template>
  <div class="app-stage">
    <div class="intro-wrapper">
      <SeeYouThere class="watcher" />
      <h1>REMOTE VIEWERS CLUB</h1>
      <p class="intro">Remote viewing is the practice of seeking impressions about a distant or unseen subject. Anyone can do it!</p>
    </div>
    <div v-if="!!activeBadge" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="active-badge">
            <section class="modal-content">
              <button class="close-active" @click="closeActive">Back to Gallery</button>
              <component :is="`Badge${activeBadge.id}`"></component>
            </section>
          </div>
        </div>
      </div>
    </div>

    <section class="sections">
      <button 
        @click="activeSection = 'gallery'" 
        :class="{ active: activeSection === 'gallery' }">
         Gallery
        </button>
      <button 
        @click="activeSection = 'praxis'" 
        :class="{ active: activeSection === 'praxis' }">
          Praxis
        </button>
    </section>
    
    <main>
      <section class="gallery" v-if="activeSection === 'gallery'" :key='gallery-stage'>
        <h2 class="intro">Animated vignettes inspired by military and astronomical mission badges and other ephemera.</h2>
        <div class="badge" v-for="badge in badgeMap" :key="badge.title">
          <component :is="`Badge${badge.id}`"></component>

          <div class="badge-details">
            <h3>{{ badge.title }}</h3>
            <h4 v-if="badge.desc">{{ badge.desc }}</h4>
            <a class="inspo" :href="badge.inspo" target="_blank">Origin</a>
            <button class="enlarge" @click="handleBadgeClick(badge)">Enlarge</button>
          </div>
        </div>
      </section>

      <section class="praxis" v-if="activeSection === 'praxis'" :key='praxis-stage'>

        <h2 class="intro">Practice your skills and maybe you can make one of the squadrons.</h2>

        <div class="focii">
          <span class="focus-option">
            <RemoteViewingIcon />
          </span>
          <span class="focus-option">
            <PrecogIcon />
          </span>
        </div>

        <RemoteViewingSim />

        <!-- <PerceptionTraining /> -->
      </section>
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
import RemoteViewingSim from './RemoteViewingSim.vue'
import PerceptionTraining from './PerceptionTraining.vue'
import RemoteViewingIcon from './icons/RemoteViewingIcon';
import PrecogIcon from './icons/PrecognitionIcon';

const badgeMap = [
  {
    title: 'See You Yesterday',
    desc: '37th Temporal Reconaissance Wing',
    inspo: 'https://twitter.com/arpitingle/status/1698709125088088109',
    id: 1,
  },
  {
    title: 'Beyond All Bounds',
    desc: '24th Omnidimensional Operations Squadron',
    inspo: 'https://twitter.com/arpitingle/status/1698709125088088109',
    id: 2,
  },
  {
    title: 'Remote Viewing Task Force',
    desc: 'Fort Stillwater',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 3,
  },
  {
    title: 'Electronic Phantoms',
    desc: '9716th Radar Decoy Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 4,
  },
  {
    title: 'PSYWACs',
    desc: '960th Psychological Warfare Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 5,
  },
  {
    title: 'Vigilance and Speed',
    desc: '3rd Special Interceptor Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
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
    RemoteViewingSim,
    PrecogIcon,
    RemoteViewingIcon,
    PerceptionTraining,
  },
  data() {
    return {
      badgeMap: badgeMap,
      activeBadge: null,
      activeSection: 'gallery',
    }
  },
  methods: {
    handleBadgeClick(badge) {
      this.activeBadge = badge;
    },
    closeActive() {
      this.activeBadge = null;
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Anta&family=Exo:wght@300;700&family=Russo+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amita:wght@400;700&family=Unica+One&display=swap');
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 1000px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: rgba(0,0,0,0.6);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.active-badge {
  padding: 0 20%;
}

.close-active {
  font-size: 80%;
  margin: 1rem 0;
  text-transform: uppercase;
  padding: 1rem 2rem;
}

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
  padding: 10px 0 0 0;
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

section.gallery {
  padding: 0 3rem 10rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  max-width: 1200px;
}

@media only screen and (max-width: 60em) {
  section.gallery {
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
  margin: 2rem auto 4rem auto;
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

button.enlarge {
  color: white;
  width: 60%;
  border-radius: 40px;
  margin: 5px auto 0 auto;
  border: none;
  text-transform: uppercase;
  transition: all 0.2s;
}

@media only screen and (max-width: 767px) {
  button.enlarge {
    display: none;
  }
}

button.enlarge:hover {
  background: red;
}

.sections {
  padding-top: 1rem;
}

.sections button {
  font-size: 150%;
  background: black;
  color: white;
  margin: 5px;
  display: inline-block;
  border: 5px solid transparent;
  padding: 1rem 4rem;
  transition: all 0.2s;
  border-radius: 10px;
  font-family: "Anta", sans-serif;
  text-transform: uppercase;

  @media only screen and (max-width: 767px) {
    width: 300px;
  }
}

.sections button:hover {
  cursor: pointer;
  color: red;
}

.sections button.active {
  border-color: red;
  color: #f1f380;
}

.intro {
  font-family: "Unica One", sans-serif;
}

@keyframes fadeIn {
  0% { 
    opacity: 0;
    transform: translateY(50px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.gallery,
.praxis {
  animation: fadeIn 0.3s;
}

.praxis .intro {
  width: 70%;
  margin: 1rem auto;
}

.gallery h2 .info {
  flex-basis: 70%;
}

.focii svg {
  width: 150px;
}

.focii span {
  display: inline-block;
  padding: 10px 10px;
  margin-right: 10px;
  background: rgba(0,0,0,0.6);
}

.focii {
  display: flex;
  margin: 0 auto;
  justify-content: center;
}
</style>
