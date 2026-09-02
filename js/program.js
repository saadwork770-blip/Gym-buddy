/* ============================================================
   GymBuddy — program.js
   Renders the program page: profile summary, guidelines, the
   weekly day-by-day schedule with completion checkboxes tied to
   the active local profile, and the plan's notes.
   ============================================================ */

(function () {
  const CARDIO_LINK_BY_DAY = { 1: "incline-treadmill-walk" };

  document.getElementById("pIntro").textContent =
    `Split: ${PROGRAM.split} · Frequency: ${PROGRAM.frequency}`;

  function renderProfileStats() {
    const active = Store.getActiveProfile();
    const el = document.getElementById("profileStats");
    const hint = document.getElementById("loginHint");

    if (active) {
      hint.innerHTML = `Showing progress for <b style="color:var(--text)">${active.name}</b> — checkmarks below save automatically. <a href="profile.html" style="color:var(--accent)">Switch profile →</a>`;
      el.innerHTML = `
        <div class="stat-tile"><b>${active.age}</b><span>Age</span></div>
        <div class="stat-tile"><b>${active.heightCm} cm</b><span>Height</span></div>
        <div class="stat-tile"><b>${active.weightKg} kg</b><span>Current weight</span></div>
        <div class="stat-tile"><b>${active.level}</b><span>Level · ${active.goal}</span></div>`;
    } else {
      hint.innerHTML = `No active profile yet — showing the plan's sample profile. <a href="profile.html" style="color:var(--accent)">Create a profile →</a> to save your own progress.`;
      const p = PROGRAM.profile;
      el.innerHTML = `
        <div class="stat-tile"><b>${p.age}</b><span>Age</span></div>
        <div class="stat-tile"><b>${p.heightCm} cm</b><span>Height</span></div>
        <div class="stat-tile"><b>${p.weightKg} kg</b><span>Weight</span></div>
        <div class="stat-tile"><b>${p.level}</b><span>Level · ${p.goal}</span></div>`;
    }
  }

  function renderGuidelines() {
    document.getElementById("guidelines").innerHTML = PROGRAM.guidelines.map(g => `
      <div class="guideline"><b>${g.title}</b><p>${g.text}</p></div>
    `).join("");
  }

  function renderNotes() {
    document.getElementById("notesList").innerHTML = PROGRAM.notes.map(n => `<li>${n}</li>`).join("");
  }

  function progressFor(profile, ids) {
    if (!profile) return 0;
    const done = ids.filter(id => profile.progress[id]).length;
    return ids.length ? Math.round((done / ids.length) * 100) : 0;
  }

  function dayRowTemplate(ex, profile) {
    const checked = profile && profile.progress[ex.id];
    return `
      <tr data-row-id="${ex.id}">
        <td class="check-cell"><button class="check ${checked ? "done" : ""}" data-id="${ex.id}" ${profile ? "" : "disabled title=\"Create a profile to track progress\""}>${checked ? "✓" : ""}</button></td>
        <td><span class="ex-name-link" data-id="${ex.id}">${ex.name}</span></td>
        <td>${ex.sets}</td>
      </tr>`;
  }

  function renderDays() {
    const profile = Store.getActiveProfile();
    const container = document.getElementById("daysContainer");
    container.innerHTML = PROGRAM.days.map(d => {
      if (d.type === "rest") {
        return `
          <div class="day-card">
            <div class="day-head"><div><h3>Day ${d.day} — ${d.label}</h3></div></div>
            <table class="ex-table"><tbody><tr class="rest-row"><td>${d.text}</td></tr></tbody></table>
          </div>`;
      }
      const exs = exercisesForDay(d.day);
      const cardioId = CARDIO_LINK_BY_DAY[d.day];
      const trackIds = [...exs.map(e => e.id), cardioId || `cardio-day-${d.day}`];
      const pct = progressFor(profile, trackIds);
      const rows = exs.map(ex => dayRowTemplate(ex, profile)).join("");
      const cardioRow = cardioId
        ? dayRowTemplate(exerciseById(cardioId), profile)
        : (() => {
            const id = `cardio-day-${d.day}`;
            const checked = profile && profile.progress[id];
            return `<tr>
              <td class="check-cell"><button class="check ${checked ? "done" : ""}" data-id="${id}" ${profile ? "" : "disabled"}>${checked ? "✓" : ""}</button></td>
              <td>Cardio finisher</td><td>${d.cardio}</td>
            </tr>`;
          })();
      return `
        <div class="day-card">
          <div class="day-head">
            <div><h3>Day ${d.day} — ${d.label}</h3><div class="day-sub">${exs.length} exercises + cardio finisher</div></div>
            <div class="day-progress"><span>${pct}% done</span><div class="bar"><i style="width:${pct}%"></i></div></div>
          </div>
          <table class="ex-table">
            <thead><tr><th></th><th>Exercise</th><th>Sets x Reps</th></tr></thead>
            <tbody>${rows}${cardioRow}</tbody>
          </table>
        </div>`;
    }).join("");

    container.querySelectorAll(".check").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!profile) return;
        Store.toggleExercise(profile.id, btn.dataset.id);
        renderProfileStats();
        renderDays();
      });
    });
    container.querySelectorAll(".ex-name-link").forEach(link => {
      link.addEventListener("click", () => {
        window.location.href = `exercises.html?ex=${encodeURIComponent(link.dataset.id)}`;
      });
    });
  }

  renderProfileStats();
  renderGuidelines();
  renderDays();
  renderNotes();
})();
