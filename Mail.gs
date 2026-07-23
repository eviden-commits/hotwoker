/* =========================================================================
   Mail.gs
   경고/위험 등급 발생 시 관리자 그룹메일 발송
   ========================================================================= */

function sendAlertMail_(record) {
  if (!CONFIG.ADMIN_EMAILS || CONFIG.ADMIN_EMAILS.length === 0) return;

  var ts = Utilities.formatDate(record.timestamp, 'GMT+9', 'yyyy-MM-dd HH:mm');
  var subject = '[온열질환 ' + record.level + '] ' + record.siteName + ' - ' + record.workerName;
  var body = [
    record.level + ' 등급 자가진단이 접수되었습니다.',
    '',
    '현장: ' + record.siteName,
    '성명: ' + record.workerName,
    '점수: ' + record.score,
    '시각: ' + ts,
    '',
    '관리자 대시보드에서 확인 후 조치 상태를 갱신해주세요.'
  ].join('\n');

  GmailApp.sendEmail(CONFIG.ADMIN_EMAILS.join(','), subject, body);
}
