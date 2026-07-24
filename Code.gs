/* =========================================================================
   Code.gs
   진입점(doGet/doPost) 라우팅 전용. 실제 로직은 다른 파일에 있습니다.
   ========================================================================= */

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'healthCheck';
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var result;

    switch (action) {
      case 'healthCheck':
        result = { system: CONFIG.SYSTEM_KO_NAME, status: 'OK' };
        break;

      case 'getSiteList':
        result = { sites: getSiteList_(ss) };
        break;

      case 'getAppConfig':
        result = { hotlinePhone: CONFIG.HOTLINE_PHONE, hqPhone: CONFIG.HQ_PHONE, spreadsheetId: CONFIG.SPREADSHEET_ID };
        break;

      case 'listSubmissions':
        if (!checkAdminPassword_(e.parameter.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        result = {
          submissions: listSubmissions_(ss, {
            siteName: e.parameter.siteName || '',
            level: e.parameter.level || '',
            status: e.parameter.status || ''
          })
        };
        break;

      case 'geocodeAddress':
        if (!checkAdminPassword_(e.parameter.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        try {
          result = geocodeAddress_(e.parameter.address || '');
        } catch (geocodeError) {
          result = { error: geocodeError.message };
        }
        break;

      default:
        result = { error: '알 수 없는 action입니다: ' + action };
    }

    return jsonOutput_(result);
  } catch (error) {
    return jsonOutput_({ error: error.toString() });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var payload = body.payload || {};
    var result;

    switch (action) {
      case 'submitCheck':
        result = submitCheck_(ss, payload);
        break;

      case 'addSite':
        if (!checkAdminPassword_(payload.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        addSite_(ss, payload);
        result = { status: 'ok' };
        break;

      case 'updateSite':
        if (!checkAdminPassword_(payload.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        result = updateSite_(ss, payload);
        break;

      case 'updateSubmissionStatus':
        if (!checkAdminPassword_(payload.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        result = updateSubmissionStatus_(ss, payload);
        break;

      case 'deleteSubmissions':
        if (!checkAdminPassword_(payload.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        result = deleteSubmissions_(ss, payload);
        break;

      case 'adminLogin':
        result = { ok: checkAdminPassword_(payload.password) };
        break;

      case 'setAdminPassword':
        if (!checkAdminPassword_(payload.password)) {
          return jsonOutput_({ authError: true, error: '비밀번호가 올바르지 않습니다.' });
        }
        setAdminPassword_(payload);
        result = { status: 'ok' };
        break;

      default:
        result = { error: '알 수 없는 action입니다: ' + action };
    }

    return jsonOutput_(result);
  } catch (error) {
    return jsonOutput_({ error: error.toString() });
  }
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
