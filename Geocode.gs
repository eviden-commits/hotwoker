/* =========================================================================
   Geocode.gs
   Google Maps Geocoding API로 주소 -> 위경도 변환.
   API 키는 소스코드(git)에 두지 않고 스크립트 속성에만 저장합니다.
   Apps Script 편집기 > 프로젝트 설정 > 스크립트 속성에서
   GOOGLE_MAPS_API_KEY 키를 직접 등록하세요.
   ========================================================================= */

function geocodeAddress_(address) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_MAPS_API_KEY');
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY가 스크립트 속성에 설정되어 있지 않습니다.');
  if (!address) throw new Error('주소를 입력하세요.');

  var url = 'https://maps.googleapis.com/maps/api/geocode/json'
    + '?address=' + encodeURIComponent(address)
    + '&language=ko'
    + '&key=' + apiKey;

  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var data = JSON.parse(response.getContentText());

  if (data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error('주소를 찾을 수 없습니다: ' + (data.status || 'UNKNOWN_ERROR'));
  }

  var loc = data.results[0].geometry.location;
  return {
    lat: loc.lat,
    lng: loc.lng,
    formattedAddress: data.results[0].formatted_address
  };
}
