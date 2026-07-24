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
  await Promise.all([loadSites(), loadSubmissions()]);
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
      <td><input type="text" class="site-phone-input" data-field="emergencyPhone" data-site="${s.siteName}" value="${s.emergencyPhone || ""}" placeholder="비상연락처" /></td>
      <td><input type="text" class="site-geo-input" data-field="lat" data-site="${s.siteName}" value="${s.lat ?? ""}" placeholder="위도" style="width:90px;" /></td>
      <td><input type="text" class="site-geo-input" data-field="lng" data-site="${s.siteName}" value="${s.lng ?? ""}" placeholder="경도" style="width:90px;" /></td>
      <td><button data-site="${s.siteName}" class="save-site-btn">저장</button></td>
    </tr>`).join("");

  tbody.querySelectorAll(".save-site-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const site = btn.dataset.site;
      const escaped = CSS.escape(site);
      const phone = tbody.querySelector(`.site-phone-input[data-site="${escaped}"]`).value.trim();
      const lat = tbody.querySelector(`.site-geo-input[data-field="lat"][data-site="${escaped}"]`).value.trim();
      const lng = tbody.querySelector(`.site-geo-input[data-field="lng"][data-site="${escaped}"]`).value.trim();
      await apiPost("updateSite", { password: adminState.password, siteName: site, emergencyPhone: phone, lat, lng });
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
  if (adminState.submissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted);">데이터가 없습니다.</td></tr>`;
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
      <tr>
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
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, btn.dataset.status));
  });
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
      emergencyPhone: $("newSitePhone").value.trim(),
      lat: $("newSiteLat").value.trim(),
      lng: $("newSiteLng").value.trim()
    });
    $("newSiteName").value = "";
    $("newSitePhone").value = "";
    $("newSiteLat").value = "";
    $("newSiteLng").value = "";
    await loadSites();
  } catch (e) {
    $("siteManageMsg").textContent = "현장 추가 중 오류가 발생했습니다.";
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

if (adminState.password) {
  enterDashboard();
}
