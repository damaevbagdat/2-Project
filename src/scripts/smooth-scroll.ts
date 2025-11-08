// src/scripts/smooth-scroll.ts
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
