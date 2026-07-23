/* =========================================================================
   Sites.gs
   현장 목록 조회/관리
   ========================================================================= */

function getSiteList_(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.SITES);
  var values = sheet.getDataRange().getValues();
  values.shift(); // header
  return values
    .filter(function (row) { return row[1] === true || row[1] === 'TRUE'; })
    .map(function (row) { return row[0]; });
}

function addSite_(ss, payload) {
  var name = String(payload.siteName || '').trim();
  if (!name) throw new Error('현장명을 입력하세요.');
  ss.getSheetByName(CONFIG.SHEETS.SITES).appendRow([name, true]);
}
