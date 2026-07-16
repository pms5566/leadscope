/* =====================================================
   APEX GYM — app.js
   ===================================================== */

'use strict';

/* ===== SCHEDULE DATA ===== */
const SCHEDULE = {
  mon: [
    { time:'06:00', name:'Power Surge HIIT',       trainer:'Sarah Chen',    spots:'4 spots left' },
    { time:'08:00', name:'Strength Foundations',   trainer:'Marcus Reeves', spots:'8 spots left' },
    { time:'10:00', name:'Yoga Flow',              trainer:'Anya Patel',    spots:'12 spots left' },
    { time:'12:00', name:'Lunch Burn HIIT',        trainer:'Sarah Chen',    spots:'2 spots left' },
    { time:'17:00', name:'Combat HIIT',            trainer:'Derek Stone',   spots:'6 spots left' },
    { time:'19:00', name:'Evening Strength',       trainer:'Marcus Reeves', spots:'10 spots left' },
  ],
  tue: [
    { time:'06:00', name:'Morning Cardio Blast',   trainer:'Sarah Chen',    spots:'5 spots left' },
    { time:'09:00', name:'Functional Fitness',     trainer:'Anya Patel',    spots:'9 spots left' },
    { time:'11:00', name:'Boxing Fundamentals',    trainer:'Derek Stone',   spots:'3 spots left' },
    { time:'17:30', name:'Power Yoga',             trainer:'Anya Patel',    spots:'7 spots left' },
    { time:'19:00', name:'Advanced HIIT',          trainer:'Sarah Chen',    spots:'1 spot left'  },
  ],
  wed: [
    { time:'06:00', name:'Strength & Power',       trainer:'Marcus Reeves', spots:'6 spots left' },
    { time:'08:30', name:'Spin Studio',            trainer:'Jenny Liu',     spots:'10 spots left' },
    { time:'12:00', name:'Combat HIIT',            trainer:'Derek Stone',   spots:'4 spots left' },
    { time:'17:00', name:'Yoga & Stretch',         trainer:'Anya Patel',    spots:'14 spots left' },
    { time:'19:00', name:'Night Burn HIIT',        trainer:'Sarah Chen',    spots:'8 spots left' },
  ],
  thu: [
    { time:'07:00', name:'Morning Power',          trainer:'Marcus Reeves', spots:'5 spots left' },
    { time:'09:30', name:'Cardio Dance',           trainer:'Jenny Liu',     spots:'11 spots left' },
    { time:'12:00', name:'Core & Stability',       trainer:'Anya Patel',    spots:'9 spots left' },
    { time:'18:00', name:'Kickboxing HIIT',        trainer:'Derek Stone',   spots:'2 spots left' },
    { time:'20:00', name:'Strength Session',       trainer:'Marcus Reeves', spots:'6 spots left' },
  ],
  fri: [
    { time:'06:00', name:'Friday Fire HIIT',       trainer:'Sarah Chen',    spots:'3 spots left' },
    { time:'08:00', name:'Spin Studio',            trainer:'Jenny Liu',     spots:'7 spots left' },
    { time:'10:00', name:'Strength Training',      trainer:'Marcus Reeves', spots:'8 spots left' },
    { time:'12:00', name:'Boxing Class',           trainer:'Derek Stone',   spots:'5 spots left' },
    { time:'17:00', name:'Yoga Recovery',          trainer:'Anya Patel',    spots:'12 spots left' },
  ],
  sat: [
    { time:'08:00', name:'Weekend Warrior',        trainer:'Marcus Reeves', spots:'2 spots left' },
    { time:'10:00', name:'Combat Conditioning',    trainer:'Derek Stone',   spots:'6 spots left' },
    { time:'12:00', name:'Power Yoga',             trainer:'Anya Patel',    spots:'10 spots left' },
    { time:'14:00', name:'HIIT Circuit',           trainer:'Sarah Chen',    spots:'4 spots left' },
  ],
  sun: [
    { time:'09:00', name:'Sunday Reset Yoga',      trainer:'Anya Patel',    spots:'15 spots left' },
    { time:'11:00', name:'Active Recovery',        trainer:'Jenny Liu',     spots:'8 spots left' },
    { time:'14:00', name:'Light Strength',         trainer:'Marcus Reeves', spots:'10 spots left' },
  ],
};

/* ===== RENDER SCHEDULE ===== */
function renderSchedule(day) {
  const list = document.getElementById('schedList');
  if (!list) return;
  const items = SCHEDULE[day] || [];
  list.innerHTML = items.map(item => `
    <div class="sched-item">
      <div class="sched-time">${item.time}</div>
      <div class="sched-div"></div>
      <div class="sched-info">
        <div class="sched-name">${item.name}</div>
        <div class="sched-trainer">with ${item.trainer}</div>
      </div>
      <div class="sched-spots">${item.spots}</div>
      <button class="sched-btn" onclick="bookClass('${item.name}')">Book →</button>
    </div>
  `).join('');
}

/* ===== SCHEDULE TABS ===== */
const schedTabs = document.getElementById('schedTabs');
if (schedTabs) {
  schedTabs.addEventListener('click', e => {
    const tab = e.target.closest('.sched-tab');
    if (!tab) return;
    schedTabs.querySelectorAll('.sched-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderSchedule(tab.dataset.day);
  });
}

/* Set today's tab as active */
const DAYS = ['sun','mon','tue','wed','thu','fri','sat'];
const todayKey = DAYS[new Date().getDay()];
const todayTab = document.querySelector(`[data-day="${todayKey}"]`);
if (todayTab) {
  document.querySelectorAll('.sched-tab').forEach(t => t.classList.remove('active'));
  todayTab.classList.add('active');
  renderSchedule(todayKey);
} else {
  renderSchedule('mon');
}

function bookClass(name) {
  showToast(`🎉 Booking sent for "${name}"! Check your email.`);
}

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar?.classList.toggle('scrolled', y > 50);
  scrollTopBtn?.classList.toggle('vis', y > 400);
  updateBottomNav(y);
}, { passive: true });

/* ===== HAMBURGER / MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mmOverlay  = document.getElementById('mmOverlay');

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  mmOverlay?.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobileMenu() {
  mobileMenu?.classList.remove('open');
  hamburger?.classList.remove('open');
  mmOverlay?.classList.remove('show');
  document.body.style.overflow = '';
}

/* ===== COUNTER ANIMATION ===== */
const counted = new WeakSet();

function animateCount(el) {
  if (counted.has(el)) return;
  counted.add(el);

  const raw    = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1800;
  const start  = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
    const v = Math.round(e * raw);

    if (raw >= 1000) {
      /* suffix like "K+" already includes K, so just strip the K from suffix if present */
      const cleanSuffix = suffix.startsWith('K') ? suffix.slice(1) : suffix;
      el.textContent = (v >= 1000 ? (v / 1000).toFixed(0) : v) + 'K' + cleanSuffix;
    } else {
      el.textContent = v + suffix;
    }
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ===== INTERSECTION OBSERVER ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('vis');
    /* trigger counters inside this element */
    el.querySelectorAll('[data-count]').forEach(animateCount);
    /* if the element itself is a counter */
    if (el.hasAttribute('data-count')) animateCount(el);
  });
}, { threshold: 0.14 });

document.querySelectorAll(
  '.anim-up, .anim-left, .anim-right, .si, [data-count]'
).forEach(el => io.observe(el));

/* Run hero stat counters after a short delay */
setTimeout(() => {
  document.querySelectorAll('.hs-num[data-count]').forEach(animateCount);
}, 900);

/* ===== TESTIMONIALS SLIDER ===== */
let currentSlide = 0;
const testiTrack = document.getElementById('testiTrack');
const testiDots  = document.querySelectorAll('.td');
let autoSlide;

function perView() { return window.innerWidth <= 768 ? 1 : 3; }
function maxSlide() {
  return Math.max(0, (testiTrack?.children.length || 0) - perView());
}

function goSlide(idx) {
  if (!testiTrack) return;
  currentSlide = Math.max(0, Math.min(idx, maxSlide()));
  const w = testiTrack.children[0]?.offsetWidth + 20 || 0;
  testiTrack.style.transform = `translateX(-${currentSlide * w}px)`;
  testiDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

testiDots.forEach(dot => {
  dot.addEventListener('click', () => goSlide(+dot.dataset.i));
});

function startAutoSlide() {
  stopAutoSlide();
  autoSlide = setInterval(() => goSlide((currentSlide + 1) > maxSlide() ? 0 : currentSlide + 1), 4500);
}
function stopAutoSlide() { clearInterval(autoSlide); }

startAutoSlide();

/* Touch swipe */
let tx = 0;
testiTrack?.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stopAutoSlide(); }, { passive: true });
testiTrack?.addEventListener('touchend', e => {
  const diff = tx - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 44) goSlide(currentSlide + (diff > 0 ? 1 : -1));
  startAutoSlide();
});

window.addEventListener('resize', () => goSlide(0));

/* ===== PRICING COUNTERS ===== */
const pcObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.pc-amt[data-count]').forEach(animateCount);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.pc').forEach(c => pcObserver.observe(c));

/* ===== BOTTOM NAV ===== */
const BN_MAP = [
  { id: 'bn-home',     section: 'home'     },
  { id: 'bn-classes',  section: 'classes'  },
  { id: 'bn-schedule', section: 'schedule' },
  { id: 'bn-pricing',  section: 'pricing'  },
  { id: 'bn-contact',  section: 'contact'  },
];

function bnNav(btn, href) {
  document.querySelectorAll('.bn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

function updateBottomNav(y) {
  let current = '';
  BN_MAP.forEach(({ section }) => {
    const el = document.getElementById(section);
    if (el && y >= el.offsetTop - 220) current = section;
  });
  BN_MAP.forEach(({ id, section }) => {
    document.getElementById(id)?.classList.toggle('active', section === current);
  });
}

/* ===== CTA FORM ===== */
function handleCTA(e) {
  e.preventDefault();
  const email = document.getElementById('ctaEmail')?.value || '';
  if (!email || !email.includes('@')) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }
  showToast(`🎉 Welcome! Free session details sent to ${email.split('@')[0]}@...`);
  document.getElementById('ctaEmail').value = '';
}

/* ===== SELECT PLAN ===== */
function selectPlan(plan) {
  showToast(`✅ You selected the ${plan} plan! Redirecting to checkout...`);
}

/* ===== TOAST NOTIFICATION ===== */
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('apex-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'apex-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

/* ===== SMOOTH CLOSE: click nav links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== PERFORMANCE: lazy-start marquee pause on hover ===== */
const marqueeTrack = document.querySelector('.marquee-track');
marqueeTrack?.parentElement?.addEventListener('mouseenter', () => {
  marqueeTrack.style.animationPlayState = 'paused';
});
marqueeTrack?.parentElement?.addEventListener('mouseleave', () => {
  marqueeTrack.style.animationPlayState = 'running';
});

/* ===== PROFILE DRAWER CONTROL ===== */
function openProfileDrawer(event) {
  event?.preventDefault();
  event?.stopPropagation();
  const drawer = document.getElementById('profileDrawer');
  const overlay = document.getElementById('pdOverlay');
  drawer?.classList.add('open');
  overlay?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProfileDrawer() {
  const drawer = document.getElementById('profileDrawer');
  const overlay = document.getElementById('pdOverlay');
  drawer?.classList.remove('open');
  overlay?.classList.remove('show');
  document.body.style.overflow = '';
}

/* ===== MOBILE FOOTER ACCORDION ===== */
document.querySelectorAll('.footer-grid .ft').forEach(header => {
  header.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      header.classList.toggle('active');
    }
  });
});

