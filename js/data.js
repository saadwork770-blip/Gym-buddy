/* ============================================================
   GymBuddy — data.js
   Source of truth for all exercise + program content.
   All facts (sets, reps, exercise selection, guidelines, notes)
   are taken directly from the uploaded training plan:
   "4-Day Fat Loss Program — Fitness Time (Standard Commercial Gym)".
   The illustrations below are original line-art diagrams drawn for
   this site (not photographs) so the whole page works fully offline
   with zero external image requests.
   ============================================================ */

const MUSCLE_COLORS = {
  chest:     "#ff6b6b",
  back:      "#4dabf7",
  shoulders: "#9775fa",
  arms:      "#ffa94d",
  legs:      "#51cf66",
  glutes:    "#f783ac",
  core:      "#ffd43b",
  cardio:    "#22d3ee",
};

const MUSCLE_LABELS = {
  chest: "Chest", back: "Back", shoulders: "Shoulders", arms: "Arms",
  legs: "Legs", glutes: "Glutes", core: "Core", cardio: "Cardio",
};

/* ---------- Reusable line-art icon set (currentColor strokes) ---------- */
const ICONS = {
  machine: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="40" width="18" height="8" rx="2"/>
    <rect x="10" y="20" width="8" height="22" rx="2"/>
    <path d="M18 26 L38 30"/>
    <circle cx="40" cy="30" r="2.5" fill="currentColor" stroke="none"/>
    <rect x="46" y="14" width="12" height="34" rx="1.5"/>
    <line x1="46" y1="21" x2="58" y2="21"/>
    <line x1="46" y1="27" x2="58" y2="27"/>
    <line x1="46" y1="33" x2="58" y2="33"/>
    <line x1="46" y1="39" x2="58" y2="39"/>
    <circle cx="52" cy="10" r="2.5"/>
  </svg>`,

  cable: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="14" y1="6" x2="14" y2="58"/>
    <circle cx="14" cy="10" r="3.5"/>
    <path d="M14 13 C14 26, 30 24, 30 38"/>
    <path d="M25 35 L30 38 L35 35" />
    <rect x="6" y="44" width="12" height="18" rx="1.5"/>
    <line x1="6" y1="49" x2="18" y2="49"/>
    <line x1="6" y1="54" x2="18" y2="54"/>
    <line x1="6" y1="59" x2="18" y2="59"/>
  </svg>`,

  dumbbell: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="20" y1="32" x2="44" y2="32"/>
    <rect x="10" y="22" width="8" height="20" rx="2"/>
    <rect x="4" y="26" width="6" height="12" rx="1.5"/>
    <rect x="46" y="22" width="8" height="20" rx="2"/>
    <rect x="54" y="26" width="6" height="12" rx="1.5"/>
  </svg>`,

  bodyweight: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="14" cy="16" r="5"/>
    <line x1="18" y1="20" x2="46" y2="34"/>
    <line x1="24" y1="24" x2="16" y2="14"/>
    <line x1="26" y1="26" x2="34" y2="16"/>
    <line x1="40" y1="31" x2="52" y2="24"/>
    <line x1="40" y1="31" x2="50" y2="42"/>
    <line x1="46" y1="34" x2="58" y2="46"/>
  </svg>`,

  treadmill: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="36" width="40" height="10" rx="5"/>
    <circle cx="12" cy="41" r="2" fill="currentColor" stroke="none"/>
    <circle cx="40" cy="41" r="2" fill="currentColor" stroke="none"/>
    <line x1="44" y1="36" x2="52" y2="14"/>
    <line x1="52" y1="14" x2="58" y2="14"/>
    <line x1="52" y1="14" x2="52" y2="22"/>
    <line x1="44" y1="46" x2="30" y2="58"/>
  </svg>`,

  bike: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="22" cy="44" r="12"/>
    <circle cx="22" cy="44" r="2" fill="currentColor" stroke="none"/>
    <path d="M22 44 L38 44 L46 20"/>
    <line x1="38" y1="44" x2="30" y2="26"/>
    <line x1="30" y1="26" x2="42" y2="26"/>
    <path d="M46 20 L52 20"/>
    <rect x="28" y="18" width="6" height="6" rx="1"/>
  </svg>`,

  elliptical: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 46 C 20 54, 44 54, 56 46" />
    <line x1="16" y1="46" x2="34" y2="20"/>
    <line x1="46" y1="46" x2="28" y2="24"/>
    <line x1="34" y1="20" x2="34" y2="10"/>
    <circle cx="34" cy="8" r="2" fill="currentColor" stroke="none"/>
    <line x1="20" y1="30" x2="30" y2="14"/>
  </svg>`,

  rower: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="48" x2="52" y2="30"/>
    <rect x="20" y="38" width="10" height="6" rx="1.5" transform="rotate(-20 20 38)"/>
    <circle cx="52" cy="24" r="8"/>
    <line x1="30" y1="34" x2="46" y2="24"/>
    <line x1="6" y1="48" x2="12" y2="56"/>
  </svg>`,

  stairmaster: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="14" y1="10" x2="14" y2="50"/>
    <line x1="50" y1="10" x2="50" y2="50"/>
    <rect x="8" y="34" width="20" height="6" rx="1.5"/>
    <rect x="36" y="20" width="20" height="6" rx="1.5"/>
    <line x1="14" y1="10" x2="20" y2="10"/>
    <line x1="50" y1="10" x2="44" y2="10"/>
  </svg>`,
};

/* ---------- Exercise library (24 strength + 5 cardio, from the plan) ---------- */
const EXERCISES = [
  // ===== DAY 1 — Upper Body A =====
  {
    id: "chest-press-machine", name: "Chest Press Machine", day: 1, dayLabel: "Upper Body A",
    equipment: "Machine", muscle: "chest", icon: "machine", sets: "4 x 10–12",
    steps: [
      "Adjust the seat so the handles line up with mid-chest height.",
      "Sit back with shoulder blades pulled down and back against the pad.",
      "Grip the handles and press forward until your arms are extended without locking the elbows.",
      "Pause briefly, then return under control to the start position.",
      "Keep the movement controlled — no jerking or bouncing off the stack."
    ],
    tips: [
      "Rest 90–120 sec between sets (compound lift).",
      "Add weight or 1–2 reps once you hit the top of the rep range with good form on all sets."
    ]
  },
  {
    id: "lat-pulldown-wide", name: "Lat Pulldown (Wide Grip)", day: 1, dayLabel: "Upper Body A",
    equipment: "Cable", muscle: "back", icon: "cable", sets: "4 x 10–12",
    steps: [
      "Set the knee pad snug against your thighs and grip the bar wider than shoulder width.",
      "Sit tall, lean back slightly, and pull the bar down to upper chest level.",
      "Drive your elbows down and back, squeezing your shoulder blades together.",
      "Control the bar back up to a full stretch without letting the stack slam.",
    ],
    tips: [
      "Rest 90–120 sec between sets (compound lift).",
      "Focus on pulling with your back, not your arms."
    ]
  },
  {
    id: "seated-cable-row", name: "Seated Cable Row", day: 1, dayLabel: "Upper Body A",
    equipment: "Cable", muscle: "back", icon: "cable", sets: "3 x 12",
    steps: [
      "Sit with knees slightly bent, feet braced on the platform, and grab the handle.",
      "Start with arms extended and a tall, neutral spine.",
      "Pull the handle to your torso, driving elbows back and squeezing shoulder blades together.",
      "Return slowly to the stretched position without rounding your lower back."
    ],
    tips: ["Rest 60–90 sec between sets (isolation-style row)."]
  },
  {
    id: "shoulder-press-machine", name: "Shoulder Press Machine", day: 1, dayLabel: "Upper Body A",
    equipment: "Machine", muscle: "shoulders", icon: "machine", sets: "3 x 10–12",
    steps: [
      "Set the seat height so the handles start level with your shoulders.",
      "Press the handles straight overhead until arms are extended without locking out hard.",
      "Lower under control back to the starting position at shoulder level.",
      "Keep your back flat against the pad throughout — avoid arching."
    ],
    tips: ["Rest 90–120 sec between sets (compound lift)."]
  },
  {
    id: "cable-triceps-pushdown", name: "Cable Triceps Pushdown", day: 1, dayLabel: "Upper Body A",
    equipment: "Cable", muscle: "arms", icon: "cable", sets: "3 x 12–15",
    steps: [
      "Attach a bar or rope to the high pulley and grip with elbows tucked at your sides.",
      "Keeping upper arms still, extend your elbows to push the attachment down.",
      "Squeeze your triceps at the bottom, then return slowly to the start.",
      "Don't let your elbows drift forward or flare out."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "seated-db-bicep-curl", name: "Seated Dumbbell Bicep Curl", day: 1, dayLabel: "Upper Body A",
    equipment: "Dumbbell", muscle: "arms", icon: "dumbbell", sets: "3 x 12–15",
    steps: [
      "Sit on a bench with a dumbbell in each hand, arms hanging at your sides, palms forward.",
      "Curl the weights up toward your shoulders, keeping your elbows pinned to your torso.",
      "Squeeze at the top without swinging the weight up.",
      "Lower with control back to a full arm extension."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move).", "Controlled tempo — joint control matters more than speed."]
  },

  // ===== DAY 2 — Lower Body A =====
  {
    id: "leg-press", name: "Leg Press", day: 2, dayLabel: "Lower Body A",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "4 x 12",
    steps: [
      "Sit in the machine with feet shoulder-width on the platform, mid-foot centered.",
      "Release the safety and lower the platform until knees reach roughly 90°.",
      "Press through your heels to extend your legs without locking your knees.",
      "Control the descent back down — no bouncing the weight at the bottom."
    ],
    tips: ["Rest 90–120 sec between sets (compound lift)."]
  },
  {
    id: "seated-leg-curl", name: "Seated Leg Curl", day: 2, dayLabel: "Lower Body A",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "3 x 12",
    steps: [
      "Adjust the machine so the back pad of the roller sits just above your heels.",
      "Sit with knees aligned to the machine's pivot point and legs extended.",
      "Curl your heels down and under, contracting your hamstrings fully.",
      "Return slowly to the start without letting the stack slam."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "leg-extension", name: "Leg Extension", day: 2, dayLabel: "Lower Body A",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "3 x 12–15",
    steps: [
      "Sit with the back pad set so your knees line up with the machine's pivot.",
      "Hook your ankles behind the lower roller pad.",
      "Extend your knees to lift the pad until legs are straight, without hyperextending.",
      "Lower under control back to the starting position."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "hip-adduction-abduction", name: "Hip Adduction/Abduction Machine", day: 2, dayLabel: "Lower Body A",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "2 x 15 each",
    steps: [
      "Set the machine to the adduction (inner-thigh) or abduction (outer-thigh) mode as needed.",
      "Sit with the pads against the outside (abduction) or inside (adduction) of your knees.",
      "Push the pads outward (abduction) or squeeze them inward (adduction) through a full range.",
      "Return slowly to the start under control."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "standing-calf-raise-machine", name: "Standing Calf Raise Machine", day: 2, dayLabel: "Lower Body A",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "3 x 15",
    steps: [
      "Position your shoulders under the pads with the balls of your feet on the platform.",
      "Let your heels drop below the platform for a full stretch.",
      "Rise onto your toes as high as possible, squeezing your calves at the top.",
      "Lower slowly back to the stretched position."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "cable-crunch-ab-machine", name: "Cable Crunch or Ab Machine", day: 2, dayLabel: "Lower Body A",
    equipment: "Cable", muscle: "core", icon: "cable", sets: "3 x 15",
    steps: [
      "Kneel below a high cable with a rope attachment held at either side of your head (or sit in an ab machine and grip the handles).",
      "Brace your core and curl your torso down, bringing your elbows toward your knees.",
      "Focus on flexing the spine through your abs, not pulling with your arms.",
      "Return slowly to the start under control."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },

  // ===== DAY 4 — Upper Body B =====
  {
    id: "smith-machine-incline-press", name: "Smith Machine Incline Press", day: 4, dayLabel: "Upper Body B",
    equipment: "Machine", muscle: "chest", icon: "machine", sets: "4 x 10",
    steps: [
      "Set an incline bench (around 30–45°) under the Smith machine bar.",
      "Unrack the bar with hands slightly wider than shoulder width.",
      "Lower the bar under control to the upper chest.",
      "Press back up to full extension without locking the elbows hard."
    ],
    tips: ["Rest 90–120 sec between sets (compound lift)."]
  },
  {
    id: "assisted-pull-up-machine", name: "Assisted Pull-Up Machine (or Lat Pulldown, close grip)", day: 4, dayLabel: "Upper Body B",
    equipment: "Machine", muscle: "back", icon: "machine", sets: "4 x 10",
    steps: [
      "Kneel on the platform and set an assistance level that lets you complete the target reps with control.",
      "Grip the handles with a close, neutral or shoulder-width grip.",
      "Pull your chest up toward the handles, driving elbows down and back.",
      "Lower with control to a full arm extension.",
      "Alternative: use the Lat Pulldown with a close grip if the assisted machine is unavailable."
    ],
    tips: ["Rest 90–120 sec between sets (compound lift)."]
  },
  {
    id: "chest-fly-pec-deck", name: "Chest Fly (Pec Deck)", day: 4, dayLabel: "Upper Body B",
    equipment: "Machine", muscle: "chest", icon: "machine", sets: "3 x 12–15",
    steps: [
      "Set the seat so the handles align with mid-chest height.",
      "Place forearms/hands on the pads with a slight bend in the elbows.",
      "Bring the pads together in front of your chest, squeezing your pecs.",
      "Return slowly to a comfortable stretch without letting the weight slam."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "dumbbell-lateral-raise", name: "Dumbbell Lateral Raise", day: 4, dayLabel: "Upper Body B",
    equipment: "Dumbbell", muscle: "shoulders", icon: "dumbbell", sets: "3 x 12–15",
    steps: [
      "Stand holding a light-to-moderate dumbbell in each hand at your sides.",
      "With a slight bend in the elbows, raise both arms out to the sides to about shoulder height.",
      "Lead with your elbows, not your hands, and avoid shrugging your traps.",
      "Lower with control back to your sides."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "cable-rope-face-pull", name: "Cable Rope Face Pull", day: 4, dayLabel: "Upper Body B",
    equipment: "Cable", muscle: "shoulders", icon: "cable", sets: "3 x 15",
    steps: [
      "Set a rope attachment at upper chest to head height on the cable machine.",
      "Grip the rope with both hands, palms facing in, and step back for tension.",
      "Pull the rope toward your face, flaring elbows out and squeezing shoulder blades together.",
      "Return slowly to the start under control."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "db-overhead-triceps-extension", name: "Dumbbell Overhead Triceps Extension", day: 4, dayLabel: "Upper Body B",
    equipment: "Dumbbell", muscle: "arms", icon: "dumbbell", sets: "3 x 12",
    steps: [
      "Sit or stand holding one dumbbell with both hands overhead, arms extended.",
      "Keeping your upper arms still and close to your head, bend the elbows to lower the weight behind your head.",
      "Extend your elbows to press the weight back to the starting position.",
      "Keep your core braced to avoid arching your lower back."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },

  // ===== DAY 5 — Lower Body B =====
  {
    id: "hack-squat-machine", name: "Hack Squat Machine", day: 5, dayLabel: "Lower Body B",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "4 x 10–12",
    steps: [
      "Position yourself under the shoulder pads with feet shoulder-width on the platform.",
      "Release the safety catches and lower under control until knees reach roughly 90°.",
      "Press through your heels and mid-foot to extend your legs back up.",
      "Avoid locking the knees hard at the top."
    ],
    tips: ["Rest 90–120 sec between sets (compound lift)."]
  },
  {
    id: "romanian-deadlift", name: "Romanian Deadlift (Dumbbell or Barbell)", day: 5, dayLabel: "Lower Body B",
    equipment: "Free Weight", muscle: "legs", icon: "dumbbell", sets: "3 x 10",
    steps: [
      "Hold a barbell or a dumbbell in each hand in front of your thighs, feet hip-width apart.",
      "With a soft bend in the knees, hinge at the hips and push your hips back, lowering the weight along your legs.",
      "Keep your back flat and the weight close to your body until you feel a stretch in your hamstrings.",
      "Drive your hips forward to return to standing, squeezing your glutes at the top."
    ],
    tips: ["Use light-moderate weight while building technique.", "Rest 90–120 sec between sets (compound lift)."]
  },
  {
    id: "walking-lunges", name: "Walking Lunges", day: 5, dayLabel: "Lower Body B",
    equipment: "Bodyweight", muscle: "legs", icon: "bodyweight", sets: "3 x 10 each leg",
    steps: [
      "Stand tall, optionally holding a light dumbbell in each hand.",
      "Step forward into a lunge, lowering your back knee toward the floor.",
      "Push through your front heel to stand up and step the back foot forward into the next lunge.",
      "Keep your torso upright and core braced throughout."
    ],
    tips: ["Bodyweight or light dumbbells to start.", "Rest 90–120 sec between sets (compound-style movement)."]
  },
  {
    id: "glute-kickback", name: "Glute Kickback Machine or Cable", day: 5, dayLabel: "Lower Body B",
    equipment: "Cable", muscle: "glutes", icon: "cable", sets: "3 x 12 each",
    steps: [
      "Attach an ankle cuff to a low cable, or use a glute kickback machine, and secure it around your ankle.",
      "Hinge slightly forward and hold onto the machine frame for balance.",
      "Kick your leg straight back and up, squeezing your glute at the top.",
      "Return with control to the starting position without letting the weight yank your leg forward."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "seated-calf-raise", name: "Seated Calf Raise", day: 5, dayLabel: "Lower Body B",
    equipment: "Machine", muscle: "legs", icon: "machine", sets: "3 x 15",
    steps: [
      "Sit with the balls of your feet on the platform and the pads resting on your lower thighs.",
      "Let your heels drop for a full stretch at the bottom.",
      "Press through the balls of your feet to raise your heels as high as possible.",
      "Squeeze at the top, then lower slowly under control."
    ],
    tips: ["Rest 60–90 sec between sets (isolation move)."]
  },
  {
    id: "plank", name: "Plank", day: 5, dayLabel: "Lower Body B",
    equipment: "Bodyweight", muscle: "core", icon: "bodyweight", sets: "3 x 30–45 sec",
    steps: [
      "Set up on your forearms and toes, elbows under your shoulders.",
      "Form a straight line from head to heels — no sagging hips, no piking up.",
      "Brace your core and glutes, and breathe steadily throughout the hold.",
      "Hold for the target time, then rest and repeat."
    ],
    tips: ["Rest 60–90 sec between sets."]
  },

  // ===== Cardio finishers (used across multiple days) =====
  {
    id: "incline-treadmill-walk", name: "Incline Treadmill Walk", day: null, dayLabel: "Cardio Finisher",
    equipment: "Cardio Machine", muscle: "cardio", icon: "treadmill", sets: "15 min, moderate pace",
    steps: [
      "Set a moderate incline (roughly 6–12%) and a brisk but sustainable walking pace.",
      "Keep an upright posture — avoid gripping the handrails to take weight off your legs.",
      "Maintain a steady pace you can hold for the full duration.",
      "Cool down with 1–2 minutes at a flat, easy pace at the end."
    ],
    tips: ["Low-impact option that's easier on the knees/joints than running.", "Used as a warm-up mode too: 5–8 min light pace before every session."]
  },
  {
    id: "stationary-bike", name: "Stationary Bike", day: null, dayLabel: "Cardio Finisher",
    equipment: "Cardio Machine", muscle: "cardio", icon: "bike", sets: "15–20 min, steady pace",
    steps: [
      "Adjust the seat height so your knee has a slight bend at the bottom of the pedal stroke.",
      "Start pedaling at a steady, moderate resistance you can sustain for the full session.",
      "Keep your core braced and shoulders relaxed rather than hunched over the handlebars.",
      "Ease off resistance for a short cooldown in the last 1–2 minutes."
    ],
    tips: ["Low-impact — a good early option while building a fitness base."]
  },
  {
    id: "elliptical", name: "Elliptical", day: null, dayLabel: "Cardio Finisher",
    equipment: "Cardio Machine", muscle: "cardio", icon: "elliptical", sets: "15–20 min, steady pace",
    steps: [
      "Step onto the pedals and grip the moving handles for full-body engagement, or hold the stationary rails.",
      "Drive through your legs in a smooth, controlled elliptical motion.",
      "Keep your posture tall rather than leaning heavily on the handles.",
      "Hold a steady, sustainable pace for the full duration."
    ],
    tips: ["Low-impact alternative to running — easy on the joints."]
  },
  {
    id: "rowing-machine", name: "Rowing Machine", day: null, dayLabel: "Cardio Finisher",
    equipment: "Cardio Machine", muscle: "cardio", icon: "rower", sets: "20 min",
    steps: [
      "Strap your feet in, grab the handle, and start with legs bent, arms extended.",
      "Drive the sequence: legs first, then lean back slightly, then pull the handle to your torso.",
      "Reverse the sequence smoothly to return: arms out, lean forward, then bend the knees.",
      "Keep a steady, controlled rhythm rather than rushing the stroke."
    ],
    tips: ["Full-body, low-impact cardio option."]
  },
  {
    id: "stairmaster", name: "Stairmaster", day: null, dayLabel: "Cardio Finisher",
    equipment: "Cardio Machine", muscle: "cardio", icon: "stairmaster", sets: "15 min",
    steps: [
      "Step onto the pedals and set a sustainable stepping pace.",
      "Stand tall and let your legs do the work rather than leaning on the handrails.",
      "Keep your steps controlled rather than rushed or bouncy.",
      "Maintain a steady pace for the full duration, cooling down briefly at the end."
    ],
    tips: ["Higher-effort cardio option — build up gradually."]
  },
];

/* ---------- Program structure (guidelines, days, notes) — verbatim from the plan ---------- */
const PROGRAM = {
  title: "4-Day Fat Loss Program",
  subtitle: "Fitness Time (Standard Commercial Gym)",
  profile: { sex: "Male", age: 30, heightCm: 178, weightKg: 114, goal: "Fat loss", level: "Some experience" },
  split: "Upper/Lower x2",
  frequency: "4 days/week + optional cardio on off days",
  guidelines: [
    { title: "Warm-up (5–8 min)", text: "Light bike or incline treadmill walk + dynamic stretches (arm circles, leg swings, bodyweight squats) before every session." },
    { title: "Rest between sets", text: "60–90 sec on isolation moves, 90–120 sec on compound lifts." },
    { title: "Tempo", text: "Controlled, no jerking or bouncing — at your current bodyweight, joint control matters more than speed." },
    { title: "Progression", text: "Add weight or 1–2 reps once you hit the top of the rep range with good form on all sets." },
    { title: "Cardio", text: "Favor incline treadmill walking, stationary bike, elliptical, or rowing machine over running early on — lower impact on knees/joints while still burning calories." },
    { title: "Impact", text: "Avoid jump-heavy or high-impact moves for the first 6–8 weeks; build a base first." },
    { title: "New to a machine?", text: "Ask a Fitness Time floor trainer to show you correct setup on your first pass — cheap insurance against injury." },
  ],
  days: [
    { day: 1, label: "Upper Body A", type: "training", cardio: "15 min incline walk (moderate pace)" },
    { day: 2, label: "Lower Body A", type: "training", cardio: "15–20 min bike or elliptical (steady pace)" },
    { day: 3, label: "Rest or light cardio", type: "rest", text: "20–30 min walk/bike" },
    { day: 4, label: "Upper Body B", type: "training", cardio: "15 min stairmaster or incline walk" },
    { day: 5, label: "Lower Body B", type: "training", cardio: "20 min bike or rowing machine" },
    { day: 6, label: "Rest, or optional easy cardio", type: "rest", text: "20–30 min easy cardio (walk, bike, swim if available)" },
    { day: 7, label: "Rest, or optional easy cardio", type: "rest", text: "20–30 min easy cardio (walk, bike, swim if available)" },
  ],
  notes: [
    "This is a starting template — reassess after 4–6 weeks and adjust weights/reps as you get stronger.",
    "If any exercise causes joint pain (not muscle fatigue), swap it for the machine-based alternative listed nearby, or ask a trainer for a substitution.",
    "Consistency across all 4 sessions plus the cardio finishers will drive fat loss more than any single \"perfect\" exercise choice.",
  ],
};

function exerciseById(id){ return EXERCISES.find(e => e.id === id); }
function exercisesForDay(day){ return EXERCISES.filter(e => e.day === day); }
