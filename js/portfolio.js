// Scroll reveal
const els = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
els.forEach(el => obs.observe(el));

// Filter
document.querySelectorAll('.filter-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('[data-category]').forEach(el => {
      const cats = el.dataset.category.split(' ');
      el.classList.toggle('filter-hidden', filter !== 'all' && !cats.includes(filter));
    });

    // Hide weitere-section if all its cards are hidden
    const weitere = document.getElementById('weitere-section');
    if (weitere) {
      const hasVisible = [...weitere.querySelectorAll('[data-category]')]
        .some(c => !c.classList.contains('filter-hidden'));
      weitere.classList.toggle('filter-hidden', filter !== 'all' && !hasVisible);
    }

    // Hide index section if all rows are hidden
    const indexSection = document.getElementById('index-section');
    if (indexSection) {
      const hasVisible = [...indexSection.querySelectorAll('.index-row')]
        .some(r => !r.classList.contains('filter-hidden'));
      indexSection.classList.toggle('filter-hidden', !hasVisible);
    }
  });
});
