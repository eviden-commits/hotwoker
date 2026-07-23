/**
 * api.js
 * 근로자 온열질환 자가진단 시스템 - Apps Script Web App API 통신 모듈
 */

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbxm2OoPPXn2j9ovOxJHkU31_8-bGigrqZsiQvWO7sonXOqt4vrinGUKF3RFFovrT6FiMg/exec";

async function apiGet(action, params = {}) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("API GET 실패: " + response.status);
  return await response.json();
}

async function apiPost(action, payload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, payload })
  });
  if (!response.ok) throw new Error("API POST 실패: " + response.status);
  return await response.json();
}
