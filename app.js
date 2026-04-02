// ===================================================
// E-Cell IIMTU — Shared JavaScript Utilities
// ===================================================

// ─── Theme Toggle ───
function initTheme() {
    const saved = localStorage.getItem('ecell-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const curr = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ecell-theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// ─── Navbar scroll ───
function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Hamburger
    const hamburger = document.querySelector('.hamburger');
    const links = document.querySelector('.navbar-links');
    if (hamburger && links) {
        hamburger.addEventListener('click', () => {
            links.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
    }

    // Active link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(path)) link.classList.add('active');
    });
}

// ─── Scroll Reveal ───
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Counter Animation ───
function animateCounter(el, end, duration = 2000, prefix = '', suffix = '') {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= end) { start = end; clearInterval(timer); }
        el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
    }, 16);
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const end = parseInt(el.dataset.count, 10);
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                animateCounter(el, end, 2000, prefix, suffix);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
}

// ─── Countdown Timer ───
function initCountdown(targetDate, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    function update() {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const diff = target - now;
        if (diff <= 0) {
            container.innerHTML = '<span class="text-orange font-bold">Event has started!</span>';
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        container.innerHTML = `
      <div class="countdown-unit"><span class="countdown-num">${String(days).padStart(2, '0')}</span><div class="countdown-label">Days</div></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><span class="countdown-num">${String(hours).padStart(2, '0')}</span><div class="countdown-label">Hours</div></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><span class="countdown-num">${String(mins).padStart(2, '0')}</span><div class="countdown-label">Mins</div></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit"><span class="countdown-num">${String(secs).padStart(2, '0')}</span><div class="countdown-label">Secs</div></div>
    `;
    }
    update();
    setInterval(update, 1000);
}

// ─── Toast ───
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
    })();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ─── Modal ───
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
}
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
}
function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });
}

// ─── Tab System ───
function initTabs(containerSelector) {
    document.querySelectorAll(containerSelector || '.tabs').forEach(tabContainer => {
        const buttons = tabContainer.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const parent = tabContainer.closest('[data-tabs-parent]') || document;
                parent.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.toggle('hidden', content.dataset.tab !== target);
                });
            });
        });
    });
}

// ─── Filter System ───
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.filterGroup || 'default';
            document.querySelectorAll(`.filter-btn[data-filter-group="${group}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const gridId = btn.dataset.target;
            const grid = document.getElementById(gridId);
            if (!grid) return;
            grid.querySelectorAll('[data-category]').forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.display = show ? '' : 'none';
            });
        });
    });
}

// ─── Newsletter Subscribe ───
function initNewsletter() {
    document.querySelectorAll('.newsletter-form-el').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.querySelector('[name="name"]')?.value;
            const email = form.querySelector('[name="email"]')?.value;
            if (!email) return;
            // Simulate API call
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Subscribing...'; }
            await new Promise(r => setTimeout(r, 1200));
            showToast(`Welcome ${name ? name + '!' : ''} You've been subscribed! 🎉`);
            form.reset();
            if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
        });
    });
}

// ─── Contact Form ───
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
        await new Promise(r => setTimeout(r, 1500));
        showToast('Application submitted! We\'ll get back to you soon. 🚀');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Submit Application'; }
    });
}

// ─── QR Code Generator (simple canvas-based) ───
function generateQR(data, canvasId, size = 200) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    // Simple QR placeholder with actual content display
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    // Draw a placeholder QR pattern
    ctx.fillStyle = '#0D1B2A';
    const cell = size / 25;
    const qrPattern = [
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0],
        [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
    ];
    for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 25; col++) {
            if (qrPattern[row][col]) {
                ctx.fillRect(col * cell, row * cell, cell, cell);
            }
        }
    }
}

// ─── Voting System (localStorage) ───
function initVoting() {
    const votes = JSON.parse(localStorage.getItem('ecell-votes') || '{}');
    document.querySelectorAll('.vote-btn').forEach(btn => {
        const id = btn.dataset.id;
        if (votes[id]) btn.classList.add('voted');
        btn.addEventListener('click', () => {
            const countEl = btn.querySelector('.vote-count');
            if (!countEl) return;
            if (votes[id]) {
                votes[id] = false;
                btn.classList.remove('voted');
                countEl.textContent = parseInt(countEl.textContent) - 1;
            } else {
                votes[id] = true;
                btn.classList.add('voted');
                countEl.textContent = parseInt(countEl.textContent) + 1;
            }
            localStorage.setItem('ecell-votes', JSON.stringify(votes));
        });
    });
}

// ─── Admin: Sidebar Toggle (mobile) ───
function initAdminSidebar() {
    const toggle = document.getElementById('adminMenuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
}

// ─── Admin: Table search ───
function initTableSearch(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    if (!input || !table) return;
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        table.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    });
}

// ─── Global Init ───
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initReveal();
    initCounters();
    initTabs();
    initFilters();
    initModals();
    initNewsletter();
    initContactForm();
    initVoting();
    if (document.querySelector('.admin-layout')) initAdminSidebar();

    // Theme toggle btn
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Close modal buttons
    document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay')?.classList.remove('open');
        });
    });
});
