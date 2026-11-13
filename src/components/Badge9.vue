<template>
  <div class="grand-ephemeris" :class="{ animate: doAnimate }">
    <!--
      The artwork is the sticker from artwork/grand-ephemeris-sticker.svg,
      geometry and paint order untouched. What changed on the way in: the
      Layer_1 id and the cls-1..cls-5 names are gone, and every element now
      says what it is. The names were read off the measured bounding boxes
      rather than guessed, and each one was checked to carry exactly one ink,
      so a misreading could not have quietly repainted the plate.
    -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 284.68 284.67"
      role="img"
      aria-label="Grand Ephemeris mission patch"
    >
      <defs>
        <!--
          The wakes. Each is anchored at the bottom and grown upward, so a
          trail is laid down from below rather than appearing all at once.
          Closed at rest, which is what makes the plate blank until looked
          at.

          One per trail rather than one shared, so the three can lag the
          star by different amounts: they are what it left behind, and a
          single clip made them arrive together like a curtain going up.
        -->
        <clipPath id="ephemeris-wake-scarlet">
          <rect class="wake wake-scarlet" x="0" y="0" width="284.68" height="284.67" />
        </clipPath>
        <clipPath id="ephemeris-wake-gold">
          <rect class="wake wake-gold" x="0" y="0" width="284.68" height="284.67" />
        </clipPath>
        <clipPath id="ephemeris-wake-azure">
          <rect class="wake wake-azure" x="0" y="0" width="284.68" height="284.67" />
        </clipPath>
        <clipPath id="ephemeris-plate">
          <circle cx="142.34" cy="142.34" r="142" />
        </clipPath>
        <!-- the night field, so the ripples break against its edge -->
        <clipPath id="ephemeris-field">
          <circle cx="142.65" cy="144.42" r="94.49" />
        </clipPath>
        <linearGradient id="ephemeris-sweep" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#fff" stop-opacity="0.2" />
          <stop offset="0.55" stop-color="#fff" stop-opacity="0.2" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>

      <circle class="night" cx="142.65" cy="144.42" r="94.49"/>
      <!--
        The planet and the world it hangs beside, together because they
        arrive together. They are already consecutive in the plate's paint
        order, so grouping them changes nothing about how it draws, and
        clipped to the night field so they can be parked outside it.
      -->
      <g class="worlds" clip-path="url(#ephemeris-field)">
      <path class="planet-ring" d="M64.03,134.77c-3.94-4.27-10.6-4.53-14.87-.59-2.75,2.54-3.94,6.35-3.13,10-3.89,3-6.07,5.73-5.33,7.1,1.16,2.13,8.93.16,17.35-4.41s14.32-10,13.17-12.13c-.68-1.2-3.42-1.1-7.19.03Z"/>
      <path class="planet-body" d="M51.19,152.27c5.11,2.77,11.49.88,14.27-4.22.67-1.23,1.09-2.59,1.22-3.99-2.22,1.54-4.52,2.95-6.89,4.24-2.78,1.51-5.65,2.84-8.6,3.97Z"/>
      <path class="land" d="M74.95,77.71c2.39-1.31,5.23-1.48,7.73-1.63l7.58-.46c-12.72-7.5-29.11-3.27-36.62,9.45-4.01,6.79-4.81,15.01-2.19,22.45l.28-.46c.68-1.18,1.39-2.39,2.76-2.69,1.15-.12,2.31.18,3.26.85.44.25.9.47,1.37.65,2.52.77,5.19-.65,5.95-3.18.05-.16.09-.31.12-.47.08-.89.04-1.79-.14-2.67-.05-.4-.11-.8-.15-1.21-.58-2.06.62-4.21,2.68-4.79.18-.05.36-.09.54-.11,2.56-.61,5.25-.44,7.71.49,1.16.48,2.29,1.03,3.37,1.67,1.06.62,2.16,1.17,3.3,1.63,2,.74,4.81,1,6.53-.69-.4-2.16-1.71-4.05-3.6-5.18-1.71-.86-3.56-1.4-5.46-1.59-.73-.13-1.49-.25-2.23-.41-1.63-.36-5.51-1.56-6.35-4.87-.71-2.79,1.29-5.52,3.56-6.78Z"/>
      <path class="land" d="M76.68,125.4c14.76.01,26.74-11.94,26.75-26.71,0-5.58-1.73-11.02-4.97-15.55-.2.18-.42.35-.65.49-.58.35-1.22.6-1.89.73-1.61.32-3.28.15-4.89.49s-3.25,1.42-3.45,3,.95,2.88,2.21,3.74c2.37,1.66,5.43,2.24,7.47,4.24,1.56,1.51,2.22,3.72,1.74,5.83-.54,2.12-2.37,3.66-4.55,3.83-1.83.08-3.5-.93-5.17-1.69-3.73-1.68-7.89-2.21-11.92-1.5-1.07.1-2.08.56-2.87,1.3-1.22,1.35-.83,3.45-.36,5.21-.87-1.11-2.86-.37-3.32,1-.31,1.39,0,2.85.85,4,.82,1.38,1.83,2.65,3,3.76-2.59-1.3-5.36-2.22-8.21-2.74-1.45-.24-3.12-.31-4.18.69-.61.67-1,1.5-1.13,2.4-.16.75-.24,1.51-.26,2.28,4.58,3.38,10.11,5.2,15.8,5.2Z"/>
      </g>

      <path clip-path="url(#ephemeris-wake-gold)" class="trail-gold" d="M139.77,108.33c0,.16-.25,1.35-.88,3.56.18-1.1-3.29,12.51-3.28,12.4,0,.12,3.43-13.29,3.08-11.72-2.11,7.13-8,23.17-23,47.47-21,33.91-62.47,30.51-62.47,30.51-1.27-.19.77,2.94,2.94,5.88h-.11c-2.39-.23,7.25,10.49,7.25,10.49,55.63-9.13,71.84-75.22,75.17-92.68.86-3.53,1.26-5.69,1.3-5.91Z"/>
      <path class="rim-azure" d="M142.68,44.38c54.16.02,98.05,43.94,98.03,98.09-.02,54.16-43.94,98.05-98.09,98.03s-98.05-43.94-98.03-98.09c0-26,10.34-50.93,28.72-69.31,18.36-18.46,43.34-28.8,69.37-28.72M142.68,2.83C65.55,2.8,3.01,65.31,2.98,142.45c-.02,77.13,62.49,139.68,139.62,139.7,77.13.02,139.68-62.49,139.7-139.62v-.09c-.02-77.1-62.52-139.59-139.62-139.61Z"/>
      <path class="rim-pale" d="M142.68,265.45c-67.93,0-123-55.07-123-123S74.75,19.45,142.68,19.45s123,55.07,123,123c-.09,67.89-55.11,122.91-123,123ZM142.68,20.61c-67.28-.02-121.85,54.51-121.87,121.79-.02,67.28,54.51,121.85,121.79,121.87,67.28.02,121.85-54.51,121.87-121.79v-.04c-.09-67.23-54.56-121.71-121.79-121.83Z"/>
      <path class="rim-pale" d="M142.68,266.05c-68.27.02-123.62-55.31-123.64-123.58S74.36,18.84,142.62,18.83c68.27-.02,123.62,55.31,123.64,123.58v.03c-.08,68.22-55.36,123.52-123.58,123.61ZM20.23,142.44c.02,67.61,54.85,122.4,122.46,122.38,67.58-.02,122.36-54.8,122.38-122.38,0,67.61-54.83,122.41-122.44,122.4-67.6,0-122.39-54.81-122.4-122.4h0ZM142.68,21.21c-66.95-.02-121.24,54.25-121.26,121.2-.02,66.95,54.25,121.24,121.2,121.26,66.95.02,121.24-54.25,121.26-121.2v-.03c-.07-66.91-54.29-121.14-121.2-121.23Z"/>
      <path class="rim-night" d="M142.73,50.09c51.16,0,92.63,41.47,92.63,92.63,0,51.16-41.47,92.63-92.63,92.63-51.16,0-92.63-41.47-92.63-92.63,0-24.57,9.76-48.13,27.13-65.5,17.33-17.43,40.92-27.2,65.5-27.13M142.73,44.15c-54.44,0-98.57,44.13-98.57,98.57s44.13,98.57,98.57,98.57,98.57-44.13,98.57-98.57h0c0-54.44-44.13-98.57-98.57-98.57h0Z"/>
      <!-- the scarlet trail's own shadow, so it is clipped by the same wake:
           left unclipped it stayed behind when the trail went and cut a navy
           gash clean through the blue rim and the white rule -->
      <path clip-path="url(#ephemeris-wake-scarlet)" class="night-shadow" d="M142.88,100.02c0,.23.11,1.93,0,5.16-.11-1.57-.2-2.49-.22-2.64,0,.17.14,1.37.18,3.63-.5,10.46-3.18,34.34-15.78,72.64-17.61,53.44-76.38,63.02-76.38,63.02-1.83.18,2.06,3.74,6.07,7h-.07c-3.4.5,13.62,11.83,13.62,11.83,74.12-31.47,74.14-127.18,72.82-152.14-.03-5.1-.22-8.19-.24-8.5Z"/>
      <path class="rim-scarlet" d="M142.35,284.67C63.75,284.68.01,220.97,0,142.36c0-37.76,14.99-73.97,41.68-100.66,55.58-55.59,145.7-55.6,201.29-.01,55.59,55.58,55.6,145.7.01,201.29-26.63,26.78-62.87,41.79-100.64,41.69ZM142.35,5.95C67.03,5.92,5.94,66.97,5.92,142.29c-.01,36.21,14.38,70.94,40,96.54,53.28,53.26,139.64,53.25,192.9-.02,53.26-53.28,53.25-139.64-.02-192.91h0c-25.52-25.66-60.25-40.05-96.44-39.95Z"/>
      <path clip-path="url(#ephemeris-wake-scarlet)" class="trail-scarlet" d="M142.95,94.22c0,.22.09,2-.08,5.21-.11-1.59-.2,14.13-.22,14,0,.18.13-15.25.16-13-.68,10.57-3.9,34.73-18.11,73.58-19.83,54.21-83.95,64.59-83.95,64.59-2,.2,2.21,3.75,6.54,7h-.17c-3.7.54,14.69,11.77,14.69,11.77,81.13-32.72,82.36-129.42,81.24-154.62.08-5.11-.08-8.22-.1-8.53Z"/>
      <path clip-path="url(#ephemeris-wake-azure)" class="trail-azure" d="M177.12,218.7c7.2-3.48,11.21-5.81,13.67-7.72-11.69-9.43-19.91-21.91-26.17-39-14.09-38.53-17.37-62.6-18.09-73.31v2.24-2.65c0-.8,0-1.19-.06-.87-.12-1.73-.14-3.47-.08-5.21,0,.31-.18,3.43-.1,8.59-.85,18.66-2.54,75.86,30.83,117.93Z"/>
      <!--
        The shock of its arrival, thrown off the star's own centre (142.6,
        70.4 -- the middle of the group's measured box). Clipped to the night
        field so the rings break against the horizon instead of running out
        over the border rules, and placed before the star so they read as
        coming from behind it.
      -->
      <g class="ripples" clip-path="url(#ephemeris-field)">
        <circle class="ripple" cx="142.6" cy="70.4" r="4" />
        <circle class="ripple" cx="142.6" cy="70.4" r="4" />
        <circle class="ripple" cx="142.6" cy="70.4" r="4" />
      </g>

      <g class="star">
        <g class="star-spin">
          <polygon class="star-pale" points="136.36 64.44 142.03 49.09 148.37 64.18 163.73 69.86 148.63 76.19 142.96 91.55 136.62 76.46 121.26 70.78 136.36 64.44"/>
          <polygon class="star-gold" points="148.59 64.39 142.65 50.25 142.65 90.51 143.18 91.76 148.85 76.4 163.94 70.07 148.59 64.39"/>
          <polygon class="star-pale" points="163.94 70.07 142.35 70.32 148.85 76.4 163.94 70.07"/>
          <polygon class="star-gold" points="121.26 70.78 142.35 70.32 136.62 76.46 121.26 70.78"/>
        </g>
      </g>
      <polygon class="star-minor" points="96.1 147.3 99.74 148.73 96.04 150.2 94.39 163.14 93.14 150.21 89.5 148.77 93.21 147.31 94.85 134.98 96.1 147.3"/>
      <polygon class="star-minor" points="145.81 198.11 150.9 200.12 145.72 202.16 143.42 220.24 141.67 202.17 136.59 200.17 141.76 198.12 144.05 180.9 145.81 198.11"/>
      <path class="charge-face" d="M190.73,87.15c3.91-.01,7.8.6,11.52,1.81,2.29.73,4.42,1.87,6.3,3.37,2.68,2.16,4.42,5.28,4.85,8.7.31,2.53.17,5.09-.42,7.57-.77,3.3-1.92,6.5-3.43,9.53-1.81,3.63-3.81,7.16-6,10.57-1.84,3.04-3.86,5.95-6.06,8.74-1.23,1.62-2.66,3.08-4.25,4.34-.53.39-1.1.72-1.7,1-.76.36-1.63.36-2.39,0-1-.45-1.91-1.08-2.69-1.84-1.62-1.52-3.1-3.2-4.4-5-2.91-3.99-5.58-8.15-8-12.46-1.87-3.15-3.47-6.46-4.78-9.88-1.02-2.61-1.7-5.35-2-8.14-.3-2.55,0-5.13.86-7.54,1.09-2.8,3.07-5.16,5.64-6.72,2.55-1.56,5.36-2.63,8.29-3.18,2.85-.59,5.75-.88,8.66-.87Z"/>
      <path class="charge-bolt" d="M190.45,108.04h5.53c1.76,0,2.06.62,1.44,2.15-2.23,5.55-4.5,11.09-6.82,16.6-.22.53-.92.86-1.39,1.28-.34-.61-.93-1.21-.95-1.83-.1-3-.05-5.93-.05-9.17h-5.32c-1.74,0-2.23-.6-1.52-2.35,2.19-5.36,4.37-10.73,6.63-16.06.27-.64,1-1.08,1.55-1.6.4.61.69,1.29.86,2,.1,2.93.04,5.83.04,8.98Z"/>
      <polygon class="star-minor" points="186.85 180.01 188.76 180.77 186.81 181.53 185.95 188.33 185.29 181.54 183.38 180.78 185.33 180.02 186.19 173.55 186.85 180.01"/>
      <polygon class="star-minor" points="209.89 167.17 213.68 168.67 209.82 170.19 208.1 183.66 206.81 170.2 203.01 168.7 206.87 167.18 208.58 154.34 209.89 167.17"/>

      <!-- a light crossing the plate, on the beat the other badges keep -->
      <g clip-path="url(#ephemeris-plate)">
        <rect class="sweep" x="-285" y="0" width="285" height="285" fill="url(#ephemeris-sweep)" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'badge-9',
  data() {
    return {
      intervalId: null,
      doAnimate: false
    }
  },
  mounted() {
    // the cadence the rest of the plates keep: a pass on arrival, then every
    // so often, so a wall of them never flares in unison
    this.intervalId = setInterval(() => {
      this.doAnimate = true
      setTimeout(() => {
        this.doAnimate = false
      }, 8000)
    }, 15000)

    this.doAnimate = true
    setTimeout(() => {
      this.doAnimate = false
    }, 5000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  }
}
</script>

<style scoped>
/* --- the frame ---------------------------------------------------------- */

.rim-scarlet { fill: var(--ink-red); }
.rim-pale { fill: var(--ink-pale); }
.rim-azure { fill: var(--ink-blue); }
.rim-night { fill: var(--ink-navy); }

/* --- the night it sits on ----------------------------------------------- */

.night { fill: var(--ink-navy); }
.night-shadow { fill: var(--ink-navy); }

/* --- the world ---------------------------------------------------------- */

.land { fill: var(--ink-blue); }
.planet-body { fill: var(--ink-blue); }
.planet-ring { fill: var(--ink-blue); }

/*
 * Dormant, they have not come round yet.
 *
 * Parked off the left of the night field and clipped to it, so they are
 * genuinely out of frame rather than faded out -- the plate reads as an
 * empty sky waiting, which is the same idea as the missing star and the
 * undrawn trails.
 *
 * Measured: the pair's right edge is at x103.4 and the field's left edge at
 * x48.2, so 55.3 units takes them out, and 62 leaves a margin so no corner
 * of the ring is still showing.
 */
.worlds {
  transform: translateX(-62px);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.grand-ephemeris:is(.animate, :hover) .worlds {
  transform: translateX(0);
  transition-delay: 120ms;
}

/* --- the trails --------------------------------------------------------- */

.trail-gold { fill: #edd337; }
.trail-scarlet { fill: var(--ink-red); }
.trail-azure { fill: var(--ink-blue); }

/* --- the charge --------------------------------------------------------- */

.charge-face { fill: #edd337; }

/*
 * Dormant, the plate is cold.
 *
 * Desaturated and down a stop, so the off state reads as unlit rather than
 * as the finished badge with pieces missing -- at full strength the rim was
 * shouting while the field behind it was empty. Looking at it warms it up.
 *
 * Swapped inks rather than `filter: saturate() brightness()` on the svg,
 * which is what this was first. The filter looked right and rendered soft:
 * Chrome rasterizes a filtered subtree once and scales the result, so on a
 * dense screen the whole plate came out blurred, rim and lettering with it.
 * A/B-ing the same capture with the filter off was the tell. These are that
 * filter's exact output computed per ink, so the colour is unchanged and
 * the edges stay vector.
 */
.grand-ephemeris {
  --ink-navy: #0b121b;
  --ink-blue: #324f62;
  --ink-red:  #66292b;
  --ink-pale: #bdbdbd;
}

.grand-ephemeris:is(.animate, :hover) {
  --ink-navy: #011b39;
  --ink-blue: #1275b4;
  --ink-red:  #eb1c24;
  --ink-pale: #ffffff;
}

.night, .night-shadow, .rim-night,
.land, .planet-body, .planet-ring, .rim-azure, .trail-azure,
.rim-scarlet, .trail-scarlet,
.rim-pale, .star-pale, .star-minor {
  transition: fill 600ms cubic-bezier(0.33, 1, 0.68, 1);
}

/*
 * And the charge is down to its bolt.
 *
 * The gold pick is the issued insignia; dormant, only the mark itself is
 * there, struck straight on the night. It has to be re-inked to do that --
 * the bolt is painted navy to read as a hole in the gold, and navy on navy
 * is nothing at all -- so it carries the gilt until the pick comes back
 * under it.
 *
 * The pick leads by a quarter second on the way in, so the bolt always has
 * something to be a hole in and never darkens onto bare sky.
 */
.charge-face {
  opacity: 0;
  transition: opacity 420ms cubic-bezier(0.33, 1, 0.68, 1);
}

.charge-bolt {
  fill: #837853;
  transform-box: fill-box;
  transform-origin: center;
  /* struck in the middle of the plate, big, with nothing else to look at.
     Measured: its own centre is (189.4, 112.6) and the night field's is
     (142.65, 144.42), so this is the difference between the two. */
  transform: translate(-46.7px, 31.9px) scale(2.6);
  transition: transform 760ms cubic-bezier(0.33, 1, 0.68, 1) 300ms,
              fill 420ms cubic-bezier(0.33, 1, 0.68, 1);
}

/*
 * Lit, it goes and sits down.
 *
 * The bolt flies back to its seat, the pick materialises underneath it, and
 * only then does the bolt darken -- so it is never navy on bare navy, which
 * is invisible, and it always has something to be a hole in.
 *
 * Each direction is sequenced by the delays in the state being moved to, so
 * leaving reverses it properly: the pick goes first and the bolt only then
 * sets off, rather than sliding out of a pick that is still there.
 */
.grand-ephemeris:is(.animate, :hover) .charge-face {
  opacity: 1;
  transition-delay: 520ms;
}

.grand-ephemeris:is(.animate, :hover) .charge-bolt {
  fill: #011b39;
  transform: translate(0, 0) scale(1);
  transition: transform 760ms cubic-bezier(0.33, 1, 0.68, 1),
              fill 420ms cubic-bezier(0.33, 1, 0.68, 1) 620ms;
}

/* --- the sky ------------------------------------------------------------ */

.star-pale { fill: var(--ink-pale); }
.star-gold { fill: #edd337; }
.star-minor { fill: var(--ink-pale); }

/* --- dormant ------------------------------------------------------------ */

/*
 * The plate before anybody looks at it.
 *
 * It is an instrument for recording something, so at rest it has recorded
 * nothing: no star, no trails behind it, and an empty sky -- the small
 * stars are out too, so the field is bare rather than lightly furnished. What
 * remains is the plate itself -- the border rules, the ringed planet, the
 * land and the charge -- because those are its furniture, not the event.
 *
 * Which makes the pass the act of recording rather than decoration laid
 * over a finished picture, and gives this badge the off state the other
 * eight have: something the viewer completes by looking at it.
 */
.star {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
}

.wake {
  transform-box: fill-box;
  transform-origin: bottom;
  transform: scaleY(0);
}

.star-minor {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
}

@keyframes ephemeris-flare {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.86; }
}

/* --- the launch --------------------------------------------------------- */

/*
 * The plate is the record of something that already happened: a star went
 * up and left three trails fanning out behind it. The pass replays it.
 *
 * The star climbs from below and turns as it goes, and the wake is grown
 * from the bottom so the trails are laid down behind it rather than
 * arriving all at once. Both run on the same clock and the wake is full at
 * the moment the star reaches its place, which is what sells the trails as
 * its own and not as decoration that happens to be nearby.
 */
/*
 * Hover as well as the timed pass, which is how the other eight are wired.
 * Leaving and returning replays it, since the rule goes with the hover and
 * comes back fresh.
 *
 * Two animations rather than one: the launch brings the star in and holds
 * it on `both`, then the resting breath takes over once it has landed.
 * Later entries win the properties they share, so the delayed flare picks
 * up opacity without disturbing the transform the launch left behind.
 */
.grand-ephemeris:is(.animate, :hover) .star {
  animation: ephemeris-launch 1.5s cubic-bezier(0.22, 1, 0.36, 1) both,
             ephemeris-flare 6.5s ease-in-out 2.4s infinite;
}

@keyframes ephemeris-launch {
  0% { transform: translateY(190px) rotate(-200deg) scale(0.4); opacity: 0; }
  12% { opacity: 1; }
  /* a little past the mark, then back: it is arriving, not being placed.
     The tumble is spent by here, so the axis spin below starts from square
     and the two turns are never running at once. */
  76% { transform: translateY(-7px) rotate(0deg) scale(1.07); opacity: 1; }
  100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
}

/*
 * At the top it turns on its own axis.
 *
 * A vertical axis, not the flat tumble of the climb -- so it is scaleX
 * stepped through the cosine of the turn, which is what the width of a
 * spinning flat thing actually does. Edge-on at the quarters, and mirrored
 * at the halves, where the mirror genuinely is the back: the star is split
 * pale against gold down its length, so the lit side swapping over is the
 * whole tell. A flat rotate() would only be the climb again.
 *
 * Its own <g> inside the star rather than more terms in the launch
 * keyframes, because the two want different clocks: the climb eases to a
 * stop while this one wants even turns slowing down, and a single transform
 * list cannot hold both.
 *
 * Two turns, the second given nearly twice the time of the first, so it
 * settles rather than stopping dead. Timing is linear -- the keyframe
 * spacing is doing the deceleration, and an ease on top would fight it.
 */
.star-spin {
  transform-box: fill-box;
  transform-origin: center;
}

.grand-ephemeris:is(.animate, :hover) .star-spin {
  animation: ephemeris-spin 1100ms linear 820ms both;
}

@keyframes ephemeris-spin {
  0%    { transform: scaleX(1); }
  4.8%  { transform: scaleX(0.707); }
  9.5%  { transform: scaleX(0.01); }
  14.3% { transform: scaleX(-0.707); }
  19%   { transform: scaleX(-1); }
  23.8% { transform: scaleX(-0.707); }
  28.5% { transform: scaleX(-0.01); }
  33.3% { transform: scaleX(0.707); }
  38%   { transform: scaleX(1); }
  45.8% { transform: scaleX(0.707); }
  53.5% { transform: scaleX(0.01); }
  61.3% { transform: scaleX(-0.707); }
  69%   { transform: scaleX(-1); }
  76.8% { transform: scaleX(-0.707); }
  84.5% { transform: scaleX(-0.01); }
  92.3% { transform: scaleX(0.707); }
  100%  { transform: scaleX(1); }
}

/*
 * The rings it knocks loose.
 *
 * Three, on the same cue as the spin, so the apex is one event: the star
 * arrives, turns, and the sky rings. r is an animatable geometry property,
 * so these expand honestly from the centre instead of being a scaled circle
 * whose stroke would thicken as it grew -- the stroke thins as it goes out
 * instead, which is how a ring spends itself.
 */
.ripple {
  fill: none;
  stroke: #fff;
  stroke-width: 2.4;
  opacity: 0;
}

/*
 * It keeps ringing. One shock at the apex read as a hiccup; the plate is of
 * a star, and a star goes on radiating, so the rings repeat for as long as
 * the badge is lit -- eight seconds on the timed pass, or as long as the
 * pointer stays.
 *
 * In bursts, though, not a drip: the three go out close together -- 180ms
 * apart, so they read as one event arriving in three parts -- and then the
 * sky is empty for three and a half seconds before the next burst. A ring
 * every 600ms forever was busier than the plate wants.
 *
 * So the cycle is 4.5s and each circle is only travelling for the first
 * 1.2s of it. The timed pass is lit for eight seconds, which is two bursts;
 * a pointer that stays gets one every 4.5s. Full shorthands, for the reason
 * given under the small stars.
 */
.grand-ephemeris:is(.animate, :hover) .ripple { animation: ephemeris-ripple 4500ms cubic-bezier(0.33, 1, 0.68, 1) 820ms infinite; }
.grand-ephemeris:is(.animate, :hover) .ripple:nth-child(2) { animation: ephemeris-ripple 4500ms cubic-bezier(0.33, 1, 0.68, 1) 1000ms infinite; stroke: #edd337; }
.grand-ephemeris:is(.animate, :hover) .ripple:nth-child(3) { animation: ephemeris-ripple 4500ms cubic-bezier(0.33, 1, 0.68, 1) 1180ms infinite; }

@keyframes ephemeris-ripple {
  0% { r: 4; opacity: 0; stroke-width: 2.4; }
  2% { opacity: 0.8; }
  /* out and spent inside 1.2s; the long tail is the gap before the next burst */
  27%, 100% { r: 86; opacity: 0; stroke-width: 0.4; }
}

/*
 * The trails run on a gentler curve than the star and start after it, so
 * they are still filling in once it has arrived -- the star outruns its own
 * wake, which is the only way three trails fanning out behind one object
 * reads as cause and effect.
 *
 * Staggered inward to outward: the scarlet sits closest to the line of
 * flight, the azure furthest off it, so they peel away in that order.
 */
/*
 * Each climbs only as far as it needs to.
 *
 * The artwork leaves every trail short of the star: measured, their tips
 * reach y94.2, y108.3 and y92.2 against a star sitting at y70.4. So the
 * clip stops just clear of its own trail's tip rather than at full height,
 * where it would be sixty units above anything and a small movement would
 * show nothing at all. --reach is that ceiling, per trail.
 */
.wake-scarlet { --reach: 0.70; }  /* tip y94.2  */
.wake-gold    { --reach: 0.65; }  /* tip y108.3 */
.wake-azure   { --reach: 0.71; }  /* tip y92.2  */

.grand-ephemeris:is(.animate, :hover) .wake-scarlet {
  animation: ephemeris-wake 1.75s cubic-bezier(0.33, 1, 0.68, 1) 140ms both,
             ephemeris-struggle 2.3s ease-in-out 1890ms infinite;
}

.grand-ephemeris:is(.animate, :hover) .wake-gold {
  animation: ephemeris-wake 1.85s cubic-bezier(0.33, 1, 0.68, 1) 260ms both,
             ephemeris-struggle 2.9s ease-in-out 2110ms infinite;
}

.grand-ephemeris:is(.animate, :hover) .wake-azure {
  animation: ephemeris-wake 1.95s cubic-bezier(0.33, 1, 0.68, 1) 400ms both,
             ephemeris-struggle 2.6s ease-in-out 2350ms infinite;
}

@keyframes ephemeris-wake {
  0% { transform: scaleY(0); }
  100% { transform: scaleY(var(--reach)); }
}

/*
 * And then it cannot close the gap.
 *
 * Once up, each trail works at the last stretch and keeps losing it --
 * falling back, lunging to within a few units of where it was, falling
 * further. The beats are deliberately uneven, because an even one is
 * breathing and this is meant to be effort.
 *
 * It picks up where the climb left off: the later animation wins transform,
 * and both are written against --reach, so there is no step between them.
 * The three run on 2.3s, 2.9s and 2.6s so they strain out of step.
 */
@keyframes ephemeris-struggle {
  0%, 100% { transform: scaleY(var(--reach)); }
  20% { transform: scaleY(calc(var(--reach) - 0.070)); }
  /* nearly has it back */
  38% { transform: scaleY(calc(var(--reach) - 0.010)); }
  60% { transform: scaleY(calc(var(--reach) - 0.085)); }
  80% { transform: scaleY(calc(var(--reach) - 0.025)); }
}

/*
 * The rest of the sky catches it.
 *
 * Each small star flares as the wake rises past it, so they light bottom to
 * top rather than all at once -- the passage wakes them. Their order comes
 * from where they sit: y181, then y174, y154 and y135.
 *
 * The delays are stretched rather than literal. The wake clears all four
 * inside forty milliseconds of each other, which is no cascade at all; this
 * keeps the order and gives it room to be seen.
 *
 * Scale is safe here where it was not on the big star: each of these is a
 * single polygon, so it turns about its own centre and stays whole.
 */
@keyframes ephemeris-shimmer {
  /* opens from nothing, since dormant leaves the sky bare: each small star
     is struck by the wake passing it rather than merely brightened */
  0% { transform: scale(1); opacity: 0; }
  45% { transform: scale(1.55); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/*
 * Every rule below sets the whole `animation` shorthand rather than picking
 * off longhands.
 *
 * :nth-of-type() weighs the same as a class, so `.star-minor:nth-of-type(2)`
 * ties `.animate .star-minor` and source order decides. A bare
 * animation-duration in the resting rules therefore reached straight into
 * the pass and stretched three of the four flares to 7.4s, 4.3s and 8.1s --
 * they swelled instead of sparking, and only the one star with no resting
 * override was right. The shorthand resets what it does not mention, so
 * neither state can leak into the other whichever one wins.
 */
/* lowest first, following the wake up the plate: y181, y174, y154, y135.
   Each flares, then settles into a twinkle of its own length, so the four
   drift apart again rather than blinking in step. */
.grand-ephemeris:is(.animate, :hover) .star-minor:nth-of-type(2) { animation: ephemeris-shimmer 900ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both, ephemeris-twinkle 1.7s ease-in-out 1.1s infinite; }
.grand-ephemeris:is(.animate, :hover) .star-minor:nth-of-type(3) { animation: ephemeris-shimmer 900ms cubic-bezier(0.22, 1, 0.36, 1) 250ms both, ephemeris-twinkle 2.3s ease-in-out 1.2s infinite; }
.grand-ephemeris:is(.animate, :hover) .star-minor:nth-of-type(4) { animation: ephemeris-shimmer 900ms cubic-bezier(0.22, 1, 0.36, 1) 360ms both, ephemeris-twinkle 1.9s ease-in-out 1.3s infinite; }
.grand-ephemeris:is(.animate, :hover) .star-minor:nth-of-type(1) { animation: ephemeris-shimmer 900ms cubic-bezier(0.22, 1, 0.36, 1) 470ms both, ephemeris-twinkle 2.6s ease-in-out 1.4s infinite; }

/*
 * Quicker, and it shrinks as it dims -- opacity alone read as a light on a
 * dimmer, where a star going in and out wants to look like it is changing
 * size too. The scale is safe on these: each is a single polygon turning
 * about its own centre.
 */
@keyframes ephemeris-twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.68); }
}

/* --- the pass ----------------------------------------------------------- */

/* Parked off the left edge and only sent across while `animate` is set, so
   the plate is still until it is looked at. */
.sweep {
  opacity: 0;
}

/* held until the star has landed, so the two do not talk over each other */
.grand-ephemeris:is(.animate, :hover) .sweep {
  animation: ephemeris-pass 1.9s cubic-bezier(0.33, 1, 0.68, 1) 2.2s;
}

@keyframes ephemeris-pass {
  0% { transform: translateX(0); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateX(640px); opacity: 0; }
}

/*
 * Reduced motion gets the plate finished and still. Dormancy is withheld
 * along with the pass -- it only means anything as the before of an after,
 * and leaving the star switched off for a reader who will never see it
 * arrive would just be a badge missing its subject.
 */
@media (prefers-reduced-motion: reduce) {
  .star,
  .star-minor,
  .ripple,
  .grand-ephemeris:is(.animate, :hover) :is(.star, .star-spin, .star-minor, .ripple, .wake, .sweep) {
    animation: none;
  }

  .star,
  .star-minor { opacity: 1; }
  .grand-ephemeris {
    --ink-navy: #011b39;
    --ink-blue: #1275b4;
    --ink-red:  #eb1c24;
    --ink-pale: #ffffff;
  }

  .charge-face { opacity: 1; }
  .charge-bolt { fill: #011b39; transform: none; }
  .wake { transform: scaleY(var(--reach, 1)); }
}
</style>
