// src/scripts/accordion.ts
export function initAccordion() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      const section = card.closest('section');
      section?.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
  });
}
