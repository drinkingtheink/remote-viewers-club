import './styles/fonts.css'
import './styles/palette.css'
import './styles/typography.css'
import './styles/buttons.css'
import './styles/motion.css'

import { createApp } from 'vue'
import App from './App.vue'
import { startPointerLight } from './composables/usePointerLight'
import { startPresence } from './composables/usePresence'
import { startSheen } from './composables/useSheen'
import { showPlacard } from './composables/usePlacard'

startPointerLight()
startPresence()
startSheen()

/*
 * Placard copy is the kind of thing that has to be read on the card to be
 * judged, and the cards that matter only come up after a signature has been
 * filed -- which is not a thing to do repeatedly to a live register. So in
 * development the Club can be made to say anything:
 *
 *   rvc.say(['The Club has your mark.', 'You are the 23rd to sign.'])
 */
if (process.env.NODE_ENV !== 'production') {
  window.rvc = { ...(window.rvc || {}), say: showPlacard }
}

createApp(App).mount('#app')
