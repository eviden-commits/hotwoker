/**
 * admin.js
 * 관리자 대시보드 로직
 */

const adminState = {
  password: sessionStorage.getItem("hw_admin_pwd") || "",
  submissions: [],
  sites: []
};

const $ = (id) => document.getElementById(id);

const SYMPTOM_LABELS_KO = {
  bodyTempHigh: "평소보다 높은 체온",
  headache: "두통",
  dizziness: "어지러움",
  nausea: "메스꺼움 / 구역질",
  cramps: "근육경련",
  excessiveSweat: "지나치게 많은 땀",
  fatigue: "갑작스러운 피로감",
  severeThirst: "심한 갈증",
  consciousness: "의식저하 / 혼란 (응급)",
  other: "기타"
};

async function login() {
  const pwd = $("loginPwd").value.trim();
  if (!pwd) return;
  $("loginBtn").disabled = true;
  try {
    const res = await apiPost("adminLogin", { password: pwd });
    if (res.ok) {
      adminState.password = pwd;
      sessionStorage.setItem("hw_admin_pwd", pwd);
      enterDashboard();
    } else {
      $("loginMsg").textContent = "비밀번호가 올바르지 않습니다.";
    }
  } catch (e) {
    $("loginMsg").textContent = "로그인 중 오류가 발생했습니다.";
  } finally {
    $("loginBtn").disabled = false;
  }
}

async function enterDashboard() {
  $("loginSection").style.display = "none";
  $("dashboardSection").style.display = "block";
  await Promise.all([loadSites(), loadSubmissions(), loadAppConfig()]);
}

async function loadAppConfig() {
  const res = await apiGet("getAppConfig");
  if (res.spreadsheetId) {
    $("sheetLinkBtn").href = `https://docs.google.com/spreadsheets/d/${res.spreadsheetId}/edit`;
  }
}

async function loadSites() {
  const res = await apiGet("getSiteList");
  adminState.sites = res.sites || [];
  const select = $("filterSite");
  select.innerHTML = `<option value="">전체 현장</option>` +
    adminState.sites.map((s) => `<option value="${s.siteName}">${s.siteName}</option>`).join("");
  renderSitesTable();
}

function renderSitesTable() {
  const tbody = $("sitesBody");
  tbody.innerHTML = adminState.sites.map((s) => `
    <tr>
      <td>${s.siteName}</td>
      <td><input type="text" class="site-name-input" data-field="contactName" data-site="${s.siteName}" value="${s.contactName || ""}" placeholder="담당자명" style="width:80px;" /></td>
      <td><input type="text" class="site-phone-input" data-field="emergencyPhone" data-site="${s.siteName}" value="${s.emergencyPhone || ""}" placeholder="비상연락처" /></td>
      <td><input type="text" class="site-geo-input" data-field="lat" data-site="${s.siteName}" value="${s.lat ?? ""}" placeholder="위도" style="width:90px;" /></td>
      <td><input type="text" class="site-geo-input" data-field="lng" data-site="${s.siteName}" value="${s.lng ?? ""}" placeholder="경도" style="width:90px;" /></td>
      <td><button data-site="${s.siteName}" class="save-site-btn">저장</button></td>
    </tr>`).join("");

  tbody.querySelectorAll(".save-site-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const site = btn.dataset.site;
      const escaped = CSS.escape(site);
      const contactName = tbody.querySelector(`.site-name-input[data-site="${escaped}"]`).value.trim();
      const phone = tbody.querySelector(`.site-phone-input[data-site="${escaped}"]`).value.trim();
      const lat = tbody.querySelector(`.site-geo-input[data-field="lat"][data-site="${escaped}"]`).value.trim();
      const lng = tbody.querySelector(`.site-geo-input[data-field="lng"][data-site="${escaped}"]`).value.trim();
      await apiPost("updateSite", { password: adminState.password, siteName: site, contactName, emergencyPhone: phone, lat, lng });
      await loadSites();
    });
  });
}

async function loadSubmissions() {
  const params = {
    password: adminState.password,
    siteName: $("filterSite").value,
    level: $("filterLevel").value,
    status: $("filterStatus").value
  };
  const res = await apiGet("listSubmissions", params);
  if (res.authError) {
    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    logout();
    return;
  }
  adminState.submissions = res.submissions || [];
  renderKpi();
  renderTable();
}

function renderKpi() {
  const rows = adminState.submissions;
  const today = new Date().toDateString();
  const todayRows = rows.filter((r) => new Date(r.timestamp).toDateString() === today);
  const alertRows = rows.filter((r) => r.level === "경고" || r.level === "위험");
  const unconfirmed = rows.filter((r) => r.status === "미확인");

  $("kpiToday").textContent = todayRows.length;
  $("kpiAlert").textContent = alertRows.length;
  $("kpiUnconfirmed").textContent = unconfirmed.length;
  $("kpiSites").textContent = adminState.sites.length;
}

function renderTable() {
  const tbody = $("submissionsBody");
  $("selectAllCheckbox").checked = false;
  updateDeleteButtonState();

  if (adminState.submissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--muted);">데이터가 없습니다.</td></tr>`;
    return;
  }
  tbody.innerHTML = adminState.submissions.map((r) => {
    const ts = new Date(r.timestamp);
    const tsStr = `${ts.getMonth() + 1}/${ts.getDate()} ${String(ts.getHours()).padStart(2, "0")}:${String(ts.getMinutes()).padStart(2, "0")}`;
    const statusBadge = r.status ? `<span class="badge badge-${r.status}">${r.status}</span>` : "-";
    const actions = r.status ? `
      <div class="status-actions">
        <button data-id="${r.id}" data-status="조치중">조치중</button>
        <button data-id="${r.id}" data-status="완료">완료</button>
      </div>` : "";
    return `
      <tr data-id="${r.id}">
        <td><input type="checkbox" class="row-checkbox" data-id="${r.id}" /></td>
        <td>${tsStr}</td>
        <td>${r.siteName}</td>
        <td>${r.workerName}</td>
        <td><span class="badge badge-${r.level}">${r.level}</span></td>
        <td>${r.score}</td>
        <td>${statusBadge}</td>
        <td>${actions}</td>
      </tr>`;
  }).join("");

  tbody.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      updateStatus(btn.dataset.id, btn.dataset.status);
    });
  });
  tbody.querySelectorAll(".row-checkbox").forEach((cb) => {
    cb.addEventListener("click", (evt) => evt.stopPropagation());
    cb.addEventListener("change", updateDeleteButtonState);
  });
  tbody.querySelectorAll("tr[data-id]").forEach((row) => {
    row.addEventListener("dblclick", () => openDetailModal(row.dataset.id));
  });
}

function openDetailModal(id) {
  const record = adminState.submissions.find((r) => r.id === id);
  if (!record) return;
  adminState.modalRecordId = id;

  const ts = new Date(record.timestamp);
  $("modalTimestamp").textContent = `${ts.getMonth() + 1}/${ts.getDate()} ${String(ts.getHours()).padStart(2, "0")}:${String(ts.getMinutes()).padStart(2, "0")}`;
  $("modalSite").textContent = record.siteName;
  $("modalName").textContent = record.workerName;
  $("modalLevel").innerHTML = `<span class="badge badge-${record.level}">${record.level}</span>`;
  $("modalStatus").innerHTML = record.status ? `<span class="badge badge-${record.status}">${record.status}</span>` : "-";

  let answers = {};
  try { answers = JSON.parse(record.answersJson || "{}"); } catch (e) { answers = {}; }
  const symptoms = (answers.symptoms || []).filter((s) => s !== "none");
  const list = $("modalSymptomList");
  if (symptoms.length === 0) {
    list.innerHTML = `<li>체크된 항목 없음</li>`;
  } else {
    list.innerHTML = symptoms.map((key) => {
      const label = key === "other" && answers.otherText
        ? `기타: ${answers.otherText}`
        : (SYMPTOM_LABELS_KO[key] || key);
      return `<li>${label}</li>`;
    }).join("");
  }

  const hasStatus = !!record.status;
  $("modalInProgressBtn").classList.toggle("hidden", !hasStatus);
  $("modalDoneBtn").classList.toggle("hidden", !hasStatus);

  $("detailModal").classList.remove("hidden");
}

function closeDetailModal() {
  $("detailModal").classList.add("hidden");
  adminState.modalRecordId = null;
}

async function updateStatusFromModal(status) {
  if (!adminState.modalRecordId) return;
  await updateStatus(adminState.modalRecordId, status);
  closeDetailModal();
}

function getSelectedIds() {
  return Array.from(document.querySelectorAll(".row-checkbox:checked")).map((cb) => cb.dataset.id);
}

function updateDeleteButtonState() {
  $("deleteSelectedBtn").disabled = getSelectedIds().length === 0;
}

async function deleteSelected() {
  const ids = getSelectedIds();
  if (ids.length === 0) return;
  if (!confirm(`선택한 ${ids.length}건을 삭제하시겠습니까? 되돌릴 수 없습니다.`)) return;
  await apiPost("deleteSubmissions", { password: adminState.password, ids });
  await loadSubmissions();
}

async function updateStatus(id, status) {
  await apiPost("updateSubmissionStatus", { password: adminState.password, id, status, handledBy: "관리자" });
  await loadSubmissions();
}

async function addSite() {
  const name = $("newSiteName").value.trim();
  if (!name) return;
  $("siteManageMsg").textContent = "";
  try {
    await apiPost("addSite", {
      password: adminState.password,
      siteName: name,
      contactName: $("newSiteContactName").value.trim(),
      emergencyPhone: $("newSitePhone").value.trim(),
      lat: $("newSiteLat").value.trim(),
      lng: $("newSiteLng").value.trim()
    });
    $("newSiteName").value = "";
    $("newSiteContactName").value = "";
    $("newSitePhone").value = "";
    $("newSiteLat").value = "";
    $("newSiteLng").value = "";
    $("newSiteAddress").value = "";
    await loadSites();
  } catch (e) {
    $("siteManageMsg").textContent = "현장 추가 중 오류가 발생했습니다.";
  }
}

async function geocodeAddress() {
  const address = $("newSiteAddress").value.trim();
  if (!address) return;
  $("siteManageMsg").textContent = "";
  $("siteManageMsg").style.color = "";
  $("geocodeBtn").disabled = true;
  $("geocodeBtn").textContent = "검색 중...";
  try {
    const res = await apiGet("geocodeAddress", { password: adminState.password, address });
    if (res.error) {
      $("siteManageMsg").textContent = res.error;
    } else {
      $("newSiteLat").value = res.lat;
      $("newSiteLng").value = res.lng;
      $("siteManageMsg").style.color = "var(--success)";
      $("siteManageMsg").textContent = `좌표를 찾았습니다: ${res.formattedAddress}`;
    }
  } catch (e) {
    $("siteManageMsg").textContent = "좌표 검색 중 오류가 발생했습니다.";
  } finally {
    $("geocodeBtn").disabled = false;
    $("geocodeBtn").textContent = "좌표 찾기";
  }
}

function logout() {
  sessionStorage.removeItem("hw_admin_pwd");
  adminState.password = "";
  $("dashboardSection").style.display = "none";
  $("loginSection").style.display = "flex";
}

$("loginBtn").addEventListener("click", login);
$("loginPwd").addEventListener("keydown", (e) => { if (e.key === "Enter") login(); });
$("refreshBtn").addEventListener("click", loadSubmissions);
$("logoutBtn").addEventListener("click", logout);
$("filterSite").addEventListener("change", loadSubmissions);
$("filterLevel").addEventListener("change", loadSubmissions);
$("filterStatus").addEventListener("change", loadSubmissions);
$("addSiteBtn").addEventListener("click", addSite);
$("geocodeBtn").addEventListener("click", geocodeAddress);
$("deleteSelectedBtn").addEventListener("click", deleteSelected);
$("selectAllCheckbox").addEventListener("change", (e) => {
  document.querySelectorAll(".row-checkbox").forEach((cb) => { cb.checked = e.target.checked; });
  updateDeleteButtonState();
});
$("modalCloseBtn").addEventListener("click", closeDetailModal);
$("detailModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeDetailModal();
});
$("modalInProgressBtn").addEventListener("click", () => updateStatusFromModal("조치중"));
$("modalDoneBtn").addEventListener("click", () => updateStatusFromModal("완료"));

if (adminState.password) {
  enterDashboard();
}
