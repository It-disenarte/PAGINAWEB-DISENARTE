repo: It-disenarte/webDisenarte
branch: main

## Last sync
date: 2026-08-24T22:04:00Z

### Updated in this project
- Se extrajeron y agregaron a las 7 páginas las etiquetas de tracking del sitio anterior (Astro): Google Analytics 4 (G-H2JJVE75F3), Google Ads (AW-16751651845) y Meta Pixel (2039038839979376), incluyendo el pixel de conversión de WhatsApp.
- No se encontró etiqueta de verificación de Google Search Console en el código (`src/layouts/Layout.astro`); si la propiedad está verificada por otro método (DNS, GA), no requiere acción.
- Este proyecto no reconstruye el sitio del repo; solo se usó como fuente de las etiquetas de analítica/marketing a preservar en la migración de dominio.

## Screen map
| Página nueva | Fuente en el repo |
|---|---|
| inicio.dc.html, contacto.dc.html, innovacion-digital.dc.html, nosotros.dc.html, paginas-web.dc.html, publicidad.dc.html, aviso-privacidad.dc.html | src/layouts/Layout.astro (etiquetas GA4/Ads/Meta Pixel), src/components/WhatsAppFloater.astro (evento de conversión) |
