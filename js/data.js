// ==========================================
//  DATA.JS — All data structures & constants
// ==========================================

const RANKS = [
    { min: 1, max: 10, name: 'E', title: 'E-Rank', css: 'rank-e' },
    { min: 11, max: 30, name: 'D', title: 'D-Rank', css: 'rank-d' },
    { min: 31, max: 60, name: 'C', title: 'C-Rank', css: 'rank-c' },
    { min: 61, max: 100, name: 'B', title: 'B-Rank', css: 'rank-b' },
    { min: 101, max: 200, name: 'A', title: 'A-Rank', css: 'rank-a' },
    { min: 201, max: 350, name: 'S', title: 'S-Rank', css: 'rank-s' },
    { min: 351, max: 9999, name: 'X', title: 'National Level', css: 'rank-x' }
];

const TITLES = {
    1: 'The Weakest Hunter',
    5: 'Persistent Novice',
    10: 'Awakened Prospect',
    15: 'Iron Initiate',
    20: 'Gate Breaker',
    30: 'Steel Warrior',
    40: 'Crimson Fighter',
    50: 'Shadow Aspirant',
    60: 'Demon Slayer',
    75: 'Sovereign Candidate',
    100: 'Monarch Apparent',
    150: 'Shadow Sovereign',
    200: 'Absolute Being',
    250: 'The Shadow Monarch',
    351: 'National Level Hunter',
    400: 'The Threat',
    450: 'Calamity',
    500: 'The Monster',
    600: 'Extinction-Class Entity',
    750: 'The Absolute Nightmare',
    999: 'He Who Must Not Be Challenged'
};

// ═══════════════════════════════════════════
//  FOOD DATABASE — Auto-fill macros per 100g or standard serving
//  { name, serving, servingLabel, protein, carbs, fats }
// ═══════════════════════════════════════════
const FOOD_DB = [
    // ---- Protein Sources ----
    { name:'Chicken Breast',       serving:150, servingLabel:'150g',   protein:46, carbs:0, fats:5 },
    { name:'Chicken Thigh',        serving:150, servingLabel:'150g',   protein:38, carbs:0, fats:14 },
    { name:'Grilled Chicken',      serving:150, servingLabel:'150g',   protein:43, carbs:0, fats:7 },
    { name:'Turkey Breast',        serving:150, servingLabel:'150g',   protein:45, carbs:0, fats:3 },
    { name:'Salmon',               serving:150, servingLabel:'150g',   protein:34, carbs:0, fats:18 },
    { name:'Tuna',                 serving:150, servingLabel:'150g',   protein:40, carbs:0, fats:2 },
    { name:'Shrimp',               serving:150, servingLabel:'150g',   protein:36, carbs:0, fats:3 },
    { name:'Tilapia',              serving:150, servingLabel:'150g',   protein:35, carbs:0, fats:4 },
    { name:'Beef Steak',           serving:200, servingLabel:'200g',   protein:50, carbs:0, fats:20 },
    { name:'Ground Beef (lean)',   serving:150, servingLabel:'150g',   protein:38, carbs:0, fats:15 },
    { name:'Lamb',                 serving:150, servingLabel:'150g',   protein:37, carbs:0, fats:18 },
    { name:'Pork Chop',            serving:150, servingLabel:'150g',   protein:39, carbs:0, fats:12 },
    { name:'Egg (whole)',          serving:50,  servingLabel:'1 egg',  protein:6, carbs:1, fats:5 },
    { name:'Egg Whites',           serving:100, servingLabel:'3 whites',protein:11, carbs:1, fats:0 },
    { name:'Paneer',               serving:100, servingLabel:'100g',   protein:18, carbs:3, fats:21 },
    { name:'Tofu',                 serving:150, servingLabel:'150g',   protein:12, carbs:3, fats:6 },
    { name:'Whey Protein Shake',   serving:30,  servingLabel:'1 scoop',protein:24, carbs:3, fats:1 },
    { name:'Greek Yogurt',         serving:170, servingLabel:'1 cup',  protein:17, carbs:6, fats:5 },
    { name:'Cottage Cheese',       serving:150, servingLabel:'150g',   protein:18, carbs:5, fats:6 },

    // ---- Carb Sources ----
    { name:'White Rice',           serving:200, servingLabel:'1 cup cooked', protein:4, carbs:52, fats:0 },
    { name:'Brown Rice',           serving:200, servingLabel:'1 cup cooked', protein:5, carbs:46, fats:2 },
    { name:'Basmati Rice',         serving:200, servingLabel:'1 cup cooked', protein:4, carbs:50, fats:0 },
    { name:'Oats / Oatmeal',      serving:40,  servingLabel:'½ cup dry',protein:5, carbs:27, fats:3 },
    { name:'Bread (white)',        serving:50,  servingLabel:'2 slices',protein:5, carbs:26, fats:2 },
    { name:'Bread (whole wheat)',  serving:50,  servingLabel:'2 slices',protein:6, carbs:22, fats:2 },
    { name:'Pasta',                serving:200, servingLabel:'1 cup cooked', protein:7, carbs:43, fats:1 },
    { name:'Sweet Potato',         serving:150, servingLabel:'1 medium',protein:3, carbs:30, fats:0 },
    { name:'Potato',               serving:150, servingLabel:'1 medium',protein:3, carbs:26, fats:0 },
    { name:'Quinoa',               serving:185, servingLabel:'1 cup cooked', protein:8, carbs:39, fats:4 },
    { name:'Roti / Chapati',       serving:40,  servingLabel:'1 roti', protein:3, carbs:18, fats:2 },
    { name:'Naan',                 serving:90,  servingLabel:'1 naan', protein:8, carbs:45, fats:3 },
    { name:'Idli',                 serving:40,  servingLabel:'1 idli', protein:2, carbs:8, fats:0 },
    { name:'Dosa',                 serving:80,  servingLabel:'1 dosa', protein:3, carbs:22, fats:3 },
    { name:'Upma',                 serving:200, servingLabel:'1 bowl', protein:5, carbs:30, fats:6 },
    { name:'Poha',                 serving:200, servingLabel:'1 bowl', protein:4, carbs:35, fats:5 },
    { name:'Cornflakes',           serving:30,  servingLabel:'1 cup',  protein:2, carbs:24, fats:0 },
    { name:'Muesli / Granola',     serving:50,  servingLabel:'½ cup',  protein:5, carbs:33, fats:6 },

    // ---- Fruits ----
    { name:'Banana',               serving:120, servingLabel:'1 medium',protein:1, carbs:27, fats:0 },
    { name:'Apple',                serving:180, servingLabel:'1 medium',protein:0, carbs:25, fats:0 },
    { name:'Orange',               serving:150, servingLabel:'1 medium',protein:1, carbs:15, fats:0 },
    { name:'Mango',                serving:150, servingLabel:'1 cup',  protein:1, carbs:25, fats:0 },
    { name:'Watermelon',           serving:200, servingLabel:'1 cup',  protein:1, carbs:15, fats:0 },
    { name:'Grapes',               serving:150, servingLabel:'1 cup',  protein:1, carbs:27, fats:0 },
    { name:'Berries (mixed)',      serving:150, servingLabel:'1 cup',  protein:1, carbs:17, fats:0 },
    { name:'Dates',                serving:40,  servingLabel:'3 dates',protein:1, carbs:27, fats:0 },

    // ---- Fats & Nuts ----
    { name:'Almonds',              serving:30,  servingLabel:'~23 nuts',protein:6, carbs:6, fats:14 },
    { name:'Peanuts',              serving:30,  servingLabel:'handful', protein:7, carbs:5, fats:14 },
    { name:'Cashews',              serving:30,  servingLabel:'~18 nuts',protein:5, carbs:9, fats:12 },
    { name:'Walnuts',              serving:30,  servingLabel:'~7 halves',protein:4, carbs:4, fats:18 },
    { name:'Peanut Butter',        serving:32,  servingLabel:'2 tbsp', protein:7, carbs:6, fats:16 },
    { name:'Avocado',              serving:100, servingLabel:'½ avocado',protein:2, carbs:9, fats:15 },
    { name:'Olive Oil',            serving:14,  servingLabel:'1 tbsp', protein:0, carbs:0, fats:14 },
    { name:'Butter / Ghee',        serving:14,  servingLabel:'1 tbsp', protein:0, carbs:0, fats:12 },
    { name:'Cheese',               serving:30,  servingLabel:'1 slice',protein:7, carbs:0, fats:9 },

    // ---- Dairy / Drinks ----
    { name:'Whole Milk',           serving:250, servingLabel:'1 glass',protein:8, carbs:12, fats:8 },
    { name:'Skim Milk',            serving:250, servingLabel:'1 glass',protein:8, carbs:12, fats:0 },
    { name:'Buttermilk / Chaas',   serving:250, servingLabel:'1 glass',protein:4, carbs:6, fats:2 },
    { name:'Lassi',                serving:250, servingLabel:'1 glass',protein:6, carbs:20, fats:4 },
    { name:'Protein Bar',          serving:60,  servingLabel:'1 bar',  protein:20, carbs:22, fats:8 },

    // ---- Meals / Mixed ----
    { name:'Dal (lentil soup)',    serving:200, servingLabel:'1 bowl', protein:12, carbs:24, fats:4 },
    { name:'Rajma (kidney beans)', serving:200, servingLabel:'1 bowl', protein:10, carbs:28, fats:3 },
    { name:'Chole (chickpeas)',    serving:200, servingLabel:'1 bowl', protein:11, carbs:30, fats:5 },
    { name:'Chicken Curry',        serving:200, servingLabel:'1 bowl', protein:28, carbs:8, fats:14 },
    { name:'Egg Curry',            serving:200, servingLabel:'1 bowl', protein:14, carbs:8, fats:12 },
    { name:'Fish Curry',           serving:200, servingLabel:'1 bowl', protein:25, carbs:6, fats:10 },
    { name:'Biryani (chicken)',    serving:300, servingLabel:'1 plate',protein:25, carbs:55, fats:14 },
    { name:'Fried Rice',           serving:250, servingLabel:'1 plate',protein:10, carbs:50, fats:10 },
    { name:'Pizza (2 slices)',     serving:200, servingLabel:'2 slices',protein:16, carbs:50, fats:18 },
    { name:'Burger',               serving:200, servingLabel:'1 burger',protein:20, carbs:35, fats:18 },
    { name:'Sandwich',             serving:180, servingLabel:'1 sandwich',protein:14, carbs:30, fats:10 },
    { name:'Salad (mixed)',        serving:200, servingLabel:'1 bowl', protein:4, carbs:10, fats:5 },
    { name:'Wrap / Roll',          serving:200, servingLabel:'1 wrap', protein:15, carbs:32, fats:10 },
    { name:'Noodles / Maggi',      serving:200, servingLabel:'1 pack', protein:8, carbs:42, fats:12 },
    { name:'Paratha (stuffed)',    serving:80,  servingLabel:'1 paratha',protein:5, carbs:25, fats:8 },
    { name:'Samosa',               serving:60,  servingLabel:'1 samosa',protein:3, carbs:18, fats:8 },
    { name:'Pav Bhaji',            serving:300, servingLabel:'1 plate',protein:10, carbs:50, fats:15 },
    { name:'Thali (veg)',          serving:500, servingLabel:'1 thali',protein:18, carbs:70, fats:16 },
    { name:'Thali (non-veg)',      serving:500, servingLabel:'1 thali',protein:30, carbs:65, fats:20 },
];

// ═══════════════════════════════════════════
//  EXERCISE DATABASE — Full gym catalog with muscle groups & calorie rates
//  { name, group, isCardio, cal: { low, medium, high } }
//  Calorie rates = cal/min estimates by intensity
// ═══════════════════════════════════════════
const EXERCISE_DB = [
    // ── CHEST ──
    { name:'Bench Press',           group:'Chest',     isCardio:false, cal:{ low:4, medium:7, high:10 } },
    { name:'Incline Bench Press',   group:'Chest',     isCardio:false, cal:{ low:4, medium:7, high:10 } },
    { name:'Decline Bench Press',   group:'Chest',     isCardio:false, cal:{ low:4, medium:7, high:9 } },
    { name:'Dumbbell Bench Press',  group:'Chest',     isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Dumbbell Fly',          group:'Chest',     isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Cable Crossover',       group:'Chest',     isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Chest Dips',            group:'Chest',     isCardio:false, cal:{ low:5, medium:7, high:10 } },
    { name:'Push-ups',              group:'Chest',     isCardio:false, cal:{ low:4, medium:6, high:8 } },

    // ── BACK ──
    { name:'Pull-ups',              group:'Back',      isCardio:false, cal:{ low:5, medium:8, high:11 } },
    { name:'Chin-ups',              group:'Back',      isCardio:false, cal:{ low:5, medium:8, high:11 } },
    { name:'Barbell Row',           group:'Back',      isCardio:false, cal:{ low:4, medium:7, high:10 } },
    { name:'Dumbbell Row',          group:'Back',      isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Lat Pulldown',          group:'Back',      isCardio:false, cal:{ low:3, medium:6, high:8 } },
    { name:'Seated Cable Row',      group:'Back',      isCardio:false, cal:{ low:3, medium:6, high:8 } },
    { name:'T-Bar Row',             group:'Back',      isCardio:false, cal:{ low:4, medium:7, high:10 } },
    { name:'Face Pull',             group:'Back',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Back Extension',        group:'Back',      isCardio:false, cal:{ low:3, medium:5, high:7 } },

    // ── SHOULDERS ──
    { name:'OHP',                   group:'Shoulders', isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Arnold Press',          group:'Shoulders', isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Military Press',        group:'Shoulders', isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Lateral Raise',         group:'Shoulders', isCardio:false, cal:{ low:3, medium:4, high:6 } },
    { name:'Front Raise',           group:'Shoulders', isCardio:false, cal:{ low:3, medium:4, high:6 } },
    { name:'Rear Delt Fly',         group:'Shoulders', isCardio:false, cal:{ low:3, medium:4, high:6 } },
    { name:'Upright Row',           group:'Shoulders', isCardio:false, cal:{ low:3, medium:5, high:8 } },
    { name:'Shrugs',                group:'Shoulders', isCardio:false, cal:{ low:3, medium:5, high:7 } },

    // ── ARMS ──
    { name:'Barbell Curl',          group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Dumbbell Curl',         group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Hammer Curl',           group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Preacher Curl',         group:'Arms',      isCardio:false, cal:{ low:3, medium:4, high:6 } },
    { name:'Concentration Curl',    group:'Arms',      isCardio:false, cal:{ low:2, medium:4, high:6 } },
    { name:'Cable Curl',            group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:6 } },
    { name:'Tricep Pushdown',       group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Skull Crushers',        group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Tricep Dips',           group:'Arms',      isCardio:false, cal:{ low:5, medium:7, high:10 } },
    { name:'Overhead Tricep Ext',   group:'Arms',      isCardio:false, cal:{ low:3, medium:5, high:7 } },

    // ── LEGS ──
    { name:'Squats',                group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Front Squats',          group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Goblet Squat',          group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:8 } },
    { name:'Hack Squat',            group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Leg Press',             group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:8 } },
    { name:'Lunges',                group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:8 } },
    { name:'Bulgarian Split Squat', group:'Legs',      isCardio:false, cal:{ low:4, medium:7, high:9 } },
    { name:'Leg Curl',              group:'Legs',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Leg Extension',         group:'Legs',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Calf Raise',            group:'Legs',      isCardio:false, cal:{ low:2, medium:4, high:6 } },
    { name:'Hip Thrust',            group:'Legs',      isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Romanian Deadlift',     group:'Legs',      isCardio:false, cal:{ low:5, medium:7, high:10 } },
    { name:'Deadlift',              group:'Legs',      isCardio:false, cal:{ low:5, medium:8, high:11 } },

    // ── CORE ──
    { name:'Plank',                 group:'Core',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Crunches',              group:'Core',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Sit-ups',               group:'Core',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Hanging Leg Raise',     group:'Core',      isCardio:false, cal:{ low:4, medium:6, high:8 } },
    { name:'Cable Crunch',          group:'Core',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Ab Wheel Rollout',      group:'Core',      isCardio:false, cal:{ low:4, medium:6, high:9 } },
    { name:'Russian Twist',         group:'Core',      isCardio:false, cal:{ low:3, medium:5, high:7 } },
    { name:'Mountain Climbers',     group:'Core',      isCardio:true,  cal:{ low:6, medium:8, high:11 } },
    { name:'Dead Bug',              group:'Core',      isCardio:false, cal:{ low:3, medium:4, high:6 } },
    { name:'Dragon Flag',           group:'Core',      isCardio:false, cal:{ low:5, medium:7, high:10 } },

    // ── CARDIO ──
    { name:'Running',               group:'Cardio',    isCardio:true,  cal:{ low:6, medium:8, high:10 } },
    { name:'Cycling',               group:'Cardio',    isCardio:true,  cal:{ low:5, medium:7, high:9 } },
    { name:'Swimming',              group:'Cardio',    isCardio:true,  cal:{ low:6, medium:8, high:11 } },
    { name:'Jump Rope',             group:'Cardio',    isCardio:true,  cal:{ low:8, medium:10, high:13 } },
    { name:'Rowing Machine',        group:'Cardio',    isCardio:true,  cal:{ low:5, medium:7, high:10 } },
    { name:'Stair Climber',         group:'Cardio',    isCardio:true,  cal:{ low:5, medium:8, high:11 } },
    { name:'Walking',               group:'Cardio',    isCardio:true,  cal:{ low:3, medium:4, high:5 } },
    { name:'Elliptical',            group:'Cardio',    isCardio:true,  cal:{ low:5, medium:7, high:9 } },
    { name:'Sprints',               group:'Cardio',    isCardio:true,  cal:{ low:8, medium:11, high:14 } },

    // ── FULL BODY ──
    { name:'HIIT',                  group:'Full Body', isCardio:true,  cal:{ low:8, medium:10, high:12 } },
    { name:'Boxing',                group:'Full Body', isCardio:true,  cal:{ low:6, medium:9, high:12 } },
    { name:'Burpees',               group:'Full Body', isCardio:true,  cal:{ low:7, medium:9, high:12 } },
    { name:'Kettlebell Swing',      group:'Full Body', isCardio:false, cal:{ low:6, medium:9, high:12 } },
    { name:'Clean and Press',       group:'Full Body', isCardio:false, cal:{ low:5, medium:8, high:11 } },
    { name:'Battle Ropes',          group:'Full Body', isCardio:true,  cal:{ low:8, medium:10, high:13 } },
    { name:'Yoga',                  group:'Full Body', isCardio:false, cal:{ low:2, medium:3, high:4 } },
    { name:"Farmer's Walk",        group:'Full Body', isCardio:false, cal:{ low:5, medium:7, high:9 } },
    { name:'CrossFit WOD',          group:'Full Body', isCardio:true,  cal:{ low:8, medium:10, high:13 } },

    // ── OTHER ──
    { name:'Other',                 group:'Other',     isCardio:false, cal:{ low:4, medium:6, high:8 } },
];

// Build CALORIE_RATES from EXERCISE_DB for backward compat
const CALORIE_RATES = {};
EXERCISE_DB.forEach(ex => { CALORIE_RATES[ex.name] = ex.cal; });

// Muscle group list (derived)
const EXERCISE_GROUPS = [...new Set(EXERCISE_DB.map(e => e.group).filter(g => g !== 'Other'))];


const SKILLS_DEFS = [
    { id: 'iron_will',     name: 'Iron Will',                 type: 'Passive', icon: '🛡', desc: 'WIL growth +10%. Forged through relentless discipline.', unlock: 3 },
    { id: 'rapid_rec',     name: 'Rapid Recovery',            type: 'Passive', icon: '💚', desc: 'VIT gains +10%. Muscles repair faster between sessions.', unlock: 5 },
    { id: 'shadow_step',   name: 'Shadow Step',               type: 'Active',  icon: '⚡', desc: 'Short burst sprint. AGI +5% in cardio sessions.', unlock: 8 },
    { id: 'unyield_sinew', name: 'Rune of Unyielding Sinew',  type: 'Rune',    icon: '🔷', desc: 'STR gains +10%. Ancient power flows through your tendons.', unlock: 12 },
    { id: 'monarchs_gaze', name: "Monarch's Gaze",            type: 'Active',  icon: '👁', desc: 'Increased focus under fatigue. WIL checks boosted.', unlock: 18 },
    { id: 'shadow_vit',    name: 'Ancient Shadow Vitality',    type: 'Passive', icon: '🖤', desc: 'END growth +15%. The shadows sustain you.', unlock: 25 },
    { id: 'first_monarch', name: 'Breath of the First Monarch',type: 'Rune',   icon: '👑', desc: 'All stats growth +5%. You glimpse the Monarch within.', unlock: 40 },
    { id: 'arise',         name: 'Arise',                     type: 'Ultimate',icon: '🌑', desc: 'PHS growth +20%. The shadow army awakens within you.', unlock: 60 },
    { id: 'domain',        name: 'Domain of Shadows',         type: 'Domain',  icon: '⬛', desc: 'All growth +10%. Reality bends to your will.', unlock: 100 },
    { id: 'national_aura', name: 'Threat Aura',               type: 'Domain',  icon: '☠️', desc: 'All growth +15%. You are no longer a hunter — you are the danger.', unlock: 200 },
    { id: 'extinction',    name: 'Extinction Protocol',       type: 'Ultimate',icon: '💀', desc: 'All stats growth +25%. Nations tremble at your name.', unlock: 351 }
];

const ACHIEVEMENTS_DEFS = [
    { id: 'first_blood',  name: 'First Blood',       icon: '🎯', desc: 'Complete your first workout',    cond: d => d.stats.totalWorkouts >= 1 },
    { id: 'gate_clear',   name: 'Gate Cleared',       icon: '⬡',  desc: 'Complete all daily quests once',  cond: d => d.stats.totalQuestsCompleted >= 5 },
    { id: 'w10',          name: 'Tenacious',          icon: '💪', desc: 'Complete 10 workouts',            cond: d => d.stats.totalWorkouts >= 10 },
    { id: 'w50',          name: 'Warrior',            icon: '⚔',  desc: 'Complete 50 workouts',            cond: d => d.stats.totalWorkouts >= 50 },
    { id: 'cal1k',        name: 'Calorie Crusher',    icon: '🔥', desc: 'Burn 1,000 calories total',       cond: d => d.stats.totalCalBurned >= 1000 },
    { id: 'cal10k',       name: 'Inferno',            icon: '🌋', desc: 'Burn 10,000 calories total',      cond: d => d.stats.totalCalBurned >= 10000 },
    { id: 'streak7',      name: 'Week of Steel',      icon: '🔗', desc: 'Maintain 7-day streak',           cond: d => d.streak >= 7 },
    { id: 'streak30',     name: 'Unbreakable',        icon: '🏔',  desc: 'Maintain 30-day streak',          cond: d => d.streak >= 30 },
    { id: 'meals20',      name: 'Disciplined Eater',  icon: '🍖', desc: 'Log 20 meals',                    cond: d => d.stats.totalMeals >= 20 },
    { id: 'lv10',         name: 'D-Rank Ascension',   icon: '⭐', desc: 'Reach level 10',                  cond: d => d.level >= 10 },
    { id: 'lv30',         name: 'C-Rank Ascension',   icon: '🌟', desc: 'Reach level 30',                  cond: d => d.level >= 30 },
    { id: 'lv60',         name: 'B-Rank Ascension',   icon: '✨', desc: 'Reach level 60',                  cond: d => d.level >= 60 },
    { id: 'lv100',        name: 'A-Rank Ascension',   icon: '💎', desc: 'Reach level 100',                 cond: d => d.level >= 100 },
    { id: 'lv200',        name: 'S-Rank Ascension',   icon: '🏆', desc: 'Reach level 200',                 cond: d => d.level >= 200 },
    { id: 'lv351',        name: 'National Level',     icon: '☠️', desc: 'Reach level 351 — You are no longer a hunter', cond: d => d.level >= 351 },
    { id: 'w100',         name: 'Centurion',          icon: '🗡️', desc: 'Complete 100 workouts',            cond: d => d.stats.totalWorkouts >= 100 },
    { id: 'cal50k',       name: 'Extinction Event',   icon: '💀', desc: 'Burn 50,000 calories total',       cond: d => d.stats.totalCalBurned >= 50000 },
    { id: 'streak90',     name: 'The Monster',        icon: '👹', desc: 'Maintain 90-day streak',           cond: d => d.streak >= 90 }
];

const WISDOM = [
    // ===== Original System Quotes =====
    "The body breaks before the will — forge the latter in fire.",
    "Only shadows remain when light fades; become the shadow.",
    "A hunter who rests too long becomes the hunted.",
    "Pain is the currency of growth. Pay willingly.",
    "The dungeon does not care about your excuses.",
    "Between the man you are and the man you could be — there lies only action.",
    "Every rep is a spell. Every set, an incantation. The body transforms through ritual.",
    "Weakness is a choice. Strength is earned, one day at a time.",
    "The gates do not open for the hesitant.",
    "You were not born strong. You were born with the potential to become unbreakable.",
    "Discipline is the shadow that never leaves, even in the darkest dungeon.",
    "The Monarchs did not ascend by comfort — they ascended through fire.",
    "Sleep is the potion. Food is the mana. Training is the battle. Recover, refuel, return.",
    "Your reflection is your final boss. Defeat it daily.",
    "The System rewards those who show up — even broken, even bleeding.",
    "A single push-up done today echoes louder than a thousand planned for tomorrow.",
    "Arise — not because it is easy, but because you refuse to stay fallen.",
    "Every missed day feeds the weakness within. Every completed gate starves it.",
    "The strongest hunters were once the weakest. They simply refused to stop.",
    "Iron sharpens iron. Your body is the blade; the gym is the forge.",

    // ===== Broken Heart / Rebuild Yourself =====
    "She left. The weight stayed. Pick it up.",
    "The best revenge is a version of yourself they can't even recognize.",
    "They broke your heart. Let the gym break your limits.",
    "You lost someone. Don't lose yourself too.",
    "Heartbreak is just another dungeon. Clear it.",
    "Love didn't kill you. So nothing in this gym can.",
    "The person who left missed the version you're about to become.",
    "You don't need closure. You need a barbell and a purpose.",
    "Cry if you must. Then wipe your face and lift.",
    "The pain in your chest? Replace it with the burn in your muscles.",
    "They chose someone else. Choose yourself. Every. Single. Day.",
    "You weren't abandoned. You were set free to become dangerous.",
    "Turn your 'why wasn't I enough' into 'watch me become too much.'",
    "Broken hearts heal. Weak bodies don't — unless you train them.",
    "Fall apart in private. Rebuild in public. Let the results speak.",
    "One day they'll see you and realize the mistake. You won't even notice.",
    "Stop rereading old texts. Start rewriting your body.",
    "They left you empty. Fill yourself with iron.",
    "Your heart got shattered? Good. Build a chest so strong nothing gets through again.",
    "Missing someone? Miss your old PRs instead. Go beat them.",

    // ===== Loneliness & Inner Darkness =====
    "The gym doesn't judge you. The weights don't ask why you're sad. Just show up.",
    "Loneliness is just a dungeon with no party. Solo it.",
    "You feel alone? Good. Legends are forged in solitude.",
    "Nobody's coming to save you. That's the best news you'll ever hear.",
    "The darkness you feel? Channel it. Darkness is where shadows are born.",
    "You don't need anyone to believe in you. The System already does.",
    "While they're out living easy, you're in here becoming unbreakable.",
    "Silence the noise. Silence the memories. Let the iron do the talking.",
    "The loneliest road leads to the strongest version of you.",
    "Your pain is fuel. Your anger is pre-workout. Use everything.",

    // ===== Getting Back Up / Resilience =====
    "You've survived 100% of your worst days. This set is nothing.",
    "Rock bottom is just a solid foundation to build a monster on.",
    "They told you you're nothing. Prove them wrong in silence.",
    "The world broke you? Congratulations — broken things get rebuilt stronger.",
    "Stop waiting for motivation. Discipline doesn't need your feelings.",
    "You are not your past. You are what you do next.",
    "The version of you that gave up doesn't exist here. Move.",
    "Scars mean you survived. Muscles mean you chose to fight back.",
    "Every scar is an upgrade. Every failure is XP. Keep grinding.",
    "They counted you out. Let your body be the proof they were wrong.",

    // ===== Self-Worth & Transformation =====
    "You are the project. The gym is the lab. Get to work.",
    "Stop begging people to stay. Become someone people are afraid to lose.",
    "Your value doesn't decrease because someone failed to see it.",
    "Build a body that matches the strength you've been hiding inside.",
    "The glow-up isn't for them. It's for the person in the mirror.",
    "You don't owe anyone an explanation. You owe yourself a transformation.",
    "Invest the energy you wasted on them — into yourself.",
    "They'll miss you eventually. Make sure the person they miss no longer exists.",
    "The old you died in that heartbreak. Let the new one be terrifying.",
    "You can't control who stays. You can control how strong you become.",

    // ===== Late Night / Raw Truth =====
    "3 AM and you can't sleep? Tomorrow you train harder than today. That's the only plan.",
    "The nights are long when you're healing. But the mornings belong to hunters.",
    "You're hurting. I know. But pain shared with iron becomes power.",
    "Some nights you'll want to quit everything. Survive the night. Train at dawn.",
    "The tears you shed in silence water the strength growing inside you.",
    "Tonight you grieve. Tomorrow you conquer. The System never closes.",
    "You're not broken. You're mid-transformation. Caterpillar to something lethal.",
    "That empty feeling? It's just making room for something greater.",
    "The heaviest weight you'll ever lift is your broken self off the floor. Do it anyway.",
    "They forgot about you. Make sure history doesn't."
];

function getDefaultData() {
    return {
        level: 1,
        xp: 0,
        gold: 0,
        freePoints: 0,
        stats: {
            str: 5, agi: 4, vit: 5, end: 4, wil: 3, phs: 3.0,
            totalWorkouts: 0,
            totalCalBurned: 0,
            totalCalConsumed: 0,
            totalMeals: 0,
            totalQuestsCompleted: 0,
            totalDaysActive: 0,
            totalPenalties: 0,
            shadowMissionsCompleted: 0,
            bossesDefeated: 0
        },
        streak: 0,
        lastActiveDate: null,
        achievements: [],
        unlockedSkills: [],
        workouts: [],    // { id, date, exercise, reps, sets, weight, intensity, calBurned, xp }
        foods: [],       // { id, date, food, meal, protein, carbs, fats, calories, xp }
        quests: [],      // { id, date, title, desc, type, xp, gold, cleared, failed }
        penalties: [],   // { id, date, reason, xpLost }
        shadowArmy: 0,
        skillTree: { strength: [], endurance: [], shadow: [] },
        templates: [],      // custom workout templates
        journalRead: [],    // IDs of read journal chapters
        boss: null,
        lastShadowMission: 0,
        loginStreak: 0,
        lastLoginReward: null,
        shop: {
            purchased: [],
            inventory: [],
            equipped: null
        },
        physique: {
            currentWeight: null,
            targetWeight: null,
            startWeight: null,
            startDate: null,
            history: []  // { date, weight }
        },
        settings: {
            playerName: 'Hunter',
            soundEnabled: true
        }
    };
}

function xpForLevel(level) {
    // Smooth quadratic curve: ~370 at Lv1 → ~20,825 at Lv350
    // Consistent player reaches X-Rank (Lv351) in ~3 years
    if (level <= 1) return 370;
    return Math.floor(350 + 20 * level + 0.11 * level * level);
}

function getRank(level) {
    return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[0];
}

function getTitle(level) {
    let title = 'The Weakest Hunter';
    const keys = Object.keys(TITLES).map(Number).sort((a, b) => a - b);
    for (const k of keys) {
        if (level >= k) title = TITLES[k];
    }
    return title;
}

function getRandomWisdom() {
    return WISDOM[Math.floor(Math.random() * WISDOM.length)];
}
