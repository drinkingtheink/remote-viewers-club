<template>
  <Transition name="placard" mode="out-in">
    <div
      v-if="current"
      :key="current.id"
      class="placard-stage"
      role="status"
      aria-live="polite"
      @click="dismiss"
    >
      <div class="placard">
        <!-- the frame is drawn, not bordered: an intertitle's rule steps in
             twice and puts a lozenge in each corner, which no amount of
             border-style will do -->
        <svg
          class="placard-frame"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="10" y="10" width="380" height="280" rx="2" />
          <rect x="18" y="18" width="364" height="264" rx="1" class="is-thin" />
          <g class="placard-corners">
            <rect x="6" y="6" width="8" height="8" transform="rotate(45 10 10)" />
            <rect x="386" y="6" width="8" height="8" transform="rotate(45 390 10)" />
            <rect x="6" y="286" width="8" height="8" transform="rotate(45 10 290)" />
            <rect x="386" y="286" width="8" height="8" transform="rotate(45 390 290)" />
          </g>
        </svg>

        <p v-for="(line, i) in current.lines" :key="i" class="placard-line">{{ line }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { usePlacardQueue } from '../composables/usePlacard'

const { queue, drop } = usePlacardQueue()

/*
 * What is on screen is the front of the queue, read straight off it.
 *
 * This hung a `current` ref off a watcher before, and the watcher never
 * fired: the card stayed enqueued and nothing was ever shown. A computed
 * cannot fail that way -- the template depends on the queue itself, so
 * there is no second copy of the state to fall out of step with it.
 *
 * mode="out-in" gives the beat of dark between cards. Two placards
 * cross-fading would read as a glitch; a projector shows one, then the next.
 */
const current = computed(() => queue.value[0] || null)

let holdTimer = null
const clear = () => {
  clearTimeout(holdTimer)
  holdTimer = null
}

watch(
  current,
  (card) => {
    clear()
    if (!card) return
    holdTimer = setTimeout(() => drop(card.id), card.hold)
  },
  { immediate: true }
)

function dismiss() {
  if (current.value) drop(current.value.id)
}

onBeforeUnmount(clear)
</script>

<style scoped>
.placard-stage {
  position: fixed;
  inset: 0;
  z-index: 9500;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  /* Dark enough to stop the page competing, not so dark it reads as a modal
     the reader has to deal with. Clicking anywhere takes the card away. */
  background: rgba(6, 5, 4, 0.72);
  cursor: pointer;
}

.placard {
  position: relative;
  display: grid;
  align-content: center;
  gap: 0.9rem;
  width: min(92vw, 34rem);
  aspect-ratio: 4 / 3;
  padding: 3.5rem 3rem;
  box-sizing: border-box;
  text-align: center;
  background: radial-gradient(118% 100% at 50% 44%, #17120d 0%, #080605 100%);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.7);
}

.placard-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* stretched to the card with preserveAspectRatio="none", while
     non-scaling-stroke keeps the rule an even weight however far it goes */
}

.placard-frame rect {
  fill: none;
  stroke: var(--gilt);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.placard-frame rect.is-thin {
  stroke-width: 1;
  opacity: 0.55;
}

.placard-corners rect {
  fill: var(--gilt);
  stroke: none;
}

.placard-line {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.15rem, 3.4vw, 1.65rem);
  font-variant-caps: all-small-caps;
  letter-spacing: var(--tracking-wide);
  line-height: var(--leading-snug);
  color: var(--parchment);
}

/* Everything after the first is the small print at the foot of the card. */
.placard-line + .placard-line {
  font-size: clamp(0.9rem, 2.4vw, 1.1rem);
  font-variant-caps: normal;
  font-style: italic;
  color: var(--ash);
}

/*
 * The lamp. Film does not hold a steady level, and an intertitle that sits
 * at a dead 100% looks like a web page pretending. The stops are uneven and
 * the cycle is short, so it never settles into a rhythm you can count.
 */
@keyframes placard-flicker {
  0%, 100% { opacity: 1; }
  17% { opacity: 0.93; }
  23% { opacity: 1; }
  54% { opacity: 0.96; }
  61% { opacity: 0.89; }
  68% { opacity: 1; }
  84% { opacity: 0.95; }
}

.placard-stage .placard {
  animation: placard-flicker 2.3s steps(1, end) infinite;
}

/* The card strikes in and is pulled away -- a projector change, not a modal
   sliding up. */
.placard-enter-active .placard {
  animation: placard-flicker 2.3s steps(1, end) infinite;
  transition: transform var(--dur-base) var(--ease-settle);
}

.placard-enter-active,
.placard-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}

.placard-enter-from,
.placard-leave-to {
  opacity: 0;
}

.placard-enter-from .placard {
  transform: scale(1.04);
}

@media (prefers-reduced-motion: reduce) {
  .placard-stage .placard,
  .placard-enter-active .placard {
    animation: none;
  }

  .placard-enter-from .placard {
    transform: none;
  }
}
</style>
