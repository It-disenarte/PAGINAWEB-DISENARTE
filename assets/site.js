// ============================================================
// DISEÑARTE MÉXICO — comportamiento compartido de todo el sitio
// Un solo IntersectionObserver compartido · solo transform/opacity
// ============================================================
const EASE = 'cubic-bezier(.22,1,.36,1)';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = !!(navigator.connection && navigator.connection.saveData);
const isMobile = () => matchMedia('(max-width: 767px)').matches;

let sharedIO = null;
const ioHandlers = new Map();
function observe(el, fn) {
  if (!sharedIO) {
    sharedIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting || e.boundingClientRect.top < e.rootBounds?.bottom) {
          const h = ioHandlers.get(e.target);
          if (h) { h(); ioHandlers.delete(e.target); sharedIO.unobserve(e.target); }
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  }
  ioHandlers.set(el, fn);
  sharedIO.observe(el);
}

// --- Conteo ascendente (1200ms, una sola vez) ----------------------------
function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduced || saveData) { el.textContent = prefix + target + suffix; return; }
    el.textContent = prefix + '0' + suffix;
    observe(el, () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1200, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
}

// --- Navbar sticky: transparente → sólida ---------------------------------
function initNavbar() {
  const nav = document.querySelector('[data-navbar]');
  if (!nav) return;
  const modo = nav.getAttribute('data-navbar'); // "noche" | "taller"
  const solidBg = modo === 'taller' ? '#FFFFFF' : '#1A0F24';
  const solidShadow = modo === 'taller' ? '0 2px 8px rgba(14,7,20,.10)' : '0 1px 0 rgba(255,255,255,.08)';
  nav.style.transition = 'background-color 250ms ease, box-shadow 250ms ease';
  // data-nav-hero="noche": sobre un hero oscuro los enlaces van en blanco
  // mientras la barra es transparente, y vuelven a tinta al volverse sólida.
  const heroOscuro = nav.getAttribute('data-nav-hero') === 'noche';
  const enlaces = heroOscuro
    ? [...nav.querySelectorAll('a, button')].filter((el) =>
        !el.closest('[data-dropdown-panel]') &&      // el panel tiene fondo claro fijo
        (!el.style.background || el.style.background === 'none'))
    : [];
  const iso = nav.querySelector('img');
  const barras = nav.querySelectorAll('[data-menu-btn] span');
  const apply = () => {
    const on = window.scrollY > 24;
    nav.style.backgroundColor = on ? solidBg : 'transparent';
    nav.style.boxShadow = on ? solidShadow : 'none';
    if (!heroOscuro) return;
    const claro = !on;
    enlaces.forEach((el) => { el.style.color = claro ? '#FFFFFF' : '#0E0714'; });
    barras.forEach((s) => { s.style.background = claro ? '#FFFFFF' : '#0E0714'; });
    if (iso) iso.src = claro ? 'assets/marca-blanco.png' : 'assets/marca-color.png';
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { apply(); ticking = false; }); }
  }, { passive: true });
  apply();
}

// --- Menú móvil a pantalla completa ---------------------------------------
function initMenu() {
  const btn = document.querySelector('[data-menu-btn]');
  const menu = document.querySelector('[data-menu]');
  if (!btn || !menu) return;
  const links = menu.querySelectorAll('a, button');
  const close = () => {
    menu.style.opacity = '0';
    menu.style.pointerEvents = 'none';
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const open = () => {
    menu.style.display = 'flex';
    menu.style.pointerEvents = 'auto';
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      menu.style.opacity = '1';
      links.forEach((a, i) => {
        if (reduced) return;
        a.style.opacity = '0'; a.style.transform = 'translateY(16px)';
        a.style.transition = `opacity 350ms ${EASE} ${i * 40}ms, transform 350ms ${EASE} ${i * 40}ms`;
        requestAnimationFrame(() => { a.style.opacity = '1'; a.style.transform = 'translateY(0)'; });
      });
    });
  };
  menu.style.transition = 'opacity 250ms ease';
  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
  menu.addEventListener('click', (e) => { if (e.target === menu || e.target.closest('a')) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// --- Dropdown "Innovación Digital" ----------------------------------------
function initDropdown() {
  const wrap = document.querySelector('[data-dropdown]');
  if (!wrap) return;
  const btn = wrap.querySelector('[data-dropdown-btn]');
  const panel = wrap.querySelector('[data-dropdown-panel]');
  let open = false;
  const set = (v) => {
    open = v;
    btn.setAttribute('aria-expanded', String(v));
    panel.style.opacity = v ? '1' : '0';
    panel.style.transform = v ? 'translateY(0)' : 'translateY(-6px)';
    panel.style.pointerEvents = v ? 'auto' : 'none';
  };
  panel.style.transition = `opacity 200ms ease, transform 200ms ${EASE}`;
  set(false);
  btn.addEventListener('click', (e) => { e.stopPropagation(); set(!open); });
  wrap.addEventListener('mouseenter', () => { if (!isMobile()) set(true); });
  wrap.addEventListener('mouseleave', () => { if (!isMobile()) set(false); });
  document.addEventListener('click', () => { if (open) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
}

// --- Video del hero: pausa fuera de viewport, fallback estático -----------
function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  if (!video) return;
  if (reduced || saveData) { video.remove(); return; } // queda el poster de fondo
  video.muted = true;
  video.loop = true;
  video.playsInline = true;   // el atributo booleano no siempre llega al DOM

  // data-loop-fin acorta el loop, pero solo si cae dentro de la duración real
  let corte = 0;
  const leerCorte = () => {
    const a = parseFloat(video.getAttribute('data-loop-fin'));
    corte = a > 0 && video.duration && a < video.duration - 0.2 ? a : 0;
  };
  video.addEventListener('loadedmetadata', leerCorte);
  video.addEventListener('timeupdate', () => {
    if (corte && video.currentTime >= corte) video.currentTime = 0;   // sin recargar
  });

  let visible = true;
  const intentar = () => { if (visible && video.paused) video.play().catch(() => {}); };
  intentar();
  video.addEventListener('loadeddata', intentar);
  video.addEventListener('canplay', intentar);
  video.addEventListener('pause', () => setTimeout(intentar, 60));
  video.addEventListener('ended', () => { video.currentTime = 0; intentar(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) intentar(); });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { visible = e.isIntersecting; visible ? intentar() : video.pause(); });
  }, { threshold: 0.05 });
  io.observe(video);

  // Vigilante de atascos: reintenta reproducir. Nunca recarga mientras el clip
  // todavía no tiene metadatos (eso abortaba la descarga y la reiniciaba en bucle),
  // y como máximo recarga dos veces en toda la sesión.
  let ultimo = -1, quieto = 0, recargas = 0;
  setInterval(() => {
    if (!visible || document.hidden) { ultimo = video.currentTime; quieto = 0; return; }
    if (video.currentTime !== ultimo) { quieto = 0; ultimo = video.currentTime; return; }
    if (++quieto < 3) return;
    quieto = 0;
    if (video.readyState >= 1 && recargas < 2 && video.duration && video.currentTime >= video.duration - 0.5) {
      recargas++;
      video.load();
    }
    video.play().catch(() => {});
  }, 1500);
}

// --- EL TRAZO: línea SVG que se dibuja con el scroll -----------------------
function initTrazo() {
  const old = document.querySelector('[data-trazo]');
  if (old) old.remove();
  const main = document.querySelector('main');
  if (main && main.hasAttribute('data-sin-trazo')) return;   // páginas que no llevan el trazo
  if (!main) return;
  const hero = document.querySelector('[data-hero]');
  const build = () => {
    const doc = document.documentElement;
    const H = Math.max(main.scrollHeight + main.offsetTop, doc.scrollHeight - 400);
    const W = doc.clientWidth;
    // Franja estrecha en el margen: el trazo NUNCA puede entrar a la columna
    const BANDA = isMobile() ? 16 : 34;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('data-trazo', '');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', BANDA); svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${BANDA} ${H}`);
    svg.style.cssText = `position:absolute;top:0;right:0;width:${BANDA}px;pointer-events:none;z-index:3;overflow:visible;`;
    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `<linearGradient id="gradTrazo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7C07A6"/><stop offset=".45" stop-color="#A53692"/><stop offset="1" stop-color="#5CC6D0"/>
    </linearGradient>`;
    svg.appendChild(defs);
    const path = document.createElementNS(svgNS, 'path');
    let d;
    if (isMobile()) {
      const y0 = hero ? hero.offsetTop + hero.offsetHeight : 0;
      d = `M ${BANDA / 2} ${y0} L ${BANDA / 2} ${H}`;
      path.setAttribute('stroke-width', '2');
    } else {
      // Nace en el borde inferior del hero, alineado a la derecha (estela de la bolita)
      const y0 = hero ? hero.offsetTop + hero.offsetHeight - 40 : 0;
      // Serpentea dentro de la franja (coordenadas locales: 0 … BANDA)
      const R = BANDA - 5, L = 5;
      const xs = [R, L, R, L, R, L];
      const step = (H - y0) / xs.length;
      d = `M ${R} ${y0}`;
      let px = R, py = y0;
      xs.slice(1).concat([L]).forEach((x) => {
        const y = py + step;
        d += ` C ${px} ${py + step * 0.55}, ${x} ${y - step * 0.55}, ${x} ${y}`;
        px = x; py = y;
      });
      path.setAttribute('stroke-width', '3');
    }
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#gradTrazo)');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    document.body.insertBefore(svg, document.body.firstChild);
    document.body.style.position = 'relative';
    const len = path.getTotalLength();
    if (reduced) return; // dibujado al 100% desde el inicio
    path.style.strokeDasharray = String(len);
    let ticking = false;
    const draw = () => {
      const prog = Math.min(1, (scrollY + innerHeight * 0.85) / (H - 100));
      path.style.strokeDashoffset = String(len * (1 - prog));
    };
    draw();
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { draw(); ticking = false; }); }
    }, { passive: true });
  };
  // Espera a que el layout esté estable
  setTimeout(build, 400);
}

// --- Flotante WhatsApp + Chatbot -------------------------------------------
function initFab() {
  const fab = document.querySelector('[data-fab]');
  if (!fab) return;
  // Conversión de Google Ads en todos los CTAs de contacto: WhatsApp, teléfono, correo y botones "Cotizar"/enlaces a Contacto
  const disparaConversion = () => { if (window.gtag) window.gtag('event', 'conversion', { send_to: 'AW-16751651845/z_IpCOXx7LgcEIXY57M-' }); };
  document.querySelectorAll('a[href*="wa.me/"], a[href^="tel:"], a[href^="mailto:"], a[href*="contacto.dc.html"], a[href*="/contacto"]').forEach((a) => {
    a.addEventListener('click', disparaConversion);
  });
  const btn = fab.querySelector('[data-fab-btn]');
  if (!btn) return; // FAB simplificado (solo WhatsApp, sin toggle): nada que inicializar
  const actions = fab.querySelectorAll('[data-fab-action]');
  let open = false;
  const set = (v) => {
    open = v;
    btn.setAttribute('aria-expanded', String(v));
    btn.style.transform = v ? 'rotate(45deg)' : 'rotate(0deg)';
    actions.forEach((a, i) => {
      const delay = (v ? i : actions.length - 1 - i) * 60;
      a.style.transition = `opacity 220ms ${EASE} ${delay}ms, transform 220ms ${EASE} ${delay}ms`;
      a.style.opacity = v ? '1' : '0';
      a.style.transform = v ? 'translateY(0) scale(1)' : 'translateY(12px) scale(.9)';
      a.style.pointerEvents = v ? 'auto' : 'none';
      a.setAttribute('aria-hidden', String(!v));
    });
  };
  btn.style.transition = `transform 220ms ${EASE}`;
  set(false);
  btn.addEventListener('click', () => set(!open));
  // Ocultar cuando el CTA final está en viewport
  const cta = document.querySelector('[data-cta-final]');
  if (cta) {
    fab.style.transition = 'opacity 250ms ease, transform 250ms ease';
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        fab.style.opacity = e.isIntersecting ? '0' : '1';
        fab.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
      });
    }, { threshold: 0.2 }).observe(cta);
  }
  // Chatbot pendiente
  if (!window.DZChat) {
    window.DZChat = {
      abrir() {
        let p = document.getElementById('dz-chat-panel');
        if (!p) {
          p = document.createElement('div');
          p.id = 'dz-chat-panel';
          p.setAttribute('role', 'dialog');
          p.setAttribute('aria-label', 'Chat');
          p.style.cssText = 'position:fixed;right:24px;bottom:96px;width:300px;background:#1A0F24;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:6px 28px 28px 28px;padding:32px 24px;font:400 15px Inter,sans-serif;z-index:60;box-shadow:0 12px 32px rgba(14,7,20,.4)';
          p.innerHTML = '<p style="margin:0">Chat disponible próximamente</p><button aria-label="Cerrar chat" style="position:absolute;top:10px;right:14px;background:none;border:none;color:#96989A;font-size:18px;cursor:pointer" onclick="window.DZChat.cerrar()">×</button>';
          document.body.appendChild(p);
        }
        p.style.display = 'block';
      },
      cerrar() { const p = document.getElementById('dz-chat-panel'); if (p) p.style.display = 'none'; },
    };
  }
}

// --- Smooth scroll con offset del navbar -----------------------------------
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      // offset desde el alto real de la barra, no un valor fijo
      const alto = (document.querySelector('[data-navbar]') || {}).offsetHeight || 96;
      const y = target.getBoundingClientRect().top + scrollY - (alto + 8);
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}

// --- Paralaje del CTA final (único paralaje del sitio) ----------------------
function initParallax() {
  if (reduced) return;
  const bg = document.querySelector('[data-parallax]');
  if (!bg) return;
  let ticking = false;
  const move = () => {
    const r = bg.parentElement.getBoundingClientRect();
    const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    bg.style.transform = `translateY(${(-p * 40).toFixed(1)}px) scale(1.08)`;
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { move(); ticking = false; }); }
  }, { passive: true });
  move();
}

// --- TRANSICIÓN ENTRE PÁGINAS: cortinilla con el isotipo -------------------
function initTransicion() {
  document.querySelector('[data-loader]')?.remove();
  const oscura = ['#0e0714', 'rgb(14, 7, 20)'].includes(getComputedStyle(document.body).backgroundColor.toLowerCase())
    || getComputedStyle(document.body).backgroundColor === 'rgb(14, 7, 20)';
  const fondo = oscura ? '#0E0714' : '#F2F1F3';
  const iso = oscura ? 'assets/iso-blanco.png' : 'assets/iso-color.png';
  const capa = document.createElement('div');
  capa.setAttribute('data-loader', '');
  capa.setAttribute('aria-hidden', 'true');
  capa.style.cssText = `position:fixed;inset:0;z-index:120;background:${fondo};display:grid;place-items:center;opacity:1;transition:opacity 420ms cubic-bezier(.22,1,.36,1)`;
  capa.innerHTML = `<div style="position:relative;display:grid;place-items:center;width:132px;height:132px">
    <svg width="132" height="132" viewBox="0 0 132 132" fill="none" style="position:absolute;inset:0;animation:dzGiro 1.15s linear infinite">
      <defs><linearGradient id="gradCarga" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7C07A6"/><stop offset=".5" stop-color="#A53692"/><stop offset="1" stop-color="#5CC6D0"/>
      </linearGradient></defs>
      <circle cx="66" cy="66" r="62" stroke="url(#gradCarga)" stroke-width="3" stroke-linecap="round" stroke-dasharray="120 270"/>
    </svg>
    <img src="${iso}" alt="" width="64" height="64" style="width:64px;height:64px;object-fit:contain;animation:dzLatido 1.6s ease-in-out infinite">
  </div>`;
  if (!document.getElementById('dzCargaKeys')) {
    const st = document.createElement('style');
    st.id = 'dzCargaKeys';
    st.textContent = '@keyframes dzGiro{to{transform:rotate(360deg)}}@keyframes dzLatido{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.06);opacity:1}}';
    document.head.appendChild(st);
  }
  document.body.appendChild(capa);

  const ocultar = () => {
    capa.style.opacity = '0';
    setTimeout(() => { capa.style.visibility = 'hidden'; }, 460);
  };
  const mostrar = () => { capa.style.visibility = 'visible'; capa.style.opacity = '1'; };
  if (reduced) { capa.remove(); return; }
  // Entrada
  setTimeout(ocultar, 260);
  if (document.readyState === 'complete') setTimeout(ocultar, 0);
  else addEventListener('load', ocultar);
  setTimeout(ocultar, 2500); // red de seguridad: nunca se queda arriba
  addEventListener('pageshow', (e) => { if (e.persisted) ocultar(); });

  // Salida: intercepta navegación interna
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || !href.endsWith('.dc.html') && !href.includes('.dc.html#')) return;
    if (href.split('#')[0] === location.pathname.split('/').pop()) return;
    ev.preventDefault();
    mostrar();
    setTimeout(() => { location.href = href; }, 380);
  });
}

// --- ORBES: deriva aleatoria por todo el hero (nodos propios, no del template)
function initOrbes() {
  const host = document.querySelector('[data-orbes-host]');
  if (!host) return;
  host.textContent = '';
  const COLORES = [
    ['rgba(197,88,180,.98)', 'rgba(165,54,146,.92)', 'rgba(165,54,146,0)'],
    ['rgba(120,214,224,.96)', 'rgba(92,198,208,.9)', 'rgba(92,198,208,0)'],
    ['rgba(146,74,196,.98)', 'rgba(124,7,166,.92)', 'rgba(124,7,166,0)'],
    ['rgba(224,123,201,1)', 'rgba(165,54,146,.94)', 'rgba(165,54,146,0)'],
    ['rgba(124,7,166,.9)', 'rgba(92,198,208,.62)', 'rgba(92,198,208,0)'],
    ['rgba(92,198,208,.95)', 'rgba(124,7,166,.7)', 'rgba(124,7,166,0)'],
  ];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const orbes = COLORES.map((c, i) => {
    const el = document.createElement('span');
    const size = rnd(0.10, 0.34); // fracción del lado menor del hero
    el.setAttribute('data-orbe', String(i + 1));
    el.style.cssText = `position:absolute;left:0;top:0;border-radius:50%;will-change:transform,border-radius;
      background:radial-gradient(circle,${c[0]} 0%,${c[1]} 64%,${c[2]} 100%);
      filter:blur(${(size * 26).toFixed(1)}px);opacity:${rnd(0.8, 0.95).toFixed(2)};`;
    host.appendChild(el);
    return {
      el, size,
      x: rnd(0.1, 0.9), y: rnd(0.1, 0.9),
      tx: rnd(0.06, 0.94), ty: rnd(0.06, 0.94),
      vel: rnd(0.00005, 0.00013),   // avance por ms hacia el objetivo
      fase: rnd(0, 6.283), giro: rnd(0.0012, 0.004) * (Math.random() < 0.5 ? -1 : 1),
      sq: 0, sqAng: 0, ex: 0, ey: 0,
      entrada: 0,
    };
  });

  let W = 0, H = 0, lado = 0;
  const medir = () => {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height; lado = Math.min(W, H);
    orbes.forEach((o) => { const d = o.size * lado; o.el.style.width = d + 'px'; o.el.style.height = d + 'px'; o._d = d; });
  };
  medir();
  // posición inicial pintada de una vez: nunca quedan apilados arriba a la izquierda
  {
    const r = host.getBoundingClientRect();
    orbes.forEach((o) => {
      const X = o.x * r.width - o._d / 2, Y = o.y * r.height - o._d / 2;
      o.el.style.transform = `translate3d(${X.toFixed(1)}px,${Y.toFixed(1)}px,0) scale(${reduced ? 1 : 0.04})`;
    });
  }
  addEventListener('resize', medir);

  let visible = true, t0 = performance.now(), rafId = 0;
  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible && !rafId) { t0 = performance.now(); rafId = requestAnimationFrame(paso); }
  }, { threshold: 0 }).observe(host);

  const morph = (o, t) => {
    const a = 50 + 13 * Math.sin(t * 0.00026 + o.fase);
    const b = 50 + 13 * Math.cos(t * 0.00033 + o.fase * 1.7);
    const c = 50 + 12 * Math.sin(t * 0.0004 + o.fase * 2.3);
    const d = 50 + 12 * Math.cos(t * 0.00022 + o.fase * 3.1);
    return `${a.toFixed(1)}% ${(100 - a).toFixed(1)}% ${c.toFixed(1)}% ${(100 - c).toFixed(1)}%/${b.toFixed(1)}% ${d.toFixed(1)}% ${(100 - d).toFixed(1)}% ${(100 - b).toFixed(1)}%`;
  };

  function paso(now) {
    const dt = Math.min(48, now - t0); t0 = now;
    const t = now;
    // deriva lenta hacia objetivos aleatorios
    for (const o of orbes) {
      const dx = o.tx - o.x, dy = o.ty - o.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.02) {
        o.tx = rnd(0.04, 0.96); o.ty = rnd(0.04, 0.96);
        o.vel = rnd(0.00005, 0.00014);
      } else {
        const k = Math.min(1, (o.vel * dt) / dist);
        o.x += dx * k * 3; o.y += dy * k * 3;
      }
      const wx = 0.02 * Math.sin(t * 0.00016 + o.fase);
      const wy = 0.024 * Math.cos(t * 0.00013 + o.fase * 1.3);
      if (o.entrada < 1) o.entrada = Math.min(1, o.entrada + dt / 1200);
      o.cx = (o.x + wx) * W; o.cy = (o.y + wy) * H;
      o.sq = (o.sq || 0) * 0.86;
      o.ex = (o.ex || 0) * 0.9; o.ey = (o.ey || 0) * 0.9;
    }
    // contacto entre gotas: se empujan y se aplanan en el eje del choque
    for (let i = 0; i < orbes.length; i++) {
      for (let j = i + 1; j < orbes.length; j++) {
        const A = orbes[i], B = orbes[j];
        const rA = A._d / 2, rB = B._d / 2;
        const dx = B.cx - A.cx, dy = B.cy - A.cy;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = (rA + rB) * 0.92;
        if (dist >= min) continue;
        const pen = (min - dist) / min;
        const nx = dx / dist, ny = dy / dist;
        const ang = Math.atan2(ny, nx) * 180 / Math.PI;
        const f = pen * 0.55;
        A.ex -= nx * f * rA * 0.5; A.ey -= ny * f * rA * 0.5;
        B.ex += nx * f * rB * 0.5; B.ey += ny * f * rB * 0.5;
        if (pen > A.sq) { A.sq = pen; A.sqAng = ang; }
        if (pen > B.sq) { B.sq = pen; B.sqAng = ang; }
        A.tx = Math.min(0.96, Math.max(0.04, A.tx - nx * 0.02));
        A.ty = Math.min(0.96, Math.max(0.04, A.ty - ny * 0.02));
        B.tx = Math.min(0.96, Math.max(0.04, B.tx + nx * 0.02));
        B.ty = Math.min(0.96, Math.max(0.04, B.ty + ny * 0.02));
      }
    }
    for (const o of orbes) {
      const e = 1 - Math.pow(1 - o.entrada, 3);
      const esc = 0.04 + e * (1 - 0.04) * (1 + 0.1 * (1 - e));
      const px = o.cx + o.ex - o._d / 2, py = o.cy + o.ey - o._d / 2;
      const ccx = W / 2 - o._d / 2, ccy = H / 2 - o._d / 2;
      const X = ccx + (px - ccx) * e, Y = ccy + (py - ccy) * e;
      const est = 1 + 0.07 * Math.sin(t * 0.0003 + o.fase);
      const sq = Math.min(0.5, o.sq || 0);
      const a2 = o.sqAng || 0;
      const sx = (esc * est * (1 - sq * 0.34)).toFixed(3);
      const sy = (esc / est * (1 + sq * 0.3)).toFixed(3);
      o.el.style.transform = `translate3d(${X.toFixed(1)}px,${Y.toFixed(1)}px,0) rotate(${(a2 + t * o.giro).toFixed(1)}deg) scale(${sx},${sy}) rotate(${(-a2).toFixed(1)}deg)`;
      o.el.style.borderRadius = morph(o, t);
    }
    rafId = visible ? requestAnimationFrame(paso) : 0;
  }
  if (reduced) {
    orbes.forEach((o) => { o.entrada = 1; });
    paso(performance.now()); cancelAnimationFrame(rafId); rafId = 0;
    return;
  }
  rafId = requestAnimationFrame(paso);
}

// --- CHORROS QUE FORMAN LA D ------------------------------------------------
// Muestrea la silueta del isotipo y lanza gotas desde los bordes hasta su
// punto de destino. Al llegar, la D queda formada y respira.
function initChorros() {
  const host = document.querySelector('[data-chorros],[data-estela],[data-profundidad],[data-juguetona]');
  if (!host) return;
  const modoEstela = host.hasAttribute('data-estela');
  const modoZ = host.hasAttribute('data-profundidad');
  const modoJ = host.hasAttribute('data-juguetona');
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;' +
    'mask-image:linear-gradient(180deg,transparent 0,transparent 74px,#000 190px);' +
    '-webkit-mask-image:linear-gradient(180deg,transparent 0,transparent 74px,#000 190px)';
  host.textContent = '';
  host.appendChild(cv);
  const ctx = cv.getContext('2d');
  const buf = document.createElement('canvas');   // siluetas
  const bctx = buf.getContext('2d');
  const msk = document.createElement('canvas');   // máscara fusionada + color
  const mctx = msk.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  const RES = 0.55;            // los lienzos de trabajo van a media resolución
  let W = 0, H = 0, gradColor = null, gradBrillo = null;
  const medir = () => {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    buf.width = Math.round(W * RES); buf.height = Math.round(H * RES);
    msk.width = buf.width; msk.height = buf.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.setTransform(RES, 0, 0, RES, 0, 0);
    mctx.setTransform(RES, 0, 0, RES, 0, 0);
    // gradientes creados una sola vez, no por frame
    gradColor = mctx.createLinearGradient(0, 0, W, H);
    gradColor.addColorStop(0, '#7C07A6');
    gradColor.addColorStop(0.34, '#A53692');
    gradColor.addColorStop(0.62, '#C558B4');
    gradColor.addColorStop(1, '#5CC6D0');
    gradBrillo = ctx.createLinearGradient(0, 0, W * 0.6, H);
    gradBrillo.addColorStop(0, 'rgba(255,255,255,.2)');
    gradBrillo.addColorStop(0.42, 'rgba(255,255,255,.03)');
    gradBrillo.addColorStop(0.75, 'rgba(255,255,255,0)');
  };
  medir();

  const img = new Image();
  img.onload = () => {
    let gotas = [], ladoD = 300, tLleg = 3000;
    const FORMADA = 3000;   // la D se sostiene
    const EXPLO = modoEstela ? 5200 : 3400;  // viaje de la estela · o estallido y flote
    const REAGR = modoEstela ? 2200 : 2600;  // vuelven a formar la D
    const CICLO = FORMADA + EXPLO + REAGR;
    // modo profundidad: formada → estallido en Z → navegación lejos/cerca → fuga → blanco
    const Z_DISP = 2400, Z_NAV = 6000, Z_FUGA = 1100, Z_BLANCO = 2000;
    const Z_CICLO = FORMADA + Z_DISP + Z_NAV + Z_FUGA + Z_BLANCO;
    // modo juguetona: formada → dispersión suelta → estela curvilínea → salida creciendo → blanco
    const J_DISP = 2000, J_NAV = 7000, J_SAL = 1400, J_BLANCO = 1480;
    const J_CICLO = FORMADA + J_DISP + J_NAV + J_SAL + J_BLANCO;
    const construir = () => {
      // 1) muestreo de la silueta
      const N = 116;
      const off = document.createElement('canvas');
      off.width = N; off.height = N;
      const octx = off.getContext('2d');
      octx.drawImage(img, 0, 0, N, N);
      const px = octx.getImageData(0, 0, N, N).data;
      const puntos = [];
      for (let y = 0; y < N; y += 3) for (let x = 0; x < N; x += 3) {
        const i = (y * N + x) * 4;
        const a = px[i + 3];
        const claro = px[i] > 238 && px[i + 1] > 238 && px[i + 2] > 238;
        if (a > 140 && !claro) puntos.push([x / N, y / N, px[i], px[i + 1], px[i + 2]]);
      }
      // 2) destino en pantalla: D grande, alineada a la derecha
      // La D se coloca en el espacio LIBRE que deja el panel de texto
      const hostR = host.getBoundingClientRect();
      const panel = document.querySelector('[data-hero-copy]');
      const pr = panel ? panel.getBoundingClientRect() : null;
      const panelDer = pr ? pr.right - hostR.left : 0;
      const panelArriba = pr ? pr.top - hostR.top : H;
      const dilat = 28;                       // crecimiento al asentarse + umbral
      const libre = W - panelDer - dilat * 2 - 24;
      let lado, ox, oy;
      if (libre > W * 0.2 && libre > 180) {
        lado = Math.min(H * 0.62, libre);
        ox = Math.min(panelDer + dilat + (libre - lado) / 2 + 12, W - lado - dilat);
        ox = Math.max(ox, panelDer + dilat);   // nunca invade el panel
        oy = H * 0.5 - lado / 2;
      } else {
        // sin espacio a la derecha: la D va completa ARRIBA del panel
        const alto = Math.max(120, panelArriba - dilat * 2);
        lado = Math.min(alto, W * 0.6);
        ox = W * 0.5 - lado / 2;
        oy = Math.max(dilat, panelArriba - dilat - lado);
      }
      // cada boquilla lanza su propio color de marca
      const boquillas = [
        [-0.18, 0.22, [165, 54, 146]],   // magenta
        [1.18, 0.12, [92, 198, 208]],    // cian
        [0.5, -0.22, [124, 7, 166]],     // violeta
        [1.22, 0.86, [197, 88, 180]],    // magenta claro
        [-0.12, 0.92, [124, 160, 210]],  // violeta-cian
      ];
      ladoD = lado;
      const total = puntos.length;
      gotas = puntos.map((p, k) => {
        // boquilla al azar: la D se arma en desorden, no boquilla por boquilla
        const b = boquillas[(Math.random() * boquillas.length) | 0];
        const gx = ox + p[0] * lado, gy = oy + p[1] * lado;
        return {
          x0: b[0] * W + (Math.random() - 0.5) * W * 0.3,
          y0: b[1] * H + (Math.random() - 0.5) * H * 0.3,
          x1: gx, y1: gy,
          cx: (b[0] * W + gx) / 2 + (Math.random() - 0.5) * W * 0.55,
          cy: (b[1] * H + gy) / 2 + (Math.random() - 0.5) * H * 0.6,
          r: lado * (0.022 + Math.random() * 0.012),
          col: `rgba(${b[2][0]},${b[2][1]},${b[2][2]},`,
          t0: Math.pow(Math.random(), 0.7) * 1300,    // siembra dispersa pero compacta
          dur: 750 + Math.random() * 1500,
          // coordenadas normalizadas dentro de la D: alimentan el campo de deformación
          nx: p[0], ny: p[1],
          // desfase propio para que no lata todo al unísono
          fase: Math.random() * 6.283,
          respF: 0.0008 + Math.random() * 0.0012,
          // --- explosión y flote: ninguna gota desaparece ---
          s: k / total,
          eAng: Math.atan2(p[1] - 0.5, p[0] - 0.5) + (Math.random() - 0.5) * 1.1,
          eKick: lado * (0.25 + Math.random() * 0.9),     // impulso del estallido
          eGiro: (Math.random() - 0.5) * 0.02,
          // centro de la órbita donde queda flotando (algunas, fuera de cuadro)
          fx: W * (-0.08 + Math.random() * 1.16),
          fy: H * (-0.05 + Math.random() * 1.1),
          fr: 18 + Math.random() * 58,
          fw: 0.00028 + Math.random() * 0.0006,
          // retardo en la reagrupación: las gotas llegan en cadena
          rd: Math.random(),
          // posición en la cola de la estela y dispersión lateral propia
          cola: Math.pow(k / total, 0.85),
          // turno de dibujo: ángulo polar desde el centro, arrancando arriba
          pin: ((Math.atan2(p[1] - 0.5, p[0] - 0.5) + Math.PI * 2.5) % (Math.PI * 2)) / (Math.PI * 2),
          lat: (Math.random() - 0.5) * 2,
        };
      });
      // modo profundidad: cada gota toma un destino en el estallido
      // 0 = atraviesa el monitor hacia el espectador · 1 = se sale de cuadro · 2 = se suma a la estela
      let nz = 0;
      for (const g of gotas) {
        const r = Math.random();
        g.rol = r < 0.28 ? 0 : r < 0.52 ? 1 : 2;
        if (g.rol === 2) g.cz = nz++;
        g.zk = 1.3 + Math.random() * 1.5;          // cuánto se acerca al espectador
        g.zsp = 0.8 + Math.random() * 0.8;         // rapidez propia del acercamiento
      }
      for (const g of gotas) if (g.rol === 2) g.cz = nz > 1 ? g.cz / (nz - 1) : 0;
      if (modoJ) {
        const N = gotas.length, cols = Math.ceil(Math.sqrt(N * (W / H))), filas = Math.ceil(N / cols);
        const orden = gotas.map((_, i) => i);
        for (let i = orden.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = orden[i]; orden[i] = orden[j]; orden[j] = t; }
        gotas.forEach((g, i) => {
          const c = orden[i] % cols, f = (orden[i] / cols) | 0;
          g.jx = 0.03 + ((c + 0.5 + (Math.random() - 0.5) * 0.7) / cols) * 0.94;
          g.jy = 0.05 + ((f + 0.5 + (Math.random() - 0.5) * 0.7) / filas) * 0.9;
          g.jz = Math.random();                 // su lugar en la estela
          g.ord = Math.random();                // cuándo se suma a la estela
        });
      }
      tLleg = Math.max(...gotas.map((g) => g.t0 + g.dur));
    };
    construir();
    addEventListener('resize', () => { medir(); construir(); });

    const easeOut = (u) => 1 - Math.pow(1 - u, 3);
    let inicio = performance.now(), visible = true, raf = 0, ultimo = 0;
    const MS = 1000 / 20;        // 20 fps: el líquido se lee igual, un tercio del coste
    new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }, { threshold: 0 }).observe(host);

    function frame(now) {
      raf = visible ? requestAnimationFrame(frame) : 0;
      if (now - ultimo < MS) return;
      ultimo = now;
      pintar(now);
    }

    // órbita de flote: la gota nunca desaparece, sigue vagando por la pantalla
    const flote = (g, tt) => ({
      x: g.fx + Math.cos(tt * g.fw + g.fase) * g.fr,
      y: g.fy + Math.sin(tt * g.fw * 1.27 + g.fase * 1.4) * g.fr * 0.8,
    });
    const easeInOut = (v) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);

    function pintar(now) {
      const abs = now - inicio;
      // primera vez: los chorros. Después, ciclo formada → explosión/flote → estela
      const primera = abs < tLleg;
      const CIC = modoJ ? J_CICLO : modoZ ? Z_CICLO : CICLO;
      const tc = primera ? abs : (abs - tLleg) % CIC;
      if ((modoZ || modoJ) && !primera && abs - tLleg >= CIC) { inicio = now; return; }
      const t = abs;
      // 0 = masa fusionada · 1 = gotas aisladas flotando
      let disp = 0;
      let zAlpha = 1;
      if (modoZ && !primera) {
        const p = tc;
        if (p < FORMADA) disp = 0;
        else if (p < FORMADA + Z_DISP) disp = Math.min(1, (p - FORMADA) / (Z_DISP * 0.5));
        else disp = 1;
        if (p >= FORMADA + Z_DISP + Z_NAV) {
          const f = (p - FORMADA - Z_DISP - Z_NAV) / Z_FUGA;
          zAlpha = Math.max(0, 1 - f * 1.15);       // se escapan del monitor
        }
        if (p >= FORMADA + Z_DISP + Z_NAV + Z_FUGA) zAlpha = 0;   // pantalla en blanco
      }
      if (modoJ && !primera) {
        const p = tc;
        if (p < FORMADA) disp = 0;
        else if (p < FORMADA + J_DISP) disp = Math.min(1, (p - FORMADA) / (J_DISP * 0.55));
        else if (p < FORMADA + J_DISP + J_NAV) {
          disp = 1 - 0.55 * Math.min(1, (p - FORMADA - J_DISP) / (J_NAV * 0.3));
        } else disp = 0.55;
        // no se desvanecen: salen del cuadro por su propio movimiento
        if (p >= FORMADA + J_DISP + J_NAV + J_SAL) zAlpha = 0;
      } else if (primera) disp = Math.max(0, 1 - tc / tLleg);
      else if (tc < FORMADA) disp = 0;
      else if (tc < FORMADA + EXPLO) disp = Math.min(1, (tc - FORMADA) / (EXPLO * 0.45));
      else disp = Math.max(0, 1 - (tc - FORMADA - EXPLO) / (REAGR * 0.85));
      bctx.clearRect(0, 0, W, H);
      const brillos = [];
      for (const g of gotas) {
        let px, py, ang = 0, estira = 1, asent = false, rMul = 1;

        if (primera) {
          // --- chorros iniciales desde las boquillas ---
          const u = Math.max(0, Math.min(1, (tc - g.t0) / g.dur));
          if (u <= 0) continue;
          const e = easeOut(u), m = 1 - e;
          px = m * m * g.x0 + 2 * m * e * g.cx + e * e * g.x1;
          py = m * m * g.y0 + 2 * m * e * g.cy + e * e * g.y1;
          asent = u === 1;
          estira = 1 + (1 - e) * 3.2;
          ang = Math.atan2(2 * m * (g.cy - g.y0) + 2 * e * (g.y1 - g.cy),
                           2 * m * (g.cx - g.x0) + 2 * e * (g.x1 - g.cx));
          if (u < 1) brillos.push([px, py, g.r, ang]);
        } else if (tc < FORMADA) {
          asent = true;
          px = g.x1; py = g.y1;
        } else if (modoJ) {
          if (zAlpha === 0) continue;
          const p = tc - FORMADA;
          // recorrido juguetón: lóbulos amplios con una ondulación menor encima
          const ruta = (v) => ({
            x: W * (0.6 + 0.26 * Math.sin(v * 6.283 - 1.3) + 0.08 * Math.sin(v * 16.4 + 2.1)),
            y: H * (0.5 + 0.3 * Math.sin(v * 9.1 - 0.7) + 0.1 * Math.cos(v * 19.2)),
          });
          let z = 1;
          if (p < J_DISP) {
            // rompe la D y queda suelta por la pantalla, con deriva mínima
            const k = easeOut(Math.min(1, p / (J_DISP * 0.72)));
            const dx = 0.016 * Math.sin(p * 0.0011 + g.fase);
            const dy = 0.02 * Math.cos(p * 0.0009 + g.fase * 1.4);
            px = g.x1 + ((g.jx + dx) * W - g.x1) * k;
            py = g.y1 + ((g.jy + dy) * H - g.y1) * k;
            ang = g.eAng;
            estira = 1 + (1 - k) * 0.7;
          } else {
            const q = Math.min(1, (p - J_DISP) / J_NAV);
            const sal = Math.max(0, (p - J_DISP - J_NAV) / J_SAL);
            const tau = q * 0.6 + sal * 0.03 - g.jz * 0.19;
            const p0 = ruta(tau), p1 = ruta(tau + 0.004);
            ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            const abre = g.jz * 26 * g.lat;
            const rx = p0.x - Math.sin(ang) * abre;
            const ry = p0.y + Math.cos(ang) * abre;
            const ini = (g.ord || 0) * 0.2;                  // orden aleatorio de incorporación
            const conv = easeInOut(Math.max(0, Math.min(1, (q - ini) / 0.17)));
            px = g.jx * W + (rx - g.jx * W) * conv;
            py = g.jy * H + (ry - g.jy * H) * conv;
            estira = 1 + 1.4 * conv;
            if (sal > 0) {
              // salen por el costado derecho creciendo hasta desaparecer
              // la última gota abandona el cuadro justo al cerrar los 2 s
              z = 1 + sal * sal * 4.6;
              px += W * 1.5 * Math.pow(sal, 2.2);
              py += H * 0.28 * Math.pow(sal, 2.2);
              estira = 1 + sal * 1.6;
            }
          }
          rMul = z;
          if (z > 1.3) brillos.push([px, py, g.r * z, ang]);
        } else if (modoZ) {
          if (zAlpha === 0) continue;
          const p = tc - FORMADA;
          // recorrido de la estela con su propia coordenada Z
          const ruta = (v) => ({
            x: W * (0.5 + 0.62 * Math.sin(v * 6.283 - 1.9)),
            y: H * (0.5 + 0.42 * Math.sin(v * 9.425 - 1.5)),
          });
          let z = 1;
          if (p < Z_DISP) {
            // --- estallido: cada gota según su papel ---
            const q = p / Z_DISP;
            const k = 1 - Math.pow(1 - q, 3);
            if (g.rol === 0) {
              // viene hacia el espectador: crece y se va por fuera del encuadre
              const av = k * g.zsp;
              z = 1 + av * g.zk;
              px = g.x1 + Math.cos(g.eAng) * W * 0.5 * av * av;
              py = g.y1 + Math.sin(g.eAng) * H * 0.5 * av * av;
              ang = g.eAng;
            } else if (g.rol === 1) {
              // se sale de la pantalla en línea recta
              px = g.x1 + Math.cos(g.eAng) * W * 0.95 * k;
              py = g.y1 + Math.sin(g.eAng) * H * 0.95 * k;
              z = 1 - k * 0.35;
              ang = g.eAng;
              estira = 1 + k * 2.6;
            } else {
              // se incorpora a la estela: primero salta, luego converge
              const dst = ruta(-g.cz * 0.26);
              const kick = Math.sin(Math.PI * Math.min(1, q * 2)) * g.eKick * 0.8;
              px = g.x1 + (dst.x - g.x1) * k + Math.cos(g.eAng) * kick;
              py = g.y1 + (dst.y - g.y1) * k + Math.sin(g.eAng) * kick;
              ang = Math.atan2(dst.y - g.y1, dst.x - g.x1);
              estira = 1 + k * 1.8;
            }
            if (q < 0.7) brillos.push([px, py, g.r * z, ang]);
          } else {
            if (g.rol !== 2) continue;               // las otras ya se fueron
            const q = Math.min(1, (p - Z_DISP) / Z_NAV);
            const fuga = Math.max(0, (p - Z_DISP - Z_NAV) / Z_FUGA);
            const tau = q * 1.05 + fuga * 0.22 - g.cz * 0.26;
            const p0 = ruta(tau), p1 = ruta(tau + 0.004);
            ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            // Z: se aleja (pequeña) y luego regresa hacia el espectador
            const aleja = easeInOut(Math.min(1, q / 0.45));
            const cerca = easeInOut(Math.max(0, (q - 0.45) / 0.55));
            z = (1 - aleja * 0.66) + cerca * 0.95 + fuga * 2.4;
            const abre = g.cz * 42 * g.lat * z;
            px = p0.x - Math.sin(ang) * abre;
            py = p0.y + Math.cos(ang) * abre;
            // la perspectiva empuja el trazo hacia fuera al acercarse
            px += (px - W * 0.5) * (z - 1) * 0.22;
            py += (py - H * 0.5) * (z - 1) * 0.22;
            estira = 1 + 2.4 / z;
            if (g.cz < 0.4 || z > 1.6) brillos.push([px, py, g.r * z, ang]);
          }
          rMul = z;
        } else if (modoEstela && tc < FORMADA + EXPLO) {
          // --- ESTELA: la escuadrilla recorre la pantalla en formación ---
          const q = (tc - FORMADA) / EXPLO;
          // la gota va rezagada respecto a la cabeza según su lugar en la cola
          const tau = q * 1.18 - g.cola * 0.3;
          const P = (v) => ({
            x: W * (0.5 + 0.54 * Math.sin(v * 6.283 + 0.5)),
            y: H * (0.5 + 0.44 * Math.sin(v * 12.566 + 0.2)),
          });
          const p0 = P(tau), p1 = P(tau + 0.004);
          ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
          // la cola se abre y se deshace, como una estela de avión
          const abre = g.cola * 46 * g.lat * Math.min(1, q * 2.4);
          const sx = p0.x - Math.sin(ang) * abre;
          const sy = p0.y + Math.cos(ang) * abre;
          // arranque: sale de su sitio en la D y se incorpora a la formación
          const k = Math.min(1, q / 0.16);
          const ek = k * k * (3 - 2 * k);
          px = g.x1 + (sx - g.x1) * ek;
          py = g.y1 + (sy - g.y1) * ek;
          estira = 1 + 3.4 * ek;                       // alargada en su dirección
          rMul = 0.5 + 0.5 * (1 - g.cola);             // afina hacia la cola
          if (g.cola < 0.35) brillos.push([px, py, g.r * rMul, ang]);
        } else if (tc < FORMADA + EXPLO) {
          // --- explosión: sale disparada y acaba flotando en su órbita ---
          const q = (tc - FORMADA) / EXPLO;
          const k = 1 - Math.pow(1 - q, 4);              // frenada progresiva
          const f = flote(g, t);
          const kick = Math.sin(Math.PI * Math.min(1, q * 2.2)) * g.eKick;
          px = g.x1 + (f.x - g.x1) * k + Math.cos(g.eAng) * kick;
          py = g.y1 + (f.y - g.y1) * k + Math.sin(g.eAng) * kick;
          ang = g.eAng + q * g.eGiro * 300;
          rMul = 1;
          if (q < 0.55) brillos.push([px, py, g.r * rMul, ang]);
        } else {
          // --- estela: se reagrupan en cadena y vuelven a formar la D ---
          const r0 = (tc - FORMADA - EXPLO) / REAGR;
          // en la v4 el turno lo marca el recorrido del pincel; en la v3, al azar
          const turno = modoEstela ? g.pin * 0.82 : g.rd * 0.45;
          const rr2 = Math.max(0, Math.min(1, (r0 - turno) / (1 - turno)));
          const k = easeInOut(rr2);
          const f = modoEstela ? {
            x: W * (0.5 + 0.54 * Math.sin((1.18 - g.cola * 0.3) * 6.283 + 0.5)),
            y: H * (0.5 + 0.44 * Math.sin((1.18 - g.cola * 0.3) * 12.566 + 0.2)),
          } : flote(g, t);
          px = f.x + (g.x1 - f.x) * k;
          py = f.y + (g.y1 - f.y) * k;
          ang = Math.atan2(g.y1 - f.y, g.x1 - f.x);
          estira = 1 + (1 - k) * k * 5;                  // estela alargada
          rMul = 1;
          asent = k === 1;
          if (k > 0.02 && k < 0.98) brillos.push([px, py, g.r * rMul, ang]);
        }

        // campo de deformación afín mientras la D está formada
        if (asent) {
          const cxn = g.nx - 0.5, cyn = g.ny - 0.5;
          const sh = Math.sin(t * 0.00045) * 0.055;
          const rot = Math.sin(t * 0.00031 + 1.1) * 0.045;
          px += (cyn * sh - cyn * rot) * ladoD + Math.sin(g.ny * 3.1 + t * 0.0006) * 4.5;
          py += (cxn * sh * 0.7 + cxn * rot) * ladoD + Math.cos(g.nx * 3.4 + t * 0.00052) * 4.5;
        }
        const resp = asent ? 0.95 + 0.1 * Math.sin(t * g.respF + g.fase) : 1;
        const rr = g.r * (asent ? 1.22 * resp : rMul);
        bctx.save();
        bctx.translate(px, py);
        bctx.rotate(ang);
        bctx.fillStyle = '#000';
        bctx.beginPath();
        bctx.ellipse(0, 0, rr * estira, rr / Math.sqrt(estira), 0, 0, 6.2832);
        bctx.fill();
        bctx.restore();
      }
      // 1) umbral: los bordes contiguos se unen en una sola masa continua
      mctx.clearRect(0, 0, W, H);
      mctx.save();
      mctx.filter = modoZ
        ? `blur(${(3.2 - disp * 1.5).toFixed(2)}px) contrast(${(36 - disp * 18).toFixed(1)})`
        : `blur(${(3.5 - disp * 2.4).toFixed(2)}px) contrast(${(36 - disp * 31).toFixed(1)})`;
      mctx.drawImage(buf, 0, 0, W, H);
      mctx.restore();
      // 2) el color de marca se aplica DENTRO de la masa (no se satura)
      mctx.save();
      mctx.globalCompositeOperation = 'source-in';
      mctx.fillStyle = gradColor;
      mctx.fillRect(0, 0, W, H);
      mctx.restore();
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = zAlpha;
      ctx.drawImage(msk, 0, 0, W, H);
      ctx.globalAlpha = 1;
      // reflejo amplio: da volumen a la masa sin granular
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = gradBrillo;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      // reflejo especular en las gotas en vuelo
      for (const [px, py, rr, ang] of brillos) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(ang);
        ctx.globalAlpha = 0.5 * zAlpha;
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath();
        ctx.ellipse(-rr * 0.28, -rr * 0.3, rr * 0.26, rr * 0.17, -0.5, 0, 6.2832);
        ctx.fill();
        ctx.globalAlpha = 0.22 * zAlpha;
        ctx.beginPath();
        ctx.ellipse(rr * 0.22, rr * 0.3, rr * 0.3, rr * 0.14, 0.4, 0, 6.2832);
        ctx.fill();
        ctx.restore();
      }
    }
    if (reduced) { gotas.forEach((g) => { g.t0 = 0; g.dur = 1; }); pintar(performance.now() + 5000); return; }
    raf = requestAnimationFrame(frame);
  };
  img.src = 'assets/iso-color.png';
}

// --- PINCELADA: un solo trazo recorre la pantalla y acaba formando el isotipo
// La ruta es una polilínea: primero atraviesa el hero, luego dibuja la D.
// El pincel avanza con una cola limitada (estela); al entrar en el isotipo la
// cola se congela, así el trazo se acumula hasta cerrar la letra.
function initPincel() {
  const host = document.querySelector('[data-pincel]');
  if (!host) return;
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;' +
    'mask-image:linear-gradient(180deg,transparent 0,transparent 74px,#000 190px);' +
    '-webkit-mask-image:linear-gradient(180deg,transparent 0,transparent 74px,#000 190px)';
  host.textContent = '';
  host.appendChild(cv);
  const ctx = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  let W = 0, H = 0, ruta = [], largo = 0, sIso = 0, wBase = 26;

  // recorrido por la pantalla, en fracciones del hero (sale de cuadro a propósito)
  const VIAJE = [
    [-0.18, 0.16,  0.16, 0.02,  0.34, 0.52,  0.52, 0.56],
    [ 0.52, 0.56,  0.72, 0.62,  0.92, 0.26,  1.10, 0.18],
    [ 1.10, 0.18,  1.26, 0.10,  0.92, -0.12, 0.58, 0.06],
    [ 0.58, 0.06,  0.26, 0.24,  0.02, 0.56,  0.10, 0.88],
    [ 0.10, 0.88,  0.16, 1.14,  0.62, 1.06,  0.82, 0.86],
  ];
  // el isotipo como trazo continuo: asta de abajo a arriba y panza cerrando
  const ISO = [
    [0.26, 0.90,  0.25, 0.62,  0.25, 0.34,  0.26, 0.10],
    [0.26, 0.10,  0.62, 0.09,  0.88, 0.26,  0.87, 0.50],
    [0.87, 0.50,  0.86, 0.75,  0.60, 0.91,  0.26, 0.90],
  ];

  const bez = (c, u, sx, sy, dx, dy) => {
    const m = 1 - u;
    return {
      x: dx + sx * (m * m * m * c[0] + 3 * m * m * u * c[2] + 3 * m * u * u * c[4] + u * u * u * c[6]),
      y: dy + sy * (m * m * m * c[1] + 3 * m * m * u * c[3] + 3 * m * u * u * c[5] + u * u * u * c[7]),
    };
  };

  const medir = () => {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // el isotipo se sitúa en el hueco libre a la derecha del panel de texto
    const pr = document.querySelector('[data-hero-copy]')?.getBoundingClientRect();
    const der = pr ? pr.right - r.left : 0;
    const libre = W - der - 48;
    let lado, ox, oy;
    if (libre > 200) { lado = Math.min(H * 0.66, libre); ox = Math.max(der + 24, W - lado - 34); oy = H * 0.5 - lado / 2; }
    else { lado = Math.min(H * 0.44, W * 0.66); ox = W * 0.5 - lado / 2; oy = H * 0.12; }
    wBase = lado * 0.1;

    // se muestrea la ruta completa en puntos con su distancia acumulada
    ruta = []; largo = 0;
    const push = (p) => {
      if (ruta.length) largo += Math.hypot(p.x - ruta[ruta.length - 1].x, p.y - ruta[ruta.length - 1].y);
      ruta.push({ x: p.x, y: p.y, s: largo });
    };
    const muestrear = (c, sx, sy, dx, dy) => {
      let L = 0, prev = bez(c, 0, sx, sy, dx, dy);
      for (let i = 1; i <= 16; i++) { const q = bez(c, i / 16, sx, sy, dx, dy); L += Math.hypot(q.x - prev.x, q.y - prev.y); prev = q; }
      const N = Math.max(24, Math.ceil(L / 4));       // un punto cada ~4 px
      for (let i = 0; i <= N; i++) push(bez(c, i / N, sx, sy, dx, dy));
    };
    for (const c of VIAJE) muestrear(c, W, H, 0, 0);
    sIso = largo + 0.01;                            // aquí empieza el isotipo
    for (const c of ISO) muestrear(c, lado, lado, ox, oy);
  };
  medir();
  addEventListener('resize', medir);

  // color de marca a lo largo del trazo
  const COL = [[0.0, 165, 54, 146], [0.45, 124, 7, 166], [0.78, 92, 198, 208], [1, 197, 88, 180]];
  const color = (u) => {
    let a = COL[0], b = COL[COL.length - 1];
    for (let i = 0; i < COL.length - 1; i++) if (u >= COL[i][0] && u <= COL[i + 1][0]) { a = COL[i]; b = COL[i + 1]; }
    const k = (u - a[0]) / (b[0] - a[0] || 1);
    return [Math.round(a[1] + (b[1] - a[1]) * k), Math.round(a[2] + (b[2] - a[2]) * k), Math.round(a[3] + (b[3] - a[3]) * k)];
  };

  const TRAZO = 5200, SOSTEN = 2800, SALIDA = 1800;
  const CICLO = TRAZO - SALIDA + SOSTEN + SALIDA;
  const COLA = 0.26;               // longitud de la estela, en fracción del viaje

  let visible = true, raf = 0, ultimo = 0, inicio = performance.now();
  const MS = 1000 / 30;
  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }, { threshold: 0 }).observe(host);

  function frame(now) {
    raf = visible ? requestAnimationFrame(frame) : 0;
    if (now - ultimo < MS) return;
    ultimo = now;
    pintar(now - inicio);
  }

  // avance del pincel para un instante del trazo (0..TRAZO)
  function avance(tt) {
    const p = Math.max(0, Math.min(1, tt / TRAZO));
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const head = e * largo;
    return [Math.min(Math.max(0, head - COLA * sIso), sIso), head];
  }

  function pintar(abs) {
    const t = abs % CICLO;
    const A = TRAZO - SALIDA, B = A + SOSTEN;
    ctx.clearRect(0, 0, W, H);
    if (!ruta.length) return;
    const segs = [];
    if (t < A) {
      segs.push(avance(t + SALIDA));            // el ciclo arranca con el trazo ya en camino
    } else if (t < B) {
      segs.push([sIso, largo]);                 // solo el isotipo, sostenido
    } else {
      const b = (t - B) / SALIDA;
      const e = b * b * (3 - 2 * b);
      segs.push([sIso + (largo - sIso) * e, largo]);   // el isotipo se retira
      segs.push(avance(b * SALIDA));                   // y el nuevo trazo ya entra
    }
    for (const [tail, head] of segs) {
      if (head <= tail) continue;
      for (let i = 0; i < ruta.length; i++) {
        const q = ruta[i];
        if (q.s < tail || q.s > head) continue;
        const enIso = q.s >= sIso;
        const u = enIso ? (q.s - sIso) / (largo - sIso) : (q.s / sIso) * 0.55;
        const dPunta = Math.min(1, (head - q.s) / (wBase * 2.2));
        const dCola = Math.min(1, (q.s - tail) / (wBase * (enIso ? 1.4 : 3.2)));
        const perfil = Math.pow(Math.min(dPunta, dCola), 0.5);
        const grosor = (enIso ? 1 : 0.72) * wBase * (0.42 + 0.58 * perfil);
        if (grosor < 0.6) continue;
        const c = color(u);
        const g = ctx.createRadialGradient(q.x - grosor * 0.32, q.y - grosor * 0.36, grosor * 0.08, q.x, q.y, grosor);
        g.addColorStop(0, `rgb(${Math.min(255, c[0] + 52)},${Math.min(255, c[1] + 46)},${Math.min(255, c[2] + 40)})`);
        g.addColorStop(0.72, `rgb(${c[0]},${c[1]},${c[2]})`);
        g.addColorStop(1, `rgb(${c[0]},${c[1]},${c[2]})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q.x, q.y, grosor, 0, 6.2832);
        ctx.fill();
      }
    }
  }
  if (reduced) { pintar(TRAZO + 400); return; }
  raf = requestAnimationFrame(frame);
}


// --- Entradas de texto: variantes marcadas, una sola vez por elemento --------
// Movimiento fuerte (estilo animate.css) disparado por IntersectionObserver:
// no es scrubbing de scroll, se reproduce completo al entrar en pantalla.
const KEYS_TEXTO = [
  ['dzBackInDown', '0%{opacity:0;transform:translateY(-120%) scale(.7)}30%{opacity:.7}80%{opacity:.7;transform:translateY(0) scale(.7)}100%{opacity:1;transform:scale(1)}'],
  ['dzBackInLeft', '0%{opacity:0;transform:translateX(-140%) scale(.7)}30%{opacity:.7}80%{opacity:.7;transform:translateX(0) scale(.7)}100%{opacity:1;transform:scale(1)}'],
  ['dzBackInRight', '0%{opacity:0;transform:translateX(140%) scale(.7)}30%{opacity:.7}80%{opacity:.7;transform:translateX(0) scale(.7)}100%{opacity:1;transform:scale(1)}'],
  ['dzBackInUp', '0%{opacity:0;transform:translateY(120%) scale(.7)}30%{opacity:.7}80%{opacity:.7;transform:translateY(0) scale(.7)}100%{opacity:1;transform:scale(1)}'],
  ['dzFlipInX', '0%{opacity:0;transform:perspective(600px) rotateX(80deg)}40%{transform:perspective(600px) rotateX(-20deg)}60%{opacity:1;transform:perspective(600px) rotateX(10deg)}100%{transform:none}'],
  ['dzBounceIn', '0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.08)}65%{transform:scale(.95)}100%{transform:none}'],
  ['dzLightSpeed', '0%{opacity:0;transform:translateX(90%) skewX(-24deg)}70%{opacity:1;transform:skewX(12deg)}85%{transform:skewX(-4deg)}100%{transform:none}'],
  ['dzRotateInLeft', '0%{opacity:0;transform-origin:left bottom;transform:rotate(-38deg)}100%{opacity:1;transform-origin:left bottom;transform:none}'],
];

function initTextos() {
  if (reduced) return;
  clearInterval(window.__dzRevelado); window.__dzRevelado = 0;
  if (!document.getElementById('dz-textos-css')) {
    const st = document.createElement('style');
    st.id = 'dz-textos-css';
    st.textContent = [
      ...KEYS_TEXTO.map(([n, k]) => '@keyframes ' + n + '{' + k + '}'),
      // El texto NUNCA depende de JS para ser visible: opacidad base 1.
      // .dz-in solo añade la animación de entrada; si el observador fallara, el copy se lee igual.
      '[data-t]{opacity:1;animation:none!important}',
      '[data-t].dz-in{opacity:1;animation:var(--dzk) var(--dzd,900ms) cubic-bezier(.22,1,.36,1) var(--dzdelay,0ms) both!important;animation-timeline:auto!important}',
    ].join('\n');
    document.head.appendChild(st);
  }
  const TEXTO = 'h2, h3, h4, p, li, blockquote, figcaption, [data-reveal]';
  const nodos = [...document.querySelectorAll(TEXTO)].filter((el) =>
    !el.closest('[data-hero],[data-pal],nav,header,[data-menu],summary,[data-fab]') &&
    !el.hasAttribute('data-t') && el.textContent.trim());
  nodos.forEach((el, i) => {
    const [nombre] = KEYS_TEXTO[i % KEYS_TEXTO.length];
    el.dataset.t = '1';
    el.style.setProperty('--dzk', nombre);
    el.style.setProperty('--dzd', 820 + (i % 4) * 90 + 'ms');
    el.style.setProperty('--dzdelay', (i % 3) * 90 + 'ms');
  });

  // Revelado propio: consulta el DOM en cada pase (no una lista cacheada), así los
  // nodos remontados por un re-render también se animan en vez de quedarse ocultos.
  const revisar = () => {
    document.querySelectorAll('[data-t]:not(.dz-in)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92 && r.bottom > 0) el.classList.add('dz-in');
    });
  };
  let esperando = false;
  const pedir = () => { if (esperando) return; esperando = true; requestAnimationFrame(() => { esperando = false; revisar(); }); };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir, { passive: true });
  revisar();
  window.__dzRevelado = setInterval(revisar, 500);
}

export function initSite() {
  initTextos();
  initPincel();
  initChorros();
  initOrbes();
  initTransicion();
  initCounters();
  initNavbar();
  initMenu();
  initDropdown();
  initHeroVideo();
  initTrazo();
  initFab();
  initAnchors();
  initParallax();
}
export { reduced, saveData, isMobile, observe, EASE };
