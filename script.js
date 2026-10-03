(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.site-nav nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
  });

  // Active nav link
  const links = [...document.querySelectorAll('.site-nav nav a')];
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  // Sections without their own nav item map to the nearest one
  const alias = { skills: 'teaching', education: 'teaching' };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = alias[en.target.id] || en.target.id;
        links.forEach((a) => a.classList.remove('active'));
        const a = map.get(id);
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

    // Gentle fade-in, skipped entirely when reduced motion is requested
    if (!reduce) {
      root.classList.add('js');
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    }
  }
})();
