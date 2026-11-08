import { computed, ref } from 'vue'
import failMsgs from '../data/failureFeedback'

export const INTRO = 'intro'

/**
 * Shared plumbing for a Praxis session.
 *
 * Every session is a `.stage` panel that sits collapsed showing its intro, then
 * widens (`.stage.active`) once a session begins. They each re-implemented that
 * phase flag, the scroll-into-view on begin, and the failure-message picker.
 *
 * @param {object}   options
 * @param {string}   options.selector        Root class of the session panel, e.g. '.zener-session'.
 * @param {Function} options.scrollToElement The scroll helper AppStage passes down.
 */
export function useSession({ selector, scrollToElement }) {
  const phase = ref(INTRO)
  const isActive = computed(() => phase.value !== INTRO)

  /** Move to another phase without re-scrolling. */
  const goTo = (next) => {
    phase.value = next
  }

  /** Enter the first working phase and bring the now-expanded panel into view. */
  const begin = (firstPhase) => {
    phase.value = firstPhase
    // Scroll only once the `active` class is on the element the selector targets.
    scrollToElement?.(`${selector}.stage.active`)
  }

  /** Collapse back to the intro panel. */
  const reset = () => {
    phase.value = INTRO
  }

  /** A random bit of deadpan commiseration. */
  const failMessage = () => failMsgs[Math.floor(Math.random() * failMsgs.length)]

  return { phase, isActive, begin, goTo, reset, failMessage }
}
