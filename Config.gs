/* =========================================================================
   Config.gs
   전역 설정값. 다른 모든 파일이 참조합니다.
   ========================================================================= */

var CONFIG = {
  SYSTEM_NAME: 'Sebangtec Heat Illness Self-Check System',
  SYSTEM_KO_NAME: '세방테크 근로자 온열질환 자가진단 시스템',

  // setupHotworkerSystem() 실행 후 로그에 출력된 ID를 여기에 채워 넣으세요.
  SPREADSHEET_ID: '16ygXSEFhL-FDKJtgHd2qdyZcwIY3M-TNv6bu3RU2VdI',

  // 경고/위험 등급 발생 시 즉시 메일을 받을 관리자 그룹. 필요한 만큼 추가하세요.
  ADMIN_EMAILS: ['sb06@sebangtec.com'],

  // 이상증상 발생 시 근로자 화면에 상시 노출되는 비상연락처
  HOTLINE_PHONE: '070-0000-0000',

  // 최초 화면에 노출되는 본사 연락처. 현장별 비상연락처는 Sites 시트의 emergencyPhone 컬럼에서 관리합니다.
  HQ_PHONE: '070-5079-8002',

  // 관리자 대시보드 로그인 비밀번호는 코드(git)에 두지 않고 PropertiesService(스크립트 속성)에만
  // 저장합니다. Apps Script 편집기 > 프로젝트 설정 > 스크립트 속성에서 ADMIN_PASSWORD 키로
  // 직접 등록하세요. Auth.gs 참고.

  SHEETS: {
    SUBMISSIONS: 'submissions',
    SITES: 'sites'
  },

  // 자가진단 세션: 오전 07:00 이전 1회, 오후 14:00 1회
  SESSION_WINDOWS: {
    AM_DEADLINE: '07:00',
    PM_TIME: '14:00'
  },

  // 누적 점수 기준 등급 임계값 (SCORING.gs 참고)
  SCORE_THRESHOLDS: {
    OBSERVE: 3,
    WARNING: 6,
    DANGER: 9
  },

  STATUS: {
    UNCONFIRMED: '미확인',
    IN_PROGRESS: '조치중',
    DONE: '완료'
  }
};
