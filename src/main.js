import './styles/fonts.css'
import './styles/palette.css'
import './styles/typography.css'
import './styles/buttons.css'
import './styles/binding-variants.css'

import { createApp } from 'vue'
import App from './App.vue'

// Temporary, for choosing a binding: ?binding=gothic|herringbone|panel.
// Goes away with src/styles/binding-variants.css once one is picked.
const binding = new URLSearchParams(window.location.search).get('binding')
if (binding) {
  document.documentElement.dataset.binding = binding
}

createApp(App).mount('#app')
