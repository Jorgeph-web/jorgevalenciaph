// Capa de animación compartida. Todo es aditivo: nada aquí oculta contenido,
// así que si el script falla la página se ve igual, solo sin estos efectos.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Encabezado compacto al bajar
  var bar = document.querySelector('header.bar');
  if (bar) {
    var marcar = function () { bar.classList.toggle('mo-scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', marcar, { passive: true });
    marcar();
  }

  // Foco de luz que sigue al cursor sobre planes, testimonios y pasos
  if (window.matchMedia('(hover: hover)').matches) {
    var pendiente = null;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.plan, .tcard, .proc .step');
      if (!el) return;
      if (pendiente) cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(function () {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }, { passive: true });
  }

  // Las cifras cuentan desde cero al entrar en pantalla.
  // El número final ya está en el HTML: si esto no corre, se ve el valor correcto.
  var cifras = document.querySelectorAll('.stats .num');
  if (cifras.length && 'IntersectionObserver' in window) {
    var contar = function (el) {
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      var fin = parseInt(m[1], 10), sufijo = m[2], t0 = null, dur = 1400;
      var paso = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))) + sufijo;
        if (p < 1) requestAnimationFrame(paso); else el.textContent = fin + sufijo;
      };
      requestAnimationFrame(paso);
    };
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        contar(e.target);
      });
    }, { threshold: .6 });
    cifras.forEach(function (el) { obs.observe(el); });
  }
})();
