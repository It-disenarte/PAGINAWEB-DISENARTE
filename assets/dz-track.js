/* ============================================================
   DISEÑARTE MÉXICO — Capa de medición
   Eventos de contacto, captura de UTM/gclid y profundidad de scroll.
   Se carga con defer desde el <head> de cada página.

   Cuentas conectadas:
     GA4        G-H2JJVE75F3
     Google Ads AW-16751651845
     Meta Pixel 2039038839979376

   Etiquetas de conversión activas (creadas el 26-ago-2026):
      Clic WhatsApp  -> 4ZORCN2At-gcEIXY57M-
      Clic Teléfono  -> tg2FCOCAt-gcEIXY57M-
      Formulario     -> iFHhCOKqtugcEIXY57M-  (vive en gracias.html)
   ============================================================ */
(function () {
  'use strict';

  var AW_ID = 'AW-16751651845';
  var AW_LABEL_WHATSAPP = '4ZORCN2At-gcEIXY57M-';
  var AW_LABEL_TELEFONO = 'tg2FCOCAt-gcEIXY57M-';

  /* ---------- utilidades ---------- */
  function ga(nombre, params) {
    if (typeof window.gtag === 'function') window.gtag('event', nombre, params || {});
  }
  function meta(nombre, params) {
    if (typeof window.fbq === 'function') window.fbq('track', nombre, params || {});
  }
  function adsConversion(label) {
    if (!label || label.indexOf('REEMPLAZAR') === 0) return;
    if (typeof window.gtag === 'function') {
      /* transport_type 'beacon' usa navigator.sendBeacon: la petición sobrevive
         a que el navegador abandone la página. Sin esto, el clic en WhatsApp o
         en tel: puede cancelar el envío antes de que llegue a Google. */
      window.gtag('event', 'conversion', {
        send_to: AW_ID + '/' + label,
        transport_type: 'beacon'
      });
    }
  }
  function pagina() {
    return location.pathname === '/' ? 'inicio' : location.pathname.replace(/^\//, '');
  }

  /* ---------- 1. Captura y persistencia de origen ---------- */
  var CLAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'wbraid', 'gbraid'];

  function guardarOrigen() {
    try {
      var qs = new URLSearchParams(location.search);
      var encontrado = false;
      var datos = {};
      CLAVES.forEach(function (k) {
        var v = qs.get(k);
        if (v) { datos[k] = v; encontrado = true; }
      });
      if (encontrado) {
        datos.landing = location.pathname;
        datos.fecha = new Date().toISOString();
        sessionStorage.setItem('dz_origen', JSON.stringify(datos));
        if (!localStorage.getItem('dz_origen_primero')) {
          localStorage.setItem('dz_origen_primero', JSON.stringify(datos));
        }
      }
    } catch (e) { /* almacenamiento bloqueado */ }
  }

  function leerOrigen() {
    try {
      return JSON.parse(sessionStorage.getItem('dz_origen') || '{}');
    } catch (e) { return {}; }
  }

  /* Adjunta el origen al mensaje precargado de WhatsApp,
     para que ventas sepa de qué campaña vino el lead. */
  function etiquetarWhatsApp(a) {
    try {
      var o = leerOrigen();
      if (!o.utm_source && !o.gclid) return;
      var url = new URL(a.href);
      var texto = url.searchParams.get('text') || 'Hola, vengo de su página web';
      var marca = o.gclid ? 'Google Ads' : (o.utm_source + (o.utm_campaign ? ' / ' + o.utm_campaign : ''));
      if (texto.indexOf('[ref:') === -1) {
        url.searchParams.set('text', texto + ' [ref: ' + marca + ']');
        a.href = url.toString();
      }
    } catch (e) { /* href no parseable */ }
  }

  /* ---------- 2. Eventos de contacto ---------- */
  function manejarClic(e) {
    var a = e.target.closest ? e.target.closest('a[data-track]') : null;
    if (!a) return;

    var tipo = a.getAttribute('data-track');
    var ubicacion = a.getAttribute('data-ubicacion') || pagina();
    var origen = leerOrigen();
    var base = {
      ubicacion_boton: ubicacion,
      origen_pagina: pagina(),
      campana: origen.utm_campaign || '(directo)'
    };

    if (tipo === 'whatsapp') {
      etiquetarWhatsApp(a);
      ga('click_whatsapp', base);
      ga('generate_lead', base);
      meta('Contact', { content_name: 'whatsapp_' + ubicacion });
      adsConversion(AW_LABEL_WHATSAPP);
    } else if (tipo === 'telefono') {
      ga('click_telefono', base);
      ga('generate_lead', base);
      meta('Contact', { content_name: 'telefono_' + ubicacion });
      adsConversion(AW_LABEL_TELEFONO);
    } else if (tipo === 'email') {
      ga('click_email', base);
      meta('Contact', { content_name: 'email_' + ubicacion });
    }
  }

  /* ---------- 3. Profundidad de scroll ---------- */
  function medirScroll() {
    var marcas = [50, 90];
    var vistas = {};
    function revisar() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      if (alto <= 0) return;
      var pct = Math.round((window.scrollY / alto) * 100);
      marcas.forEach(function (m) {
        if (pct >= m && !vistas[m]) {
          vistas[m] = true;
          ga('scroll_' + m, { origen_pagina: pagina() });
        }
      });
    }
    window.addEventListener('scroll', revisar, { passive: true });
  }

  /* ---------- 4. Tiempo de permanencia útil ---------- */
  function medirPermanencia() {
    var disparado = false;
    setTimeout(function () {
      if (!disparado) { disparado = true; ga('visita_calificada', { origen_pagina: pagina() }); }
    }, 30000);
  }


  /* ---------- 5. Pasar el origen al formulario de Bigin ----------
     El formulario vive en un iframe de otro dominio (us.bigin.online),
     así que el navegador impide leer su envío desde aquí. Lo único que
     sí podemos hacer es inyectarle el origen por query string para que
     el lead llegue a Bigin con su campaña identificada.

     ⚠️ REQUISITO EN BIGIN: el formulario debe tener campos ocultos
        llamados exactamente utm_source, utm_medium, utm_campaign y gclid.
        Sin esos campos, los parámetros se ignoran. */
  function alimentarFormulario() {
    var marco = document.querySelector('iframe[src*="bigin.online"]');
    if (!marco) return;
    var o = leerOrigen();
    if (!o.utm_source && !o.gclid) return;
    try {
      var url = new URL(marco.src);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid']
        .forEach(function (k) { if (o[k]) url.searchParams.set(k, o[k]); });
      url.searchParams.set('pagina_origen', o.landing || '/');
      if (marco.src !== url.toString()) marco.src = url.toString();
    } catch (e) { /* src no parseable */ }
  }

  /* ---------- arranque ---------- */
  function iniciar() {
    guardarOrigen();
    document.addEventListener('click', manejarClic, true);
    medirScroll();
    medirPermanencia();
    alimentarFormulario();
    ga('page_view_dz', { origen_pagina: pagina() });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();