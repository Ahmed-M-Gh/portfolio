document.addEventListener('DOMContentLoaded', () => {
    // Dynamic year
    const yearSpan = document.getElementById('yearSpan');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Live Clock (Cairo GMT+2)
    function updateClock() {
        const now = new Date();
        const options = { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeStr = now.toLocaleTimeString('en-US', options);
        const clockEl = document.getElementById('liveClock');
        if (clockEl) {
            clockEl.textContent = `Cairo • ${timeStr} GMT+2`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Mobile Nav Toggle
    const mobileNavBtn = document.getElementById('mobileNavBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNavBtn && mobileNav) {
        mobileNavBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
        });
    }
});

// Works Filtering
function filterWorks(category) {
    const btns = document.querySelectorAll('.work-filter-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.className = 'work-filter-btn px-4 py-2 rounded-xl text-xs font-mono font-bold bg-tangerine-500 text-ink-900 transition-all';
        } else {
            btn.className = 'work-filter-btn px-4 py-2 rounded-xl text-xs font-mono font-bold bg-ink-800 text-slate-300 border border-ink-border hover:text-white transition-all';
        }
    });

    const cards = document.querySelectorAll('.work-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Case Study Modal
function openWorkModal(title, desc, techArray, imgUrl, metric, githubUrl) {
    document.getElementById('modalWorkTitle').textContent = title;
    document.getElementById('modalWorkDesc').textContent = desc;
    document.getElementById('modalWorkImg').src = imgUrl;
    document.getElementById('modalWorkMetric').textContent = metric;
    document.getElementById('modalWorkGithub').href = githubUrl;

    const techContainer = document.getElementById('modalWorkTech');
    techContainer.innerHTML = '';
    techArray.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'px-2.5 py-1 rounded bg-ink-800 border border-ink-border text-tangerine-500 text-[11px] font-mono';
        badge.textContent = tech;
        techContainer.appendChild(badge);
    });

    const modal = document.getElementById('workModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
}

function closeWorkModal() {
    const modal = document.getElementById('workModal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// Copy Email Helper
function copyEmail(email) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = email;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    showNotification('Email copied to clipboard!');
}

// Toast Feedback
function showNotification(msg) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Scope Selection Button Handler
function selectScope(btn, val) {
    document.querySelectorAll('.scope-btn').forEach(b => {
        b.classList.remove('border-tangerine-500', 'text-tangerine-500');
        b.classList.add('border-ink-border', 'text-slate-300');
    });
    btn.classList.remove('border-ink-border', 'text-slate-300');
    btn.classList.add('border-tangerine-500', 'text-tangerine-500');
    document.getElementById('selectedScopeInput').value = val;
}