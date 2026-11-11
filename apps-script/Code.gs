/*
 * Remote Viewers Club — the membership roll.
 *
 * One deployment serves both halves: doGet returns the roll, doPost adds to
 * it. The app used to point its writes at a separate deployment whose doPost
 * was a stub that returned success and wrote nothing, which is why no
 * signature reached this sheet between August 2025 and November 2026.
 *
 * DEPLOYING: Deploy → Manage deployments → the existing deployment → the
 * pencil → Version: New version → Deploy. That keeps the same /exec URL.
 * Creating a *new* deployment instead issues a new URL, which is how the
 * read and write ends came to be two different addresses in the first place.
 * Execute as: Me. Who has access: Anyone.
 */

var SPREADSHEET_ID = '19EI-_iwu5W9drQIq5k3lKkmm4PIMCHSP4nz4b9m3bII';
var SHEET_NAME = 'signatures';

// A=signatureImgData, B=printedName, C=timestamp — as the header row says.
var COL_IMAGE = 0;
var COL_NAME = 1;
var COL_TIME = 2;

function getSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');
  return sheet;
}

function jsonOut(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ---------------------------------------------------------------- read -- */

function doGet() {
  try {
    var sheet = getSheet();
    var values = sheet.getRange('A:C').getValues();

    var items = [];

    // Start at 1 to skip the header. The index is the sheet row, so an id is
    // a stable position in the register rather than a number that changes
    // the moment anybody else signs -- which is what made it useless as a
    // membership number before.
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var name = row[COL_NAME] ? row[COL_NAME].toString().trim() : '';
      if (!name) continue;

      var when = row[COL_TIME];

      items.push({
        id: i,
        title: name,
        image: row[COL_IMAGE] ? row[COL_IMAGE].toString().trim() : null,
        // The date this row was written, read from the sheet. It used to be
        // new Date() per row, so every signature claimed to have been made
        // at the moment the roll happened to be fetched.
        timestamp: when instanceof Date ? when.toISOString() : when || null
      });
    }

    // Oldest first, the order they were signed in. The client reverses for
    // display; returning them reversed here meant two reversals and a roll
    // that ran backwards from what everything said it did.
    return jsonOut({
      success: true,
      data: items,
      count: items.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    return jsonOut({
      success: false,
      error: error.toString(),
      message: 'Failed to fetch the membership roll'
    });
  }
}

/* --------------------------------------------------------------- write -- */

function doPost(e) {
  try {
    // The client posts one form field, `data`, holding the JSON. Fall back to
    // a raw JSON body so a plain fetch works too.
    var raw = e && e.parameter && e.parameter.data ? e.parameter.data : null;
    if (!raw && e && e.postData && e.postData.contents) raw = e.postData.contents;
    if (!raw) throw new Error('No data submitted');

    var payload = JSON.parse(raw);
    var name = (payload.printedName || '').toString().trim();
    var image = (payload.signatureImgData || '').toString();

    // Both halves are required: a nameless row is invisible to doGet, which
    // skips anything without a name, and a signature is the point.
    if (!name) throw new Error('No printed name submitted');
    if (image.indexOf('data:image/') !== 0) throw new Error('No signature submitted');

    getSheet().appendRow([image, name, new Date()]);

    return jsonOut({ success: true, printedName: name });
  } catch (error) {
    return jsonOut({ success: false, error: error.toString() });
  }
}
