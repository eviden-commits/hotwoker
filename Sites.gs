/* =========================================================================
   Sites.gs
   현장 목록 조회/관리 (비상연락처, 담당자명, GPS 좌표 포함)
   ========================================================================= */

var SITE_COLUMNS_ = ['siteName', 'emergencyPhone', 'contactName', 'lat', 'lng', 'active'];

// 기존 시트에 없는 컬럼을 자동으로 추가합니다(구버전 시트 호환).
function ensureSitesSchema_(sheet) {
  var header = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  SITE_COLUMNS_.forEach(function (col) {
    if (header.indexOf(col) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(col);
      header.push(col);
    }
  });
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
    .map(function (r) {
      return {
        siteName: r.siteName,
        emergencyPhone: r.emergencyPhone || '',
        contactName: r.contactName || '',
        lat: r.lat === '' || r.lat === undefined ? null : Number(r.lat),
        lng: r.lng === '' || r.lng === undefined ? null : Number(r.lng)
      };
    });
}

function addSite_(ss, payload) {
  var name = String(payload.siteName || '').trim();
  if (!name) throw new Error('현장명을 입력하세요.');

  var sheet = ss.getSheetByName(CONFIG.SHEETS.SITES);
  ensureSitesSchema_(sheet);
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = header.map(function (key) {
    if (key === 'siteName') return name;
    if (key === 'emergencyPhone') return String(payload.emergencyPhone || '').trim();
    if (key === 'contactName') return String(payload.contactName || '').trim();
    if (key === 'lat') return payload.lat === undefined || payload.lat === '' ? '' : Number(payload.lat);
    if (key === 'lng') return payload.lng === undefined || payload.lng === '' ? '' : Number(payload.lng);
    if (key === 'active') return true;
    return '';
  });
  sheet.appendRow(row);
}

// 비상연락처/담당자명/위경도 등 현장 정보를 부분 업데이트합니다. payload에 있는 필드만 갱신합니다.
function updateSite_(ss, payload) {
  var name = String(payload.siteName || '').trim();
  if (!name) throw new Error('현장명이 필요합니다.');

  var sheet = ss.getSheetByName(CONFIG.SHEETS.SITES);
  ensureSitesSchema_(sheet);
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var nameCol = header.indexOf('siteName');

  for (var i = 1; i < values.length; i++) {
    if (values[i][nameCol] === name) {
      var rowNum = i + 1;
      if (payload.emergencyPhone !== undefined) {
        sheet.getRange(rowNum, header.indexOf('emergencyPhone') + 1).setValue(String(payload.emergencyPhone).trim());
      }
      if (payload.contactName !== undefined) {
        sheet.getRange(rowNum, header.indexOf('contactName') + 1).setValue(String(payload.contactName).trim());
      }
      if (payload.lat !== undefined) {
        sheet.getRange(rowNum, header.indexOf('lat') + 1).setValue(payload.lat === '' ? '' : Number(payload.lat));
      }
      if (payload.lng !== undefined) {
        sheet.getRange(rowNum, header.indexOf('lng') + 1).setValue(payload.lng === '' ? '' : Number(payload.lng));
      }
      return { updated: true };
    }
  }
  throw new Error('해당 현장을 찾을 수 없습니다: ' + name);
}
