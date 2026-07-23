/* =========================================================================
   Scoring.gs
   자가진단 응답 -> 등급 산정 (단순 증상 체크리스트 방식)
   ========================================================================= */

// answers = { symptoms: ['headache','dizziness', ...], otherText: '' }
// symptoms 가능한 값: bodyTempHigh, headache, dizziness, nausea, cramps,
//                     excessiveSweat, fatigue, severeThirst, consciousness, other
// 'consciousness'(의식저하/혼란)는 응급 신호이므로 단독 체크만으로도 즉시 '위험' 처리
function computeScore_(answers) {
  var symptoms = (answers.symptoms || []).filter(function (s) { return s && s !== 'none'; });
  var count = symptoms.length;
  var forcedDanger = symptoms.indexOf('consciousness') !== -1;

  var level;
  if (forcedDanger) {
    level = '위험';
  } else if (count >= 2) {
    level = '경고';
  } else if (count === 1) {
    level = '관찰';
  } else {
    level = '정상';
  }

  return { score: count, level: level, forcedDanger: forcedDanger, guide: getActionGuide_(level) };
}

function getActionGuide_(level) {
  var hotline = CONFIG.HOTLINE_PHONE;
  switch (level) {
    case '위험':
      return [
        '즉시 작업을 중지하고 시원한 그늘/실내로 이동하세요.',
        '옷을 느슨하게 하고 시원한 물로 몸을 적셔 체온을 낮추세요.',
        '의식이 있으면 물을 조금씩 마시게 하고, 의식이 없거나 저하되면 즉시 119에 신고하세요.',
        '관리자에게 즉시 통보되었습니다. Hot Line: ' + hotline
      ];
    case '경고':
      return [
        '작업을 즉시 중단하고 시원한 장소로 이동해 휴식하세요.',
        '시원한 물을 천천히 마시세요.',
        '증상이 나아지지 않으면 관리자에게 알리거나 Hot Line(' + hotline + ')으로 연락하세요.'
      ];
    case '관찰':
      return [
        '작업 강도를 낮추고 자주 수분을 섭취하세요.',
        '증상이 심해지면 다음 자가진단 전이라도 즉시 재응답하세요.'
      ];
    default:
      return ['특이사항 없음. 정기적인 수분 섭취와 휴식을 유지하세요.'];
  }
}
