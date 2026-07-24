/* =========================================================================
   Auth.gs
   관리자 비밀번호 검증. 실제 값은 소스코드(git)에 두지 않고 스크립트 속성
   (PropertiesService)에만 저장됩니다. 최초 설정은 Apps Script 편집기 >
   프로젝트 설정 > 스크립트 속성에서 ADMIN_PASSWORD 키를 직접 추가하세요.
   ========================================================================= */

function checkAdminPassword_(password) {
  var stored = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  return !!stored && !!password && String(password) === stored;
}

function setAdminPassword_(data) {
  var newPwd = String(data.newPassword || '').trim();
  if (!newPwd) throw new Error('새 비밀번호를 입력하세요.');
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', newPwd);
}
