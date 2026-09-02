# GymBuddy

A Gymverse-inspired, dark-themed fitness website built entirely from a real training
plan: **"4-Day Fat Loss Program — Fitness Time (Standard Commercial Gym)."**

It turns that plan into a browser-based companion with three pieces:

- **Program** (`program.html`) — the full day-by-day Upper/Lower x2 split, every
  guideline (warm-up, rest times, tempo, progression, cardio, impact), and the plan's
  closing notes, reproduced verbatim from the source document.
- **Exercise library** (`exercises.html`) — all 24 strength exercises and 5 cardio
  finishers from the plan, each with an original line-art diagram and clear
  step-by-step "how to perform it" instructions, searchable and filterable by
  muscle group.
- **Profile** (`profile.html`) — create a local profile, log bodyweight over time
  (with a small trend chart), and check off exercises as you complete each day.

## Design notes

- Styled after **Gymverse**-style workout apps: dark UI, card-based layouts, a
  teal accent, muscle-group color coding.
- All exercise diagrams are **original illustrations drawn for this project**, not
  photographs — they're inline SVG, so the whole site loads instantly and works
  completely offline with zero external image/network requests.
- Profiles are a **local, personal profile system**, not a secure login: all data
  (name, stats, weight log, workout checkmarks) is stored in the browser's
  `localStorage` on your device only. There is no backend, no server, and nothing
  is transmitted anywhere.
- All program facts (sets, reps, exercise selection, guidelines, notes) are taken
  directly from the uploaded training plan — see `js/data.js` for the structured
  source data.

## Running it

This is a static site — no build step, no dependencies. Two ways to run it:

1. **Just open it.** Double-click `index.html` (or open it via `File → Open` in
   your browser). Everything works, since all data is embedded in the JS files.
2. **Serve it** (optional, avoids any browser file:// quirks):
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

## Project structure

```
index.html          Landing page
program.html         Day-by-day training program + progress checklist
exercises.html       Illustrated exercise library with search/filter + detail modal
profile.html          Local profile: stats, bodyweight log, program progress
css/style.css         Shared dark theme
js/data.js             Program + exercise content (source of truth) + icon SVGs
js/storage.js          localStorage-backed profile store
js/main.js              Shared nav behavior
js/exercises.js         Exercise library rendering, filters, modal
js/program.js            Program page rendering + progress checkboxes
js/profile.js             Profile create/edit/switch/delete, weight chart
assets/img/favicon.svg   Site icon
```

## Disclaimer

This is general training information sourced from a specific gym program, not
personalized medical or professional coaching advice. If an exercise causes joint
pain, stop and consult a trainer or medical professional.
