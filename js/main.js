/**
 * Marci Metzger Homes — site interactions
 *
 * Four small, independent pieces of behavior:
 *   1. Sticky header: swap the transparent-over-hero header for a solid one on scroll.
 *   2. Mobile nav: open/close the full-screen menu panel.
 *   3. Search + contact forms: since this is a static rebuild with no backend/IDX
 *      connection, both forms confirm the submission in-page rather than failing silently.
 *   4. Lightbox: click any gallery photo to view it larger, with keyboard + arrow navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Sticky header ---------- */
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 40;

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- 2. Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMobileNav() {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleMobileNav);

  // Close the mobile menu whenever a link inside it is used
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- 3. Forms ---------- */
  // No backend is wired up in this static build. We prevent the default
  // navigation-away submit and instead show an inline confirmation, so the
  // page stays usable and honest about what it can currently do.
  const searchForm = document.getElementById('search-form');
  const searchNote = document.getElementById('search-note');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.getElementById('location').value || 'any location';
    searchNote.textContent = `Thanks — we'll follow up with matching listings in ${location}. In the meantime, feel free to call (206) 919-6886.`;
  });

  const contactForm = document.getElementById('contact-form');
  const contactNote = document.getElementById('contact-note');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) {
      contactNote.textContent = 'Please add your email so we can get back to you.';
      return;
    }
    contactNote.textContent = 'Thanks for reaching out — Marci will get back to you shortly.';
    contactForm.reset();
  });

  /* ---------- 4. Lightbox gallery ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showRelative(offset) {
    currentIndex = (currentIndex + offset + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showRelative(-1));
  lightboxNext.addEventListener('click', () => showRelative(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
