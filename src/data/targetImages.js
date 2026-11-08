// Resolved URLs for every remote viewing target photo, keyed by the `image`
// field in latLongSites.js. Imports are explicit on purpose: a site whose photo
// is missing or misnamed fails the build instead of silently rendering nothing.
import angkorWat from '../assets/angkor-wat.webp'
import antelopeCanyon from '../assets/antelope-canyon.webp'
import ayersRock from '../assets/ayers-rock.webp'
import bambooGrove from '../assets/bamboo-grove.webp'
import bioluminescentBay from '../assets/bioluminescent-bay.webp'
import blueHole from '../assets/blue-hole.webp'
import cappadocia from '../assets/cappadocia.webp'
import easterIsland from '../assets/easter-island.webp'
import grandCanyon from '../assets/grand-canyon.webp'
import greatBarrierReef from '../assets/great-barrier-reef.webp'
import haLongBay from '../assets/ha-long-bay.webp'
import lakeMoraine from '../assets/lake-moraine.webp'
import machuPicchu from '../assets/machu-picchu.jpg'
import mountEverest from '../assets/mount-everest.webp'
import namibDesert from '../assets/namib-desert.webp'
import pamukkale from '../assets/pamukkale.webp'
import petra from '../assets/petra.webp'
import salarDeUyuni from '../assets/salar-de-uyuni.webp'
import santorini from '../assets/santorini.webp'
import serengeti from '../assets/serengeti.webp'
import tajMahal from '../assets/taj-mahal.webp'
import tromso from '../assets/tromso.webp'
import venice from '../assets/venice.webp'
import victoriaFalls from '../assets/victoria-falls.webp'
import zhangjiajie from '../assets/zhangjiajie.webp'

const targetImages = {
  'angkor-wat.webp': angkorWat,
  'antelope-canyon.webp': antelopeCanyon,
  'ayers-rock.webp': ayersRock,
  'bamboo-grove.webp': bambooGrove,
  'bioluminescent-bay.webp': bioluminescentBay,
  'blue-hole.webp': blueHole,
  'cappadocia.webp': cappadocia,
  'easter-island.webp': easterIsland,
  'grand-canyon.webp': grandCanyon,
  'great-barrier-reef.webp': greatBarrierReef,
  'ha-long-bay.webp': haLongBay,
  'lake-moraine.webp': lakeMoraine,
  'machu-picchu.jpg': machuPicchu,
  'mount-everest.webp': mountEverest,
  'namib-desert.webp': namibDesert,
  'pamukkale.webp': pamukkale,
  'petra.webp': petra,
  'salar-de-uyuni.webp': salarDeUyuni,
  'santorini.webp': santorini,
  'serengeti.webp': serengeti,
  'taj-mahal.webp': tajMahal,
  'tromso.webp': tromso,
  'venice.webp': venice,
  'victoria-falls.webp': victoriaFalls,
  'zhangjiajie.webp': zhangjiajie,
}

if (process.env.NODE_ENV !== 'production') {
  // Catches the other half of the problem: a site whose `image` field doesn't
  // match any key above, which would otherwise just render a blank target.
  const sites = require('./latLongSites').default
  const missing = sites.filter(site => !targetImages[site.image])
  if (missing.length) {
    console.warn('[rvc] sites with no target photo:', missing.map(site => site.name))
  }
}

export default targetImages
