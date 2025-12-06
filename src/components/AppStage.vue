<template>
  <div class="app-stage">
    <div class="intro-wrapper">
      <SeeYouThere class="watcher" />
      <h1>REMOTE VIEWERS CLUB</h1>
      <p class="introduction">Purveyors, practicioners, and pundits of the metaphysical arts &amp; sciences</p>
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
          <span class="sparkle" v-if="activeSection === 'gallery'" />
          Gallery
        </button>
      <button 
        @click="activeSection = 'praxis'" 
        :class="{ active: activeSection === 'praxis' }">
          <span class="sparkle" v-if="activeSection === 'praxis'" />
          Praxis
      </button>
      <button 
        @click="activeSection = 'join'" 
        :class="{ active: activeSection === 'join' }">
          <span class="sparkle" v-if="activeSection === 'join'" />
          Join Us
      </button>
    </section>
    
    <main>
      <section class="content-section gallery" v-if="activeSection === 'gallery'" :key='gallery-stage'>
        <h2 class="intro">Special Teams led by legendary members</h2>
        <div class="badge" v-for="badge, index in badgeMap" :key="badge.title">
          <component :is="`Badge${index + 1}`"></component>

          <div class="badge-details">
            <h3>{{ badge.title }}</h3>
            <h4 v-if="badge.desc">{{ badge.desc }}</h4>
            <a class="inspo" :href="badge.inspo" target="_blank">Origin</a>
            <button class="enlarge" @click="handleBadgeClick(badge)">Enlarge</button>
          </div>
        </div>
      </section>

      <section class="content-section praxis" v-if="activeSection === 'praxis'" :key='praxis-stage'>
        <h2 class="intro">Practice your skills and maybe you can make one of the special teams</h2>
        <!-- <div class="focii">
          <span class="focus-option">
            <RemoteViewingIcon />
            <span class="banner">Remote Viewing</span>
          </span>
          <span class="focus-option">
            <PrecogIcon />
            <span class="banner">Precognition</span>
          </span>
          <span class="focus-option">
            <GnosisIcon />
            <span class="banner">Gnosis</span>
          </span>
        </div> -->

        <setion class="content-section session-stage">
          <RemoteViewingSession :scrollToElement="this.scrollToElement" />

          <PrecognitionSession :scrollToElement="this.scrollToElement" />

          <GnosisSession :scrollToElement="this.scrollToElement" />

          <DowsingSession :scrollToElement="this.scrollToElement" />
        </setion>
      </section>

      <section class="join" v-if="activeSection === 'join'" :key='join'>
        <Join />
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
import Badge7 from './Badge7.vue'
import SeeYouThere from './SeeYouThere.vue'
import RemoteViewingSession from './sessions/RemoteViewingSession.vue'
import PrecognitionSession from './sessions/PrecognitionSession.vue'
import GnosisSession from './sessions/GnosisSession.vue'
import DowsingSession from './sessions/DowsingSession.vue'
import Join from './Join.vue'
import RemoteViewingIcon from './icons/RemoteViewingIcon'
import PrecogIcon from './icons/PrecognitionIcon'
import GnosisIcon from './icons/GnosisIcon'

const badgeMap = [
  {
    title: 'Beyond All Bounds',
    desc: '24th Omnidimensional Operations Squadron',
    inspo: 'https://twitter.com/arpitingle/status/1698709125088088109',
    id: 1,
  },
  {
    title: 'Remote Viewing Task Force',
    desc: 'See You There',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 2,
  },
  {
    title: 'Electronic Phantoms',
    desc: '9716th Radar Decoy Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 3,
  },
  {
    title: 'PSYWACs',
    desc: '960th Psychological Warfare Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 4,
  },
  {
    title: 'Vigilance and Speed',
    desc: '3rd Special Interceptor Squadron',
    inspo: 'https://twitter.com/CassetteDyne/status/1735694599262192051',
    id: 5,
  },
  {
    title: 'See You Yesterday',
    desc: '37th Temporal Reconaissance Wing',
    inspo: 'https://twitter.com/arpitingle/status/1698709125088088109',
    id: 6,
  },
  {
    title: 'The Broadcast Continues',
    desc: '227th Silent Spectral Comms',
    inspo: 'https://codepen.io/drinkingtheink/pen/vEGdJew',
    id: 7,
  },
];

const initialFocus = 'gallery';

export default {
  name: 'AppStage',
  components: {
    Badge1,
    Badge2,
    Badge3,
    Badge4,
    Badge5,
    Badge6,
    Badge7,
    SeeYouThere,
    RemoteViewingSession,
    PrecogIcon,
    RemoteViewingIcon,
    GnosisIcon,
    PrecognitionSession,
    Join,
    GnosisSession,
    DowsingSession
  },
  data() {
    return {
      badgeMap: badgeMap,
      activeBadge: null,
      activeSection: 'join',
    }
  },
  methods: {
    handleBadgeClick(badge) {
      this.activeBadge = badge;
    },
    closeActive() {
      this.activeBadge = null;
    },
    scrollToElement(selector) {
      setTimeout(() => {
        const element = document.querySelector(selector)
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 250);
    },
    checkForQueryStrings: function() {
      let queryParams = new URLSearchParams(window.location.search);
      let focusQuery = queryParams.get('focus');
      
      if (focusQuery) { 
        this.activeSection = focusQuery;
        this.updateFocusUrlQueryString(focusQuery);
      }
      else {  
        this.activeSection = initialFocus; 
      }
    },
    updateFocusUrlQueryString: function(val) {
      let queryParams = new URLSearchParams(window.location.search);
      queryParams.set(`focus`, val);
      history.replaceState(null, null, `?${queryParams.toString()}`);
    },
  },
  mounted() {
    this.checkForQueryStrings();
  },
  watch: {
    activeSection(newSection) {
      console.log(`NEW SECTION TO NAV TO: ${newSection}`)
      this.updateFocusUrlQueryString(newSection);
    }
  },
}
</script>

<style>
:root {
  --the-yellow: #f1f380;
  --success: #2ecc71;
}

/**** TYPOG ****/
/* Anta */
@font-face {
  font-family: 'Anta';
  font-style: normal;
  font-weight: 400;
  src: url('../assets/fonts/anta/Anta-Regular.ttf') format('truetype');
}

/* Vollkorn */
@font-face {
  font-family: 'Vollkorn';
  font-style: normal;
  font-weight: 600;
  src: url('../assets/fonts/vollkorn/Vollkorn-Bold.ttf') format('truetype');
}

/* Vollkorn */
@font-face {
  font-family: 'Unica One';
  font-style: normal;
  font-weight: 600;
  src: url('../assets/fonts/unica-one/UnicaOne-Regular.ttf') format('truetype');
}

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
  padding: 3rem 0 0 0;
  margin: 0;
}

h1, h2, h3, h4 {
  font-family: "Vollkorn", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  text-transform: uppercase;
  font-size: 160%;
  padding-top: 0;
  margin-top: 0;
}

h3 {
  margin: 40px 0 0;
}

h1 {
  color: #eaeaea;
  font-weight: 400;
  font-style: normal;
  font-size: 330%;
  padding: 10px 0 0 0;
  margin-bottom: 0;
}

@media only screen and (max-width: 60em) {
  h1 {
    font-size: 260%;
    padding: 2rem 2rem 0.5rem 2rem;
    margin-top: -40px;
    line-height: 1.2;
  }
}

.intro-wrapper {
  position: relative;
  background-color: rgba(0,0,0,0.6);
  padding-bottom: 2rem;
  border-bottom: 3px solid red;
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

p.introduction {
  margin: 0 auto;
  font-family: "Unica One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 250%;
  max-width: 800px;

  @media only screen and (max-width: 60em) {
    font-size: 150%;
    padding: 0.5rem 1rem 2rem 1rem;
    margin-bottom: 0;
  }
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
  font-size: 1.25rem;
  line-height: 1.2;
}

.badge-details h4 {
  margin: 5px 0;
  color: white;
  font-family: 'Unica One', sans-serif;
  font-size: 130%;
}

footer {
  text-align: center;
  display: flex;
  justify-content: space-around;
  max-width: 800px;
  margin: 4rem auto 10rem auto;
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
  border: 6px solid rgba(0,0,0,0.6);
  width: 300px;
  position: relative;

  @media only screen and (max-width: 767px) {
    width: 90%;
    margin: 0 auto 0.5rem auto;
  }
}

.sections button:hover {
  cursor: pointer;
  color: red;
}

.sections button.active {
  background-color: #b20909;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='church-on-sunday' fill='%23ff0000' fill-opacity='0.88'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-position: 0 20px;
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
.praxis,
.join {
  animation: fadeIn 0.3s;
}

.intro {
  margin: 1rem auto;

  @media only screen and (min-width: 767px) {
    width: 70%;
    font-size: 180%;
  }
}

.gallery h2 .info {
  flex-basis: 75%;

  @media only screen and (max-width: 767px) {
      flex-basis: 95%;
  }
}

.focii svg {
  width: 150px;
}

.focii span {
  display: inline-block;
  padding: 10px 10px;
  margin-right: 30px;
  background: rgba(0,0,0,0.6);
  position: relative;
}

.focii .banner {
  display: inline-block;
}

/* HTML: <div class="ribbon">Your text content</div> */
.focii .banner {
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  padding-left: 20px;
}
.focii .banner {
  --f: 1.5em; /* control the folded part*/
  --r: .8em; /* control the ribbon shape */
  
  position: absolute;
  bottom: 20px;
  left: calc(-1*var(--f));
  padding-inline: .25em;
  line-height: 1.8;
  background: red;
  border-top: var(--f) solid #0005;
  border-right: var(--r) solid #0000;
  clip-path: 
    polygon(0 100%,0 var(--f),var(--f) 0,
      var(--f) var(--f),100% var(--f),
      calc(100% - var(--r)) calc(50% + var(--f)/2),100% 100%);
}

.focii {
  display: flex;
  margin: 0 auto;
  justify-content: center;
}

@keyframes swoop-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.sparkle {
  height: 30px;
  width: 25px;
  background: #EDC951;
  mask: radial-gradient(#0000 71%, #000 72%) 10000% 10000%/99.5% 99.5%;
  transition: all 0.2s;
  display: inline-block;
  position: absolute;
  left: 20%;
  animation: swoop-up 0.25s linear;
  /* if you will use a different unit than px consider round()
   height: round(__,1px);
   width: round(__,1px);
  */

  @media only screen and (max-width: 767px) {
    visibility: hidden;
  }
}

@media only screen and (max-width: 767px) {
  html, body {
    width: 100vw;
    min-width: 100vw;
    overflow-x: hidden;
  }
}

.session-stage {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.stage {
  margin: 0 auto;
  background-color: rgba(0,0,0,0.6);
  border-radius: 8px;
  padding: 25px 10px 50px 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid red;
  margin: 10px;
  position: relative;
  transition: all 0.2s;
  position: relative;

  @media only screen and (max-width: 767px) {
    width: 100%;
    padding: 30px 0;
  }

  @media only screen and (min-width: 768px) {
    width: 45%;
    max-width: 1400px;
  }
}

.stage.active {
  width: 90vw;
}

.stage p {
  line-height: 1.3;
  font-size: 170%;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  margin: 0 auto 1rem auto;

  @media only screen and (max-width: 767px) {
    width: 85%;
    font-size: 130%;
  }
}

.stage h2 {
  border-bottom: 1px solid red;
}

.stage button {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 50px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  font-weight: bold;
}

.stage button:hover {
  background-color: #830b02;
}

.stage button.secondary {
  background-color: black;
  color: red;
  border: 3px solid red;
}

.stage button.secondary:hover {
  color: white;
  border: 3px solid white;
}

button.small {
  font-size: 65%;
  padding: 5px 10px;
}

.panel-subheader {
  font-size: 20pt !important;
  font-family: "Vollkorn", serif !important;
}

button.begin-session {
  position: absolute;
  bottom: 1rem;
  width: 80%;
  left: 0;
  right: 0;
  margin: auto
}

input {
  padding: 10px;
  color: red;
  font-size: 1.2rem;
}

button.disabled {
  pointer-events: none;
  opacity: 0.7;
}

button.disabled:hover {
  cursor: not-allowed !important;
}

.content-section {
  max-width: 1400px;
  margin: 0 auto;
}

@keyframes wobble {
    from {
        transform: translateY(-6px);
        opacity: 0;
    }
    to {
        transform: translateY(6px);
        opacity: 0.9;
    }
}

@keyframes wobble2 {
    from {
        transform: translateY(-6px);
    }
    to {
        transform: translateY(6px);
    }
}

@keyframes glimmer {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes glimmerDimmer {
    from {
        opacity: 0.2;
    }
    to {
        opacity: 0.5;
    }
}

@keyframes dash {
  to {
    stroke-dashoffset: 50;
    stroke-width: 7px;
  }
}
</style>
