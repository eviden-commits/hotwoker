/* =========================================================================
   Sites.gs
   현장 목록 조회/관리 (현장별 비상연락처 포함)
   ========================================================================= */

// 기존 시트에 emergencyPhone 컬럼이 없으면 자동으로 추가합니다(구버전 시트 호환).
function ensureSitesSchema_(sheet) {
  var lastCol = sheet.getLastColumn();
  var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (header.indexOf('emergencyPhone') === -1) {
    sheet.insertColumnAfter(1);
    sheet.getRange(1, 2).setValue('emergencyPhone');
  }
}

function getSiteList_(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.SITES);
  ensureSitesSchema_(sheet);
  var values = sheet.getDataRange().getValues();
  var header = values.shift();

  return values
    .map(function (row) {
      var record = {};
      header.forEach(function (key, i) { record[key] = row[i]; });
      return record;
    })
    .filter(function (r) { return r.active === true || r.active === 'TRUE'; })
    .map(function (r) { return { siteName: r.siteName, emergencyPhone: r.emergencyPhone || '' }; });
}

function addSite_(ss, payload) {
  var name = String(payload.siteName || '').trim();
  if (!name) throw new Error('현장명을 입력하세요.');
  var phone = String(payload.emergencyPhone || '').trim();

  var sheet = ss.getSheetByName(CONFIG.SHEETS.SITES);
  ensureSitesSchema_(sheet);
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = header.map(function (key) {
    if (key === 'siteName') return name;
    if (key === 'emergencyPhone') return phone;
    if (key === 'active') return true;
    return '';
  });
  sheet.appendRow(row);
}

function updateSitePhone_(ss, payload) {
  var name = String(payload.siteName || '').trim();
  var phone = String(payload.emergencyPhone || '').trim();
  if (!name) throw new Error('현장명이 필요합니다.');

  var sheet = ss.getSheetByName(CONFIG.SHEETS.SITES);
  ensureSitesSchema_(sheet);
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var nameCol = header.indexOf('siteName');
  var phoneCol = header.indexOf('emergencyPhone');

  for (var i = 1; i < values.length; i++) {
    if (values[i][nameCol] === name) {
      sheet.getRange(i + 1, phoneCol + 1).setValue(phone);
      return { updated: true };
    }
  }
  throw new Error('해당 현장을 찾을 수 없습니다: ' + name);
}
