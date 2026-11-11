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

startPointerLight()
startPresence()
startSheen()

createApp(App).mount('#app')
