/* =========================================================================
   Auth.gs
   관리자 비밀번호 검증. 실제 값은 소스코드가 아니라 스크립트 속성
   (PropertiesService)에 우선 저장되며, 없으면 Config.gs 기본값을 사용합니다.
   ========================================================================= */

function checkAdminPassword_(password) {
  var stored = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD') || CONFIG.AUTH.ADMIN_PASSWORD;
  return !!password && String(password) === stored;
}

function setAdminPassword_(data) {
  var newPwd = String(data.newPassword || '').trim();
  if (!newPwd) throw new Error('새 비밀번호를 입력하세요.');
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', newPwd);
}
