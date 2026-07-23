/* =========================================================================
   Setup.gs
   최초 1회, Apps Script 편집기에서 setupHotworkerSystem()을 직접 실행하세요.
   실행 로그에 찍히는 스프레드시트 ID를 Config.gs의 SPREADSHEET_ID에 붙여넣으면 됩니다.
   ========================================================================= */

function setupHotworkerSystem() {
  var ss = SpreadsheetApp.create(CONFIG.SYSTEM_KO_NAME + ' DB');
  var spreadsheetId = ss.getId();

  var submissions = ss.getSheets()[0];
  submissions.setName(CONFIG.SHEETS.SUBMISSIONS);
  submissions.appendRow([
    'id', 'timestamp', 'session', 'siteName', 'workerName',
    'answersJson', 'score', 'level', 'forcedDanger',
    'status', 'handledBy', 'handledAt', 'memo'
  ]);
  submissions.setFrozenRows(1);

  var sites = ss.insertSheet(CONFIG.SHEETS.SITES);
  sites.appendRow(['siteName', 'active']);
  sites.appendRow(['본사', true]);
  sites.setFrozenRows(1);

  Logger.log('스프레드시트 생성 완료. Config.gs의 SPREADSHEET_ID에 아래 값을 넣으세요:');
  Logger.log(spreadsheetId);
  Logger.log('시트 URL: ' + ss.getUrl());
  return spreadsheetId;
}
