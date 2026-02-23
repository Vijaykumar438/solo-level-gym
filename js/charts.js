// ==========================================
//  CHARTS.JS — Chart.js rendering
// ==========================================

let chartXP = null;
let chartCal = null;
let chartMacro = null;

const chartFont = "'Share Tech Mono', monospace";
const gridColor = 'rgba(79,195,247,0.08)';
const tickColor = '#7ec8e3';

function renderAllCharts() {
    renderXPChart();
    renderCalChart();
    renderMacroChart();
}

// ---- 7-Day XP Chart ----
function renderXPChart() {
    const ctx = document.getElementById('chartXP');
    if (!ctx) return;
    
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        
        // Sum XP earned from workouts + foods on that day
        const dayWorkouts = D.workouts.filter(w => w.date && w.date.startsWith(key));
        const dayFoods = D.foods.filter(f => f.date && f.date.startsWith(key));
        const dayQuests = D.quests.filter(q => q.date && q.date.startsWith(key) && q.cleared);
        
        let dayXP = 0;
        dayWorkouts.forEach(w => dayXP += w.xp);
        dayFoods.forEach(f => dayXP += f.xp);
        dayQuests.forEach(q => dayXP += q.xp);
        
        data.push(dayXP);
    }
    
    if (chartXP) chartXP.destroy();
    chartXP = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'XP Earned',
                data,
                backgroundColor: 'rgba(79,195,247,0.35)',
                borderColor: '#4fc3f7',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: tickColor, font: { family: chartFont, size: 11 } }, grid: { color: gridColor } },
                y: { beginAtZero: true, ticks: { color: tickColor, font: { family: chartFont, size: 11 } }, grid: { color: gridColor } }
            }
        }
    });
}

// ---- 7-Day Calorie Chart ----
function renderCalChart() {
    const ctx = document.getElementById('chartCal');
    if (!ctx) return;
    
    const labels = [];
    const burned = [];
    const consumed = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const dayW = D.workouts.filter(w => w.date && w.date.startsWith(key));
        const dayF = D.foods.filter(f => f.date && f.date.startsWith(key));
        
        let b = 0, c = 0;
        dayW.forEach(w => b += w.calBurned);
        dayF.forEach(f => c += f.calories);
        
        burned.push(b);
        consumed.push(c);
    }
    
    if (chartCal) chartCal.destroy();
    chartCal = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Burned',
                    data: burned,
                    borderColor: '#ff5252',
                    backgroundColor: 'rgba(255,82,82,0.1)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4,
                    pointBackgroundColor: '#ff5252'
                },
                {
                    label: 'Consumed',
                    data: consumed,
                    borderColor: '#69f0ae',
                    backgroundColor: 'rgba(105,240,174,0.1)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4,
                    pointBackgroundColor: '#69f0ae'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: tickColor, font: { family: chartFont, size: 11 } } }
            },
            scales: {
                x: { ticks: { color: tickColor, font: { family: chartFont, size: 11 } }, grid: { color: gridColor } },
                y: { beginAtZero: true, ticks: { color: tickColor, font: { family: chartFont, size: 11 } }, grid: { color: gridColor } }
            }
        }
    });
}

// ---- Today's Macro Breakdown ----
function renderMacroChart() {
    const ctx = document.getElementById('chartMacro');
    if (!ctx) return;
    
    const todayFoods = getTodayFoods();
    let p = 0, c = 0, f = 0;
    todayFoods.forEach(food => { p += food.protein; c += food.carbs; f += food.fats; });
    
    if (p + c + f === 0) { p = 1; c = 1; f = 1; } // Placeholder if no data
    
    if (chartMacro) chartMacro.destroy();
    chartMacro = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fats'],
            datasets: [{
                data: [p, c, f],
                backgroundColor: ['#4fc3f7', '#69f0ae', '#ffd740'],
                borderColor: '#0a0f1c',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: tickColor, font: { family: chartFont, size: 11 }, padding: 12 }
                }
            },
            cutout: '62%'
        }
    });
}
