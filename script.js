// Header scroll state
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    })
  );
}

// Active nav link while scrolling
const sections = ['top', 'rreth', 'sherbimet', 'katalog', 'kontakt']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll('.nav a');
const spy = () => {
  let current = sections[0];
  sections.forEach((s) => {
    if (window.scrollY + 140 >= s.offsetTop) current = s;
  });
  navLinks.forEach((l) =>
    l.classList.toggle('active', l.getAttribute('href') === '#' + current.id)
  );
};
window.addEventListener('scroll', spy, { passive: true });
spy();

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Catalog filters
const items = Array.from(document.querySelectorAll('.cat-item'));
const applyFilter = (f) => {
  items.forEach((it) => {
    it.classList.toggle('hide', f !== 'all' && it.dataset.cat !== f);
  });
};
document.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});
const initialFilter = document.querySelector('.filter.active');
if (initialFilter) applyFilter(initialFilter.dataset.filter);


// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let visible = [];
let index = 0;

const show = (i) => {
  if (!visible.length) return;
  index = (i + visible.length) % visible.length;
  const el = visible[index];
  const img = el.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
};

items.forEach((it) => {
  it.addEventListener('click', () => {
    visible = items.filter((x) => !x.classList.contains('hide'));
    show(visible.indexOf(it));
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

const close = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};

document.getElementById('lbClose').addEventListener('click', close);
document.getElementById('lbPrev').addEventListener('click', (e) => {
  e.stopPropagation();
  show(index - 1);
});
document.getElementById('lbNext').addEventListener('click', (e) => {
  e.stopPropagation();
  show(index + 1);
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) close();
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(index - 1);
  if (e.key === 'ArrowRight') show(index + 1);
});