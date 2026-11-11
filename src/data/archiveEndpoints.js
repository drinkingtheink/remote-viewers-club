/*
 * Where the Club's archive lives.
 *
 * One Apps Script deployment, serving both halves. It was two, and that is
 * exactly how the write end came to be broken without anyone noticing.
 *
 * They were a literal inside two components that never referenced each
 * other. The pad now reads the roll back to confirm a signature actually
 * landed, so both halves have to agree on the address -- and a URL that
 * exists in one place cannot drift out of step with its other copy.
 */

// GET: returns { success, data: [...] }.
export const ROLL_READ =
  'https://script.google.com/macros/s/AKfycbzQYcncfku0c-bzy92vK_JJvPZwmFdxUwhsZUryxCKDX99-YzaT1B7JkVLXcOolKJ04/exec'

/*
 * POST: the same deployment, which is the fix for a bug that ate fifteen
 * months of signatures.
 *
 * Writes used to go to a second deployment whose doPost was a stub -- it
 * returned success and never touched the sheet. The iframe loaded that
 * perfectly valid response, so the pad declared SAVED! every time and the
 * roll never grew. The last signature to land did so on 3 August 2025.
 *
 * apps-script/Code.gs in this repo is the script both ends talk to, and the
 * address above is version 7 of it, deployed 10 November 2026 -- a third
 * URL, since neither of the two the app had been using was the deployment
 * that got updated. The old pair are left out deliberately: a dead address
 * kept around for reference is an address something eventually points at
 * again.
 */
export const ROLL_WRITE = ROLL_READ

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
