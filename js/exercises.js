/* ============================================================
   GymBuddy — exercises.js
   Renders the exercise library grid with search + muscle filters,
   and a detail modal with full how-to steps and tips.
   ============================================================ */

(function () {
  const grid = document.getElementById("exGrid");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("search");
  const muscleFilters = document.getElementById("muscleFilters");

  let activeMuscle = "all";
  let query = "";

  function buildMuscleChips() {
    const muscles = ["all", ...Object.keys(MUSCLE_LABELS)];
    muscleFilters.innerHTML = muscles.map(m => {
      const label = m === "all" ? "All muscle groups" : MUSCLE_LABELS[m];
      return `<button class="chip ${m === activeMuscle ? "active" : ""}" data-muscle="${m}">${label}</button>`;
    }).join("");
    muscleFilters.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        activeMuscle = chip.dataset.muscle;
        buildMuscleChips();
        render();
      });
    });
  }

  function cardTemplate(ex) {
    const color = MUSCLE_COLORS[ex.muscle];
    const dayText = ex.day ? `Day ${ex.day} — ${ex.dayLabel}` : ex.dayLabel;
    return `
      <div class="ex-card" style="--accent-cat:${color}" data-id="${ex.id}">
        <div class="ex-media">${ICONS[ex.icon]}</div>
        <div class="ex-body">
          <h3>${ex.name}</h3>
          <div class="ex-meta">
            <span class="badge" style="--accent-cat:${color}">${MUSCLE_LABELS[ex.muscle]}</span>
            <span class="badge" style="--accent-cat:#8892a0">${ex.equipment}</span>
          </div>
          <div class="ex-sets"><b>${ex.sets}</b> · ${dayText}</div>
        </div>
      </div>`;
  }

  function render() {
    const q = query.trim().toLowerCase();
    const list = EXERCISES.filter(ex => {
      const matchesMuscle = activeMuscle === "all" || ex.muscle === activeMuscle;
      const matchesQuery = !q || ex.name.toLowerCase().includes(q) || ex.equipment.toLowerCase().includes(q);
      return matchesMuscle && matchesQuery;
    });
    grid.innerHTML = list.map(cardTemplate).join("");
    emptyState.style.display = list.length ? "none" : "block";
    grid.querySelectorAll(".ex-card").forEach(card => {
      card.addEventListener("click", () => openModal(card.dataset.id));
    });
  }

  searchInput.addEventListener("input", e => { query = e.target.value; render(); });

  /* ---------- Modal ---------- */
  const overlay = document.getElementById("modalOverlay");
  const mIcon = document.getElementById("mIcon");
  const mBadge = document.getElementById("mBadge");
  const mTitle = document.getElementById("mTitle");
  const mMeta = document.getElementById("mMeta");
  const mSets = document.getElementById("mSets");
  const mSteps = document.getElementById("mSteps");
  const mTips = document.getElementById("mTips");
  const mDay = document.getElementById("mDay");

  function openModal(id) {
    const ex = exerciseById(id);
    if (!ex) return;
    const color = MUSCLE_COLORS[ex.muscle];
    document.querySelector(".modal-head").style.setProperty("--accent-cat", color);
    mIcon.style.setProperty("--accent-cat", color);
    mIcon.style.color = color;
    mIcon.innerHTML = ICONS[ex.icon];
    mBadge.textContent = MUSCLE_LABELS[ex.muscle];
    mBadge.style.setProperty("--accent-cat", color);
    mTitle.textContent = ex.name;
    mMeta.textContent = ex.equipment;
    mSets.textContent = ex.sets;
    mSteps.innerHTML = ex.steps.map(s => `<li>${s}</li>`).join("");
    mTips.innerHTML = ex.tips.map(t => `<li>${t}</li>`).join("");
    mDay.textContent = ex.day ? `Day ${ex.day} · ${ex.dayLabel}` : ex.dayLabel;
    overlay.classList.add("open");
  }

  function closeModal() { overlay.classList.remove("open"); }
  document.getElementById("mClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  buildMuscleChips();
  render();

  const params = new URLSearchParams(location.search);
  const deepLinkId = params.get("ex");
  if (deepLinkId && exerciseById(deepLinkId)) openModal(deepLinkId);
})();
