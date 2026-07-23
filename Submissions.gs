/* =========================================================================
   Submissions.gs
   자가진단 제출/조회/상태 변경
   ========================================================================= */

function submitCheck_(ss, payload) {
  var siteName = String(payload.siteName || '').trim();
  var workerName = String(payload.workerName || '').trim();
  if (!siteName || !workerName) throw new Error('현장과 성명을 입력하세요.');

  var result = computeScore_(payload.answers || {});
  var now = new Date();
  var id = Utilities.getUuid();
  var session = now.getHours() < 12 ? 'AM' : 'PM';
  var isAlert = (result.level === '경고' || result.level === '위험');

  ss.getSheetByName(CONFIG.SHEETS.SUBMISSIONS).appendRow([
    id, now, session, siteName, workerName,
    JSON.stringify(payload.answers || {}), result.score, result.level, result.forcedDanger,
    isAlert ? CONFIG.STATUS.UNCONFIRMED : '', '', '', ''
  ]);

  if (isAlert) {
    sendAlertMail_({
      id: id, timestamp: now, siteName: siteName, workerName: workerName,
      score: result.score, level: result.level
    });
  }

  return { id: id, score: result.score, level: result.level, guide: result.guide };
}

function listSubmissions_(ss, filters) {
  filters = filters || {};
  var sheet = ss.getSheetByName(CONFIG.SHEETS.SUBMISSIONS);
  var values = sheet.getDataRange().getValues();
  var header = values.shift();

  var rows = values.map(function (row) {
    var record = {};
    header.forEach(function (key, i) { record[key] = row[i]; });
    return record;
  });

  if (filters.siteName) {
    rows = rows.filter(function (r) { return r.siteName === filters.siteName; });
  }
  if (filters.level) {
    rows = rows.filter(function (r) { return r.level === filters.level; });
  }
  if (filters.status) {
    rows = rows.filter(function (r) { return r.status === filters.status; });
  }

  rows.sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
  return rows;
}

function updateSubmissionStatus_(ss, payload) {
  var id = payload.id;
  var status = payload.status;
  var handledBy = payload.handledBy || '';
  if (!id || !status) throw new Error('id와 status가 필요합니다.');

  var sheet = ss.getSheetByName(CONFIG.SHEETS.SUBMISSIONS);
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var idCol = header.indexOf('id');
  var statusCol = header.indexOf('status');
  var handledByCol = header.indexOf('handledBy');
  var handledAtCol = header.indexOf('handledAt');

  for (var i = 1; i < values.length; i++) {
    if (values[i][idCol] === id) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, statusCol + 1).setValue(status);
      sheet.getRange(rowNum, handledByCol + 1).setValue(handledBy);
      sheet.getRange(rowNum, handledAtCol + 1).setValue(new Date());
      return { updated: true };
    }
  }
  throw new Error('해당 id를 찾을 수 없습니다: ' + id);
}
