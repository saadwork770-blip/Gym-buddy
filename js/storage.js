/* ============================================================
   GymBuddy — storage.js
   Lightweight local-profile layer. Everything lives in the
   browser's localStorage on this device — there is no server,
   so this is a personal local profile, not a secure account
   system. Good for tracking your own progress on this program.
   ============================================================ */

const DB_KEY = "gymbuddy_profiles_v1";
const ACTIVE_KEY = "gymbuddy_active_profile_v1";

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function uid() {
  return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const Store = {
  listProfiles() {
    const db = loadDB();
    return Object.values(db).sort((a, b) => a.createdAt - b.createdAt);
  },

  getProfile(id) {
    const db = loadDB();
    return db[id] || null;
  },

  createProfile({ name, email, age, heightCm, weightKg, goal, level }) {
    const db = loadDB();
    const id = uid();
    db[id] = {
      id, name, email: email || "",
      age: Number(age), heightCm: Number(heightCm), weightKg: Number(weightKg),
      goal, level,
      createdAt: Date.now(),
      weightLog: [{ date: new Date().toISOString().slice(0, 10), weightKg: Number(weightKg) }],
      progress: {}, // { "d1-ex-id": true, ... }
    };
    saveDB(db);
    this.setActive(id);
    return db[id];
  },

  updateProfile(id, patch) {
    const db = loadDB();
    if (!db[id]) return null;
    Object.assign(db[id], patch);
    saveDB(db);
    return db[id];
  },

  deleteProfile(id) {
    const db = loadDB();
    delete db[id];
    saveDB(db);
    if (this.getActiveId() === id) {
      const remaining = Object.keys(db);
      this.setActive(remaining[0] || null);
    }
  },

  addWeightEntry(id, weightKg) {
    const db = loadDB();
    if (!db[id]) return null;
    db[id].weightLog.push({ date: new Date().toISOString().slice(0, 10), weightKg: Number(weightKg) });
    db[id].weightKg = Number(weightKg);
    saveDB(db);
    return db[id];
  },

  toggleExercise(id, exerciseId) {
    const db = loadDB();
    if (!db[id]) return null;
    db[id].progress[exerciseId] = !db[id].progress[exerciseId];
    saveDB(db);
    return db[id];
  },

  setActive(id) {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  },

  getActiveId() {
    return localStorage.getItem(ACTIVE_KEY);
  },

  getActiveProfile() {
    const id = this.getActiveId();
    return id ? this.getProfile(id) : null;
  },
};
