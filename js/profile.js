/* ============================================================
   GymBuddy — profile.js
   Local profile create/edit/switch/delete, stats (incl. BMI),
   bodyweight log with a hand-drawn canvas trend line, and a
   program-progress summary. Everything reads/writes through the
   Store helper in storage.js (localStorage only).
   ============================================================ */

(function () {
  const emptyState = document.getElementById("emptyState");
  const formSection = document.getElementById("formSection");
  const dashboard = document.getElementById("dashboard");
  const form = document.getElementById("profileForm");

  let formMode = "create"; // "create" | "edit"

  /* ---------- View switching ---------- */
  function showEmpty() {
    emptyState.style.display = "block";
    formSection.style.display = "none";
    dashboard.style.display = "none";
  }
  function showForm(mode) {
    formMode = mode;
    emptyState.style.display = "none";
    dashboard.style.display = "none";
    formSection.style.display = "block";
    document.getElementById("formKicker").textContent = mode === "create" ? "New profile" : "Edit profile";
    document.getElementById("formTitle").textContent = mode === "create" ? "Tell us about you" : "Update your details";
    document.getElementById("formSubmitBtn").textContent = mode === "create" ? "Create profile" : "Save changes";
    document.getElementById("formCancelBtn").style.display = mode === "edit" ? "inline-flex" : "none";

    if (mode === "edit") {
      const p = Store.getActiveProfile();
      document.getElementById("f-name").value = p.name;
      document.getElementById("f-email").value = p.email || "";
      document.getElementById("f-age").value = p.age;
      document.getElementById("f-level").value = p.level;
      document.getElementById("f-height").value = p.heightCm;
      document.getElementById("f-weight").value = p.weightKg;
      document.getElementById("f-goal").value = p.goal;
    } else {
      form.reset();
    }
  }
  function showDashboard() {
    emptyState.style.display = "none";
    formSection.style.display = "none";
    dashboard.style.display = "grid";
    renderDashboard();
  }

  function refresh() {
    const profiles = Store.listProfiles();
    if (!profiles.length) { showEmpty(); return; }
    if (!Store.getActiveProfile()) Store.setActive(profiles[0].id);
    showDashboard();
  }

  /* ---------- Form submit ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
      name: document.getElementById("f-name").value.trim(),
      email: document.getElementById("f-email").value.trim(),
      age: document.getElementById("f-age").value,
      level: document.getElementById("f-level").value,
      heightCm: document.getElementById("f-height").value,
      weightKg: document.getElementById("f-weight").value,
      goal: document.getElementById("f-goal").value,
    };
    if (formMode === "create") {
      Store.createProfile(data);
    } else {
      const active = Store.getActiveProfile();
      Store.updateProfile(active.id, {
        ...data, age: Number(data.age), heightCm: Number(data.heightCm), weightKg: Number(data.weightKg),
      });
    }
    refresh();
  });

  document.getElementById("emptyCreateBtn").addEventListener("click", () => showForm("create"));
  document.getElementById("newProfileBtn").addEventListener("click", () => showForm("create"));
  document.getElementById("editBtn").addEventListener("click", () => showForm("edit"));
  document.getElementById("formCancelBtn").addEventListener("click", () => refresh());
  document.getElementById("deleteBtn").addEventListener("click", () => {
    const active = Store.getActiveProfile();
    if (!active) return;
    if (confirm(`Delete the local profile "${active.name}"? This cannot be undone.`)) {
      Store.deleteProfile(active.id);
      refresh();
    }
  });

  /* ---------- Dashboard ---------- */
  function bmi(weightKg, heightCm) {
    const h = heightCm / 100;
    return (weightKg / (h * h)).toFixed(1);
  }

  function renderProfileCard(p) {
    document.getElementById("avatarInitial").textContent = p.name.trim().charAt(0).toUpperCase() || "?";
    document.getElementById("dName").textContent = p.name;
    document.getElementById("dMeta").textContent = `${p.goal} · ${p.level}`;

    const list = document.getElementById("profileList");
    list.innerHTML = Store.listProfiles().map(pr => `
      <li><button class="${pr.id === p.id ? "active" : ""}" data-id="${pr.id}">${pr.name}</button></li>
    `).join("");
    list.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => { Store.setActive(btn.dataset.id); renderDashboard(); });
    });
  }

  function renderStats(p) {
    document.getElementById("statRow").innerHTML = `
      <div class="stat-tile"><b>${p.age}</b><span>Age</span></div>
      <div class="stat-tile"><b>${p.heightCm} cm</b><span>Height</span></div>
      <div class="stat-tile"><b>${p.weightKg} kg</b><span>Weight</span></div>
      <div class="stat-tile"><b>${bmi(p.weightKg, p.heightCm)}</b><span>BMI (reference only)</span></div>`;
  }

  function renderProgress(p) {
    const trainingDays = PROGRAM.days.filter(d => d.type === "training");
    let totalDone = 0, totalIds = 0;

    const rows = trainingDays.map(d => {
      const exs = exercisesForDay(d.day);
      const idsForDay = d.day === 1 ? [...exs.map(e => e.id), "incline-treadmill-walk"] : [...exs.map(e => e.id), `cardio-day-${d.day}`];
      const done = idsForDay.filter(id => p.progress[id]).length;
      totalDone += done; totalIds += idsForDay.length;
      const pct = idsForDay.length ? Math.round((done / idsForDay.length) * 100) : 0;
      return `
        <div class="day-row" style="cursor:pointer" data-nav="program.html">
          <b>Day ${d.day} — ${d.label}</b>
          <span>${done}/${idsForDay.length} done (${pct}%)</span>
        </div>`;
    }).join("");

    const overallPct = totalIds ? Math.round((totalDone / totalIds) * 100) : 0;
    document.getElementById("progressList").innerHTML = `
      <div style="margin-bottom:16px;">
        <div class="day-progress" style="justify-content:space-between;">
          <span style="font-weight:700;color:var(--text)">Overall program completion</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <span>${overallPct}%</span>
            <div class="bar" style="width:140px;"><i style="width:${overallPct}%"></i></div>
          </div>
        </div>
      </div>
      ${rows}
      <div class="form-actions"><a href="program.html" class="btn btn-ghost btn-sm">Open full program &amp; checklist →</a></div>
    `;
    document.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", () => window.location.href = el.dataset.nav);
    });
  }

  function renderWeight(p) {
    const rows = [...p.weightLog].reverse().map(w => `<tr><td>${w.date}</td><td>${w.weightKg}</td></tr>`).join("");
    document.getElementById("weightRows").innerHTML = rows || `<tr><td colspan="2" class="hint">No entries yet.</td></tr>`;
    drawChart(p.weightLog);
  }

  function drawChart(log) {
    const canvas = document.getElementById("weightChart");
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height, pad = 30;
    ctx.clearRect(0, 0, w, h);
    if (log.length < 2) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "13px sans-serif";
      ctx.fillText("Log at least two entries to see a trend line.", pad, h / 2);
      return;
    }
    const weights = log.map(l => l.weightKg);
    const min = Math.min(...weights) - 1, max = Math.max(...weights) + 1;
    const stepX = (w - pad * 2) / (log.length - 1);
    const y = v => h - pad - ((v - min) / (max - min)) * (h - pad * 2);

    ctx.strokeStyle = "#262b33";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const gy = pad + ((h - pad * 2) / 3) * i;
      ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(w - pad, gy); ctx.stroke();
    }

    ctx.strokeStyle = "#1fd1a8";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    log.forEach((entry, i) => {
      const x = pad + stepX * i;
      const yy = y(entry.weightKg);
      if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    });
    ctx.stroke();

    ctx.fillStyle = "#1fd1a8";
    log.forEach((entry, i) => {
      const x = pad + stepX * i;
      const yy = y(entry.weightKg);
      ctx.beginPath(); ctx.arc(x, yy, 3, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = "#a4acb8";
    ctx.font = "11px sans-serif";
    ctx.fillText(`${max.toFixed(0)} kg`, 2, pad);
    ctx.fillText(`${min.toFixed(0)} kg`, 2, h - pad + 4);
  }

  document.getElementById("weightForm").addEventListener("submit", e => {
    e.preventDefault();
    const val = document.getElementById("w-weight").value;
    const active = Store.getActiveProfile();
    if (!val || !active) return;
    Store.addWeightEntry(active.id, val);
    document.getElementById("w-weight").value = "";
    renderDashboard();
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  function renderDashboard() {
    const p = Store.getActiveProfile();
    if (!p) { refresh(); return; }
    renderProfileCard(p);
    renderStats(p);
    renderProgress(p);
    renderWeight(p);
  }

  refresh();
})();
