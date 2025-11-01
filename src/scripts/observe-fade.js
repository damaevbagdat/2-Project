// src/scripts/observe-fade.js
// Единый IntersectionObserver для всех элементов с классом .fade-in-element
const observeFade = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window))
    return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // если нужно, можно перестать наблюдать за элементом
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document
    .querySelectorAll('.fade-in-element')
    .forEach(el => observer.observe(el));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeFade);
} else {
  observeFade();
}
