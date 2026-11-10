/*
 * How anything on the page raises them.
 *
 * The arms live at the root, beside .app-stage rather than inside it, and
 * the things that call them do not: a session verdict is six components
 * down, and the tab-away watch is in a composable with no view at all.
 * Passing a handler down to either would mean threading a prop through
 * every panel between here and there for the sake of one call.
 *
 * So the layer registers once and whoever has a reason shouts. There is
 * only ever one listener -- the arms are a singleton on the page -- but the
 * list costs nothing and means a stray subscribe during hot reload cannot
 * wedge it.
 *
 * `reason` is passed through untouched. Nothing branches on it yet; it is
 * there so the answer to "what brought them this time" is in the arguments
 * rather than reconstructed later.
 */

const listeners = new Set()

export function onSiegeRaised(handler) {
  listeners.add(handler)
  return () => listeners.delete(handler)
}

export function raiseSiege(reason) {
  for (const handler of listeners) handler(reason)
}
