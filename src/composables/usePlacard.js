import { ref } from 'vue'

/*
 * How the Club says things.
 *
 * There was no way to tell anyone anything. The pad flipped a word on a
 * button, the roll refreshed itself underneath, and that was the whole
 * vocabulary -- so the one genuinely good moment on the site, somebody
 * putting their name to the thing, went past without being marked at all.
 *
 * A placard is the period's own answer: the picture stops, a card comes up,
 * you read it, the picture goes on. It suits a club that files forms and
 * issues notices far better than a toast in the corner would.
 *
 * Module-level state rather than a prop or a bus. One placard shows at a
 * time, anywhere on the page, and whoever raises it does not need to know
 * where it is mounted -- the same arrangement the arms use.
 */

const queue = ref([])
let nextId = 0

/**
 * @param {string|string[]} message  One line, or several on their own cards.
 * @param {{ hold?: number }} options  How long to leave it up.
 */
export function showPlacard(message, options = {}) {
  const lines = (Array.isArray(message) ? message : [message]).filter(Boolean)
  if (!lines.length) return

  queue.value = [...queue.value, { id: (nextId += 1), lines, hold: options.hold || 3400 }]
}

export function usePlacardQueue() {
  return {
    queue,
    /* By id rather than by position: a card can be dismissed by hand while
       its own hold timer is still running, and the timer must not then take
       whichever card happened to replace it. */
    drop(id) {
      queue.value = queue.value.filter((card) => card.id !== id)
    }
  }
}
