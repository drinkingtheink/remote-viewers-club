/*
 * Where the Club's archive lives.
 *
 * Two separate Apps Script deployments, which is worth saying out loud
 * because it is not obvious and it matters: signatures are POSTed to one and
 * the roll is read back from the other. Whether they are the same project
 * behind the scenes cannot be told from here.
 *
 * They were a literal inside two components that never referenced each
 * other. The pad now reads the roll back to confirm a signature actually
 * landed, so both halves have to agree on the addresses -- and a URL that
 * exists in one place cannot drift out of step with its other copy.
 */

// POST: a hidden form targets this, because the deployment does not answer
// cross-origin requests.
export const ROLL_WRITE =
  'https://script.google.com/macros/s/AKfycbwpZu_9Pb4_Qm6FgsWy5HuSg_hDnFGH3MLb3EspqBThRqOV3ZRiBa1a43fZqLMMhzc/exec'

// GET: this one does answer, and returns { success, data: [...] }.
export const ROLL_READ =
  'https://script.google.com/macros/s/AKfycbxKQRUEBU8e1skP35pZzZslfgWLtkeeAqdL57M1oSwEqw-pEhQ1jksIrzhwd_KraiSt/exec'

/*
 * Did this name make it onto the roll?
 *
 * The write goes out through an iframe, whose load event fires for anything
 * that comes back -- an error page, a sign-in redirect, an empty response --
 * so it cannot be asked whether the write worked. Reading the roll can.
 *
 * A sheet append is not always visible on the next read, so this asks a few
 * times before giving up.
 */
export async function rollContains(name, { tries = 4, gap = 1200 } = {}) {
  const wanted = (name || '').trim().toLowerCase()
  if (!wanted) return false

  for (let attempt = 0; attempt < tries; attempt += 1) {
    if (attempt) await new Promise((resolve) => setTimeout(resolve, gap))

    try {
      const response = await fetch(`${ROLL_READ}?_=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: { Accept: 'application/json' }
      })
      if (!response.ok) continue

      const result = await response.json()
      const rows = (result && result.data) || []
      const found = rows.some(
        (row) => ((row.title || row.printedName || '').trim().toLowerCase()) === wanted
      )
      if (found) return true
    } catch (error) {
      // network hiccup on one attempt is not an answer; try again
    }
  }

  return false
}
