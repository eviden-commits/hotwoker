/**
 * app.js
 * 근로자 온열질환 자가진단 시스템 - 화면 로직
 */

const SYMPTOM_KEYS = [
  "bodyTempHigh", "headache", "dizziness", "nausea", "cramps",
  "excessiveSweat", "fatigue", "severeThirst", "consciousness", "other"
];

const state = {
  lang: localStorage.getItem("hw_lang") || "ko",
  siteName: localStorage.getItem("hw_siteName") || "",
  workerName: localStorage.getItem("hw_workerName") || "",
  sites: [],
  hotlinePhone: "",
  step: "site" // site | check | result
};

const el = (id) => document.getElementById(id);

function applyLangTexts() {
  const lang = state.lang;
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  el("appTitle").textContent = t(lang, "appTitle");
  el("siteStepTitle").textContent = t(lang, "siteStepTitle");
  el("siteLabel").textContent = t(lang, "siteLabel");
  el("nameLabel").textContent = t(lang, "nameLabel");
  el("nameInput").placeholder = t(lang, "namePlaceholder");
  el("startBtn").textContent = t(lang, "startBtn");
  el("hqContactLabel").textContent = t(lang, "hqContactLabel");
  el("changeInfoBtn").textContent = t(lang, "changeInfoBtn");
  el("siteContactLabel").textContent = t(lang, "siteContactLabel");
  el("checkStepTitle").textContent = t(lang, "checkStepTitle");
  el("otherText").placeholder = t(lang, "otherPlaceholder");
  el("submitBtn").textContent = t(lang, "submitBtn");
  el("resultTitle").textContent = t(lang, "resultTitle");
  el("hotlineLabel").textContent = t(lang, "hotlineLabel");
  el("backBtn").textContent = t(lang, "backBtn");
  renderSiteOptions();
  renderSymptomList();
}

function renderSiteOptions() {
  const select = el("siteSelect");
  const lang = state.lang;
  select.innerHTML = `<option value="">${t(lang, "sitePlaceholder")}</option>` +
    state.sites.map((s) => `<option value="${s.siteName}">${s.siteName}</option>`).join("");
  if (state.siteName) select.value = state.siteName;
}

function renderSiteContactBar() {
  const site = state.sites.find((s) => s.siteName === state.siteName);
  const phone = site && site.emergencyPhone;
  el("siteContactBar").classList.toggle("hidden", !phone);
  if (phone) {
    el("siteContactPhone").textContent = phone;
    el("siteContactLink").href = "tel:" + phone;
  }
}

const GPS_MATCH_RADIUS_METERS = 1000;

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function tryGpsAutoDetect() {
  const geoSites = state.sites.filter((s) => s.lat != null && s.lng != null);
  if (!navigator.geolocation || geoSites.length === 0) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      let nearest = null;
      let nearestDist = Infinity;
      geoSites.forEach((s) => {
        const d = haversineMeters(latitude, longitude, s.lat, s.lng);
        if (d < nearestDist) { nearestDist = d; nearest = s; }
      });
      if (nearest && nearestDist <= GPS_MATCH_RADIUS_METERS) {
        el("siteSelect").value = nearest.siteName;
        el("gpsStatus").textContent = t(state.lang, "gpsAutoDetected");
        el("gpsStatus").classList.remove("hidden");
      }
    },
    () => {},
    { timeout: 8000, maximumAge: 60000 }
  );
}

function renderSymptomList() {
  const lang = state.lang;
  const list = el("symptomList");
  list.innerHTML = SYMPTOM_KEYS.map((key) => {
    const isEmergency = key === "consciousness";
    return `
      <div class="symptom-item${isEmergency ? " emergency" : ""}" data-key="${key}">
        <input type="checkbox" id="sym_${key}" value="${key}" />
        <label for="sym_${key}">${t(lang, "symptoms")[key]}</label>
      </div>`;
  }).join("");

  list.querySelectorAll(".symptom-item").forEach((item) => {
    const checkbox = item.querySelector("input");
    item.addEventListener("click", (evt) => {
      if (evt.target !== checkbox) checkbox.checked = !checkbox.checked;
      item.classList.toggle("checked", checkbox.checked);
      if (checkbox.value === "other") {
        el("otherText").classList.toggle("hidden", !checkbox.checked);
      }
    });
  });
}

function showStep(step) {
  state.step = step;
  el("siteStep").classList.toggle("hidden", step !== "site");
  el("checkStep").classList.toggle("hidden", step !== "check");
  el("resultStep").classList.toggle("hidden", step !== "result");
}

async function loadSites() {
  try {
    const res = await apiGet("getSiteList");
    state.sites = res.sites || [];
  } catch (e) {
    state.sites = [];
  }
  renderSiteOptions();
}

async function loadAppConfig() {
  try {
    const res = await apiGet("getAppConfig");
    state.hotlinePhone = res.hotlinePhone || "";
    el("hotlinePhone").textContent = state.hotlinePhone;
    el("hotlinePhone").href = "tel:" + state.hotlinePhone;
    el("hqCallLink").href = "tel:" + (res.hqPhone || "");
  } catch (e) {
    el("hotlineBox").classList.add("hidden");
  }
}

function initInfoBar() {
  if (state.siteName && state.workerName) {
    el("infoBarSite").textContent = state.siteName;
    el("infoBarName").textContent = state.workerName;
    el("infoBar").classList.remove("hidden");
    el("siteStep").classList.add("hidden");
    renderSiteContactBar();
    showStep("check");
  } else {
    el("infoBar").classList.add("hidden");
    showStep("site");
    tryGpsAutoDetect();
  }
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.lang = btn.dataset.lang;
    localStorage.setItem("hw_lang", state.lang);
    applyLangTexts();
  });
});

el("startBtn").addEventListener("click", () => {
  const siteName = el("siteSelect").value;
  const workerName = el("nameInput").value.trim();
  if (!siteName || !workerName) {
    el("siteError").textContent = t(state.lang, "errorRequired");
    el("siteError").classList.remove("hidden");
    return;
  }
  state.siteName = siteName;
  state.workerName = workerName;
  localStorage.setItem("hw_siteName", siteName);
  localStorage.setItem("hw_workerName", workerName);
  el("infoBarSite").textContent = siteName;
  el("infoBarName").textContent = workerName;
  el("infoBar").classList.remove("hidden");
  renderSiteContactBar();
  showStep("check");
});

el("changeInfoBtn").addEventListener("click", () => {
  el("infoBar").classList.add("hidden");
  el("siteStep").classList.remove("hidden");
  showStep("site");
});

el("submitBtn").addEventListener("click", async () => {
  const checked = Array.from(document.querySelectorAll('#symptomList input:checked')).map((i) => i.value);
  if (checked.length === 0) {
    el("checkError").textContent = t(state.lang, "errorSymptomRequired");
    el("checkError").classList.remove("hidden");
    return;
  }
  el("checkError").classList.add("hidden");
  el("submitBtn").disabled = true;
  el("submitBtn").textContent = t(state.lang, "submittingBtn");

  try {
    const res = await apiPost("submitCheck", {
      siteName: state.siteName,
      workerName: state.workerName,
      answers: { symptoms: checked, otherText: el("otherText").value.trim() }
    });
    renderResult(res);
    showStep("result");
  } catch (e) {
    el("checkError").textContent = t(state.lang, "errorGeneric");
    el("checkError").classList.remove("hidden");
  } finally {
    el("submitBtn").disabled = false;
    el("submitBtn").textContent = t(state.lang, "submitBtn");
  }
});

el("backBtn").addEventListener("click", () => {
  document.querySelectorAll('#symptomList input:checked').forEach((i) => { i.checked = false; });
  document.querySelectorAll('.symptom-item.checked').forEach((i) => i.classList.remove("checked"));
  el("otherText").value = "";
  el("otherText").classList.add("hidden");
  showStep("check");
});

function renderResult(res) {
  const lang = state.lang;
  const badge = el("resultBadge");
  badge.className = "result-badge result-level-" + res.level;
  badge.innerHTML = `<div class="level">${t(lang, "level_" + res.level)}</div>`;

  const guideList = el("guideList");
  guideList.innerHTML = (res.guide || []).map((g) => `<li>${g}</li>`).join("");

  const isAlert = res.level === "경고" || res.level === "위험";
  el("hotlineBox").classList.toggle("hidden", !isAlert);
}

(async function init() {
  applyLangTexts();
  await Promise.all([loadSites(), loadAppConfig()]);
  initInfoBar();
})();
