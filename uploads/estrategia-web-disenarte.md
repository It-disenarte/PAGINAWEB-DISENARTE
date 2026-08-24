# ESTRATEGIA WEB — DISEÑARTE MÉXICO
### Framework F.R.A.M.E. · Entregable 100% texto, editable, para llevar después a Claude Design
**Versión 1.0 · 14 de agosto de 2026**

> Cómo leer este documento: todo es editable. Tacha, cambia y reordena lo que quieras **antes** de pegar la sección 6 en Claude Design.
> Lo que completé por criterio propio va marcado como `[supuesto: ...]`.
> Lo que solo tú puedes darme va marcado como `[PENDIENTE: ...]` y está listado junto al final.

---

## 0. DECISIONES CLAVE (léelas primero, son las que cambian todo)

**0.1 — El sitio es multipágina, no una landing larga.**
Tienes dos negocios con dos compradores distintos (gerente de planta / dueño de pyme) y quieres posicionar en Google por cosas muy diferentes ("señalética industrial Querétaro" vs "renta de páginas web"). Una sola página no puede rankear por ambas. Estructura: **6 URLs**.

**0.2 — Un solo formulario en todo el sitio, en `/contacto`.**
Tal como lo pediste. Todos los CTAs de todas las páginas apuntan al mismo formulario, pero pasando un parámetro que preselecciona el interés (`/contacto?interes=pagina-web`). Un solo endpoint, un solo lugar donde dar mantenimiento, cero formularios compitiendo entre sí.

**0.3 — El sitio tiene dos "temperaturas", no dos diseños.**
Mismos tokens, mismo sistema, dos modos:
- **Modo Noche** (fondo tinta profunda): Inicio, Innovación Digital, Páginas Web, Contacto. Es donde el magenta y el cian *brillan* y donde se vende el "wow".
- **Modo Taller** (fondo claro): Publicidad y Nosotros. Fondo claro = las fotos de señalética, tableros y flotillas se leen; el comprador industrial necesita claridad, no espectáculo.
La transición entre modos ocurre en el corte diagonal (ver 1.6). Es una decisión de posicionamiento: *tu área de publicidad vende confianza, tu área digital vende capacidad*.

**0.4 — El único conflicto real de tu brief, dicho de frente.**
Pediste "muchísimas animaciones" **y** "SEO bastante optimizado". Esas dos cosas se pelean: cada librería 3D, cada video pesado y cada efecto de scroll castiga Core Web Vitals, que es exactamente lo que Google mide. La forma de tener las dos es esta regla dura, que va incrustada en el prompt de Claude Design:
- Animar **solo** con `transform` y `opacity`. Nada de animar `width`, `top`, `box-shadow` o `filter` en scroll.
- El 3D del carrusel es **CSS puro** (`perspective` + `rotateY` + `translateZ`). Cero Three.js, cero WebGL. Pesa ~0 KB y se ve igual de bueno.
- Todo el movimiento entra por `IntersectionObserver`, una sola vez, y se desconecta.
- El video del hero: `poster`, `preload="none"` fuera del viewport, sin audio, comprimido, y **fallback a imagen estática** si `prefers-reduced-motion` o si la conexión es lenta.
Con eso puedes tener un sitio muy vivo y aun así 90+ en PageSpeed. Sin eso, tendrás uno de los dos, no los dos.

**0.5 — Discrepancia de contacto que hay que resolver antes de publicar.**
El catálogo dice `ventas@rotulosdisenarte.com` y el dominio es `disenartemx.com`. Dos marcas distintas frente al cliente. Recomendación: unificar todo en `ventas@disenartemx.com` y dejar el viejo como alias que reenvía. `[PENDIENTE: confirmar correo oficial]`

**0.6 — Los servicios pequeños no desaparecen, se agrupan.**
Flyers, lonas, acrílicos sueltos: no llevan sección propia. Van en un bloque compacto "También hacemos" al final de Publicidad, con enlaces internos (bueno para SEO long-tail) pero sin robarle protagonismo a señalética, tableros y flotillas, que es donde está el ticket alto.

---

## 1. BRAND IDENTITY

### 1.1 Nombre y descriptor
**Diseñarte México®** — descriptor web: *Agencia de publicidad e innovación digital · San Juan del Río, Qro.*
(El descriptor cambia respecto al catálogo: "marketing digital" → "innovación digital", como ya definiste.)

### 1.2 Positioning (una línea)
> **20 años haciendo visible lo que las empresas quieren decir — en su planta y en su pantalla.**

Esa frase hace tres cosas: ancla la antigüedad (barrera de entrada contra el freelance barato), une las dos áreas bajo una sola idea (comunicación visual) y no promete "creatividad" genérica.

### 1.3 Voice & tone
**Directo · Técnico sin ser frío · Seguro · Concreto · Cero relleno.**

| Así hablamos | Así NO hablamos |
|---|---|
| "Instalamos señalética bajo NOM-026-STPS. Garantía de 2 años en rotulación." | "Somos un equipo apasionado que transforma ideas en experiencias memorables." |
| "Tu página lista en 3 semanas, o te devolvemos el anticipo." | "Impulsamos tu marca al siguiente nivel del ecosistema digital." |
| "Renta desde $X al mes. Sin invertir de golpe." | "Soluciones a la medida de tus necesidades." |

Regla de escritura: **cada afirmación trae un número, una norma o un plazo.** Si no lo trae, se borra.

### 1.4 Paleta (hex exactos + rol)

| Token | Hex | Rol |
|---|---|---|
| `--tinta` | `#0E0714` | Fondo base Modo Noche. Casi negro con tinte violeta — hace que el magenta se sienta encendido, no plano. |
| `--tinta-2` | `#1A0F24` | Superficies elevadas sobre tinta (cards, navbar sólida, acordeones). |
| `--magenta` | `#A53692` | **Primario de marca.** Botones primarios, subrayados, el símbolo. |
| `--violeta` | `#7C07A6` | Secundario del manual. Profundidad en gradientes, fondos de sección, cortes diagonales. |
| `--cian` | `#5CC6D0` | **Acento.** Líneas, datos, iconos, hover, badges. Solo sobre fondo oscuro. |
| `--papel` | `#F2F1F3` | Fondo base Modo Taller. El gris papel del manual, no blanco puro. |
| `--blanco` | `#FFFFFF` | Cards en Modo Taller, texto sobre tinta. |
| `--gris` | `#96989A` | Gris corporativo. **Solo para divisores, bordes y texto ≥24px.** |
| `--gris-texto` | `#55575A` | Texto secundario sobre fondo claro. *(Ver aviso abajo.)* |
| `--gradiente-firma` | `linear-gradient(100deg, #7C07A6 0%, #A53692 45%, #5CC6D0 100%)` | El trazo, bordes de la card recomendada, subrayado del H1. |

**Aviso de contraste — esto no es opcional, es lo que hace que el sitio pase accesibilidad y no lo penalice Google:**
- `#96989A` sobre blanco da **2.9:1** → *reprueba* AA para texto corrido. Por eso existe `--gris-texto` `#55575A` (7.0:1). El gris corporativo se queda para líneas y titulares grandes.
- `#5CC6D0` sobre blanco da **2.0:1** → *reprueba*. El cian **nunca** lleva texto blanco encima ni va como texto sobre fondo claro. Sobre `--tinta` da **9.3:1**, ahí es donde vive.
- `#A53692` con texto blanco encima da **6.0:1** → *aprueba*. Es el color seguro para botones primarios.

### 1.5 Tipografía

**Display: Creato Display** (Light / Bold / Black) — la del manual.
⚠️ Creato Display es de licencia comercial y **la licencia de escritorio no cubre uso web**. Dos caminos:
- **A (recomendado):** comprar la licencia webfont, autohospedar `.woff2` solo en los pesos 300/700/900, con `font-display: swap`.
- **B (fallback si no hay licencia):** **Outfit** (Google Fonts) — geométrica, misma familia de sensación, terminales rectas, gratuita. Es el sustituto más cercano que existe.
`[supuesto: arrancas con Outfit y sustituyes por Creato cuando compres la licencia — el sitio debe declarar la familia en una sola variable CSS para que el cambio sea de una línea]`

**Texto: Inter** (400 / 500 / 600) — neutra, altísima legibilidad en tablas de materiales y specs técnicas, gratis, subset latino ligero.

**Walkway Bold/UltraBold:** se reserva para el logo y piezas impresas. En web no la uses para texto corrido — su altura de x es baja y en pantalla pequeña se pierde.

**Escala tipográfica (base 16px, ratio 1.25 en mobile / 1.333 en desktop):**

| Rol | Desktop | Mobile | Familia / peso |
|---|---|---|---|
| Display (hero) | 72–88px, `line-height: 0.95`, `letter-spacing: -0.03em` | 40px | Display 900 |
| H1 | 56px | 34px | Display 700 |
| H2 | 40px | 28px | Display 700 |
| H3 | 26px | 21px | Display 700 |
| Body L | 20px / 1.6 | 18px | Inter 400 |
| Body | 17px / 1.65 | 16px | Inter 400 |
| Caption / eyebrow | 13px, `letter-spacing: .16em`, MAYÚSCULAS | 12px | Inter 600 |
| Dato / número | 64px, tabular-nums | 40px | Display 900 |

### 1.6 Estética general

Toma el gesto que ya existe en tu catálogo —**el corte diagonal violeta** de la esquina— y conviértelo en el sistema. Cada cambio de sección es un corte diagonal a 6°, no una línea horizontal. El resultado se siente como una plantilla de corte de vinil: la página está *rotulada*, no maquetada. Eso es lo que ninguna agencia genérica puede copiarte, porque nace de tu oficio.

Las tarjetas heredan la forma del isotipo: rectángulo redondeado con **radio 28px en tres esquinas y 6px en la superior izquierda**. Es sutil, se repite 40 veces en el sitio, y hace que todo se sienta de la misma familia sin que nadie sepa por qué.

Fotografía: producto instalado, en planta, con gente. Nada de stock de "equipo sonriendo frente a laptop". Tus fotos reales de tableros y flotillas valen más que cualquier render. Tratamiento: contraste medio-alto, sombras con tinte violeta (no gris), sin filtros de color encima.

### 1.7 Signature — "El trazo"

**El elemento que hace memorable el sitio.** Una línea SVG continua con el gradiente firma que recorre la página **de arriba a abajo**, entrando y saliendo entre secciones, y que **se dibuja conforme haces scroll** (`stroke-dashoffset` ligado al progreso). Literalmente: la página se va *diseñando* mientras la lees. Es el nombre de la marca vuelto interacción.

Por qué funciona y no es decoración: encarna "Diseñ-arte", cuesta ~4 KB, es un solo elemento en el DOM, y en `prefers-reduced-motion` se queda dibujado completo desde el inicio sin perder nada. En mobile se reduce a un trazo vertical delgado en el borde izquierdo.

**Nace en el hero.** El trazo es la estela de la bolita saliéndose del canal: entra por el borde inferior del hero alineado a la derecha y sigue bajando por la página. Esa continuidad es la razón por la que la línea existe.

**Regla de restricción:** el trazo es *la* apuesta visual. Todo lo demás alrededor se mantiene disciplinado: sin partículas, sin glassmorphism, sin objetos flotantes, sin gradientes animados de fondo. Un solo gesto fuerte se recuerda; diez se leen como plantilla de IA.

### 1.8 Keyword map (SEO)

**Keyword principal del sitio:** `agencia de publicidad en San Juan del Río`
**Intención dominante:** transaccional-local.

| Página | Keyword principal | Secundarias / semánticas |
|---|---|---|
| `/` | agencia de publicidad en San Juan del Río | agencia de publicidad Querétaro · publicidad industrial · comunicación visual empresas · rotulación Querétaro |
| `/publicidad` | señalética industrial Querétaro | letreros NOM-026-STPS · etiquetado de tuberías · tableros de seguridad industrial · rotulación de flotillas · SGA NOM-018-STPS · películas de seguridad · grabado láser acrílico |
| `/innovacion-digital` | innovación digital para empresas | automatización de procesos · marketing industrial · transformación digital pyme Querétaro |
| `/paginas-web` | páginas web para empresas | renta de páginas web · diseño web San Juan del Río · página web autoadministrable · desarrollo web Querétaro · cuánto cuesta una página web |
| `/nosotros` | Diseñarte México | agencia publicidad 20 años Querétaro · proveedor Imbera |
| `/contacto` | contacto Diseñarte México | cotizar señalética industrial · presupuesto página web |

`renta de páginas web` es tu mejor oportunidad: alta intención, competencia baja en México y casi nadie la trabaja bien. Vale la pena que tenga su propio bloque con H2 exacto y su propio FAQ.

---

## 2. ARQUITECTURA DEL SITIO

```
/                        Inicio            — Modo Noche
/nosotros                Nosotros          — Modo Taller
/publicidad              Publicidad        — Modo Taller
/innovacion-digital      Innovación Digital — Modo Noche  (hub del área)
/paginas-web             Páginas Web       — Modo Noche  (la estrella)
/contacto                Contacto          — Modo Noche  (el único formulario)
```

**Navbar:** Inicio · Nosotros · Publicidad · Innovación Digital ▾ (dropdown: Páginas web · Otros servicios) · **[Cotizar]** (botón primario → `/contacto`)

**Fase 2 (no ahora, pero deja la estructura lista):** subpáginas de `/publicidad` por servicio (`/publicidad/senaletica-industrial`, `/publicidad/rotulacion-de-flotillas`, `/publicidad/tableros`). Cada una rankea sola. Es el mayor crecimiento orgánico disponible, pero solo tiene sentido cuando el sitio base ya esté publicado.

---

## 3. COPY COMPLETO, PÁGINA POR PÁGINA

> Instrucción para Claude Design: **usar este copy tal cual. Nada de lorem ipsum, nada de reescribir.**

---
### 3.1 — INICIO `/`

**HERO** *(Modo Noche · video 3D de la D en loop perfecto, de fondo)*
- Eyebrow: `SAN JUAN DEL RÍO, QRO. · DESDE 2005`
- **H1:** `Diseño, publicidad e innovación digital para empresas que quieren verse en serio`
- Subtexto: `Señalética, tableros y rotulación que se instalan en tu planta. Páginas web y automatizaciones que trabajan mientras duermes. Una sola agencia, 20 años de oficio.`
- CTA primario: **`Cotizar mi proyecto`** → `/contacto`
- CTA secundario (ghost): **`Ver lo que hacemos`** → ancla `#areas`

**BARRA DE CONFIANZA** *(justo debajo del hero, sin scroll)*
`+20 años` · `1er lugar como proveedor destacado Imbera México 2023 y 2024` · `NOM-026-STPS · NOM-018-STPS` · `Garantía de 2 años en rotulación`

**PROBLEMA** *(2–3 líneas editoriales, centrado, mucho aire)*
> **H2:** `Tu empresa ya dice algo. La pregunta es si dice lo correcto.`
> Un letrero mal hecho comunica descuido. Una página web de plantilla comunica que eres uno más. Y en ambos casos el que decide si te compra ya lo notó, aunque no te lo diga.

**LAS DOS ÁREAS** *(id `#areas` — dos bloques grandes, no tarjetitas)*
> **H2:** `Dos áreas, un mismo oficio: hacer visible lo importante`

**Publicidad**
`Diseñamos, fabricamos e instalamos. Señalética industrial bajo norma, tableros de seguridad y KPIs, rotulación de flotillas, impresión de gran formato y campañas de seguridad para piso de planta.`
→ **`Ver publicidad`** → `/publicidad`

**Innovación digital**
`Páginas web que venden, automatizaciones que quitan trabajo manual y herramientas digitales hechas a la medida de cómo opera tu empresa. No manejamos "presencia": construimos activos.`
→ **`Ver innovación digital`** → `/innovacion-digital`

**POR QUÉ DISEÑARTE** *(9 puntos del catálogo, grid 3×3, reveal escalonado)*
> **H2:** `Por qué las plantas de la región nos vuelven a llamar`

1. **Un equipo, no un intermediario.** Profesionales que lideran tu proyecto de principio a fin.
2. **Urgencias resueltas.** Tenemos capacidad de producción para proyectos de extrema urgencia.
3. **Precio-calidad real.** Ni el más barato ni el más caro: el que sí entrega.
4. **Contacto directo.** Hablas con tu agente de ventas, no con un buzón.
5. **Aliado, no proveedor.** Nos quedamos en las cuentas por años, no por orden de compra.
6. **Plazos cortos.** Y respuesta rápida cuando hay que resolver un detalle.
7. **Diseño incluido.** Te llegan propuestas, no solo un presupuesto.
8. **Atención al detalle.** En cada pieza que sale de producción.
9. **Garantía por escrito.** En cada entrega.

**CASO / TRABAJO** *(3 proyectos, carrusel horizontal)*
> **H2:** `Trabajo reciente`
`[PENDIENTE: 3 proyectos con foto, cliente, qué se hizo y un dato de resultado. Ejemplo del formato: "Vibracoustic, El Marqués — Branding de recepción, pasillo y comedor. 3 zonas, 17 partidas, instalado en X días."]`

**CTA FINAL**
> **H2:** `Cuéntanos qué necesitas`
> `Cotizamos en menos de 24 horas hábiles. Si es urgente, dilo en el mensaje: tenemos plan para eso.`
> **`Pedir cotización`** → `/contacto` · **`Escribir por WhatsApp`** → wa.me

---
### 3.2 — PUBLICIDAD `/publicidad`

*(Modo Taller · fondo `--papel`)*

- Eyebrow: `ÁREA DE PUBLICIDAD`
- **H1:** `Señalética industrial, tableros y rotulación en Querétaro`
- Subtexto: `Trabajamos bajo la Norma Oficial Mexicana NOM-026-STPS-2011 y damos soporte en la implementación del SGA (NOM-018-STPS). Diseñamos, fabricamos e instalamos.`
- CTA: **`Cotizar señalética`** → `/contacto?interes=publicidad`

**H2 · Señalética industrial**
`Gran variedad de señalética para distintos rubros, en los materiales y calidades que cada necesidad pide: protección civil, línea industrial y línea transportes.`

*Los 4 tipos de señal (según NOM):*
- **Información u obligación** — guían a la población y dan recomendaciones a observar.
- **Prohibición y equipo contra incendio** — prohíben una acción que puede provocar un riesgo.
- **Preventivos** — advierten de la existencia y naturaleza de un riesgo.
- **Advertencia de peligro** — imponen la ejecución de una acción determinada desde el punto donde se ve la señal.

**H3 · Materiales** *(grid de 7 fichas, hover revela specs)*

| Material | Para qué sirve |
|---|---|
| Vinil calandrado | Colores sólidos. Se adapta a superficies curvas y planas. Interior y exterior. |
| Vinil reflejante | Señalización vial. Resiste intemperie extrema. Se ilumina reflejando la luz. Exterior. |
| Vinil luminiscente | Se carga con luz natural o artificial. 5 h de iluminación. Señalización de emergencia, uso exclusivo interior. |
| Acrílico | Duradero, resistente, acabados detallados. Interior y exterior. |
| Estireno | Resistente, flexible, termoformable. Usos múltiples. Exterior. |
| Coroplast | Económico, ligero, absorbe impactos. Señalización. |
| Trovicel | Ligero, resistente, resistencia a corrosión. Señalización interior y exterior. |

**H2 · Etiquetado de tuberías y SGA**
`Etiquetas diseñadas para condiciones extremas: temperaturas altas, sustancias químicas y ambientes húmedos. Cada una se personaliza según las especificaciones del cliente.`

*Nuestras etiquetas:*
- Resisten temperaturas superiores a **+80 °C**.
- Soportan exposición a sustancias químicas corrosivas manteniendo su forma.
- Cumplen la norma de etiquetado e identificación de fluidos.

*Cinco frentes:* **Código de colores** (asesoría en identificación correcta de líneas) · **Placas** (aluminio, ABS bicapa, Gravoply 3 capas, resistentes a corrosivos e intemperie) · **Etiquetado** (color de seguridad, color complementario, banda franjeada, vista 360°) · **Guías** (material de apoyo visual para capacitar a tu personal) · **Delimitación de áreas** (pintura de alto tránsito para mayor durabilidad).

`Somos tu soporte en la implementación del Sistema Globalmente Armonizado. Identificación en envases, tanques, silos, blenders, mezcladoras y transporte de sustancias químicas peligrosas, con materiales que cumplen la NOM-018-STPS.`

**H2 · Tableros**
`El éxito de una empresa depende de su eficiencia operativa y de la seguridad de su gente. Nuestros tableros hacen que eso se vea todos los días, en el piso.`
*Tipos:* móvil · giratorio · cruz de seguridad · con acrílicos · imantado · personalizado · dinámicos.
*Para qué:* persuadir a tus colaboradores sobre la importancia de atender los procesos · mejor control de KPIs con tableros interactivos · visión integral de avances e información clave.

**H2 · Rotulación de unidades y flotillas**
`Soluciones integrales para vehículos de transporte pesado, unidades empresariales, flotillas y balizado, cumpliendo las normativas de seguridad y visibilidad en carretera.`
- **Póliza de garantía de 2 años** en nuestras rotulaciones, porque confiamos en los materiales que usamos.
- Creamos la identidad visual de tus unidades desde cero.
- Analizamos las necesidades específicas de tus unidades de transporte y distribución.
- Tiempos de entrega menores a la competencia.
- Balizado conforme a la normatividad vigente.
*Materiales:* vinil reflejante · vinil de corte vehicular · Air Free (acabado profesional) · Wrap (protege la pintura original y previene óxido).

**H2 · Campañas de seguridad**
`Estrategias y apoyos visuales para comunicar y capacitar dentro de tu centro de trabajo, mitigando los accidentes causados por la desinformación.`
EPP · prevención de derrames · manejo seguro de sustancias químicas · nuevos sistemas de identificación de riesgos · cultura de seguridad 24/7 · emergencias · mes de la seguridad y salud en el trabajo · simulacros · identificación y control de riesgos.

**H2 · Películas de seguridad**
`Capa adicional de protección para ventanas, cristales y superficies expuestas a impactos o roturas. Previenen la fractura del vidrio y protegen tanto a las personas como a los bienes.`
- Seguridad 2.95 mm para cristales transparentes — **5 a 8 años de durabilidad**.
- Reflectiv (efecto espejo) — **reduce hasta 70% el calor** en interiores.
- Protección de pintura vehicular Full Wrap PF-X.
*Prioridades:* protección UV · control térmico · reducción de deslumbramientos · privacidad en áreas restringidas. Con asesoría para cumplir lo que pide Protección Civil.

**H2 · Corte y grabado láser**
`Diseñamos, fabricamos y creamos en acrílico, cristal, MDF o estireno. Desde una pieza única hasta producción a gran escala.`
Portahojas · reconocimientos · guardas de seguridad · corpóreos · proyectos especiales.

**H2 · Identidad visual**
`Tu marca es la esencia de tu empresa y su imagen debe reflejar lo que representas — además de estar protegida legalmente.`
Creación de logotipos · manual de identidad visual · rebranding.

**H2 · También hacemos** *(bloque compacto, sin protagonismo)*
Impresión y diseño en lona, vinil y gran formato · permisos y formatos impresos · promocionales para ferias, exposiciones, conferencias y lanzamientos · carteles, banners, tarjetas de presentación, folletos y etiquetas personalizadas.

**FAQ (Publicidad)**
1. **¿Trabajan bajo norma?** Sí. Señalética conforme a NOM-026-STPS-2011 y soporte de implementación del SGA conforme a NOM-018-STPS.
2. **¿Instalan o solo fabrican?** Fabricamos e instalamos. La instalación en planta se cotiza según distancia, altura y ventana de trabajo.
3. **¿Cuánto tardan?** Depende del volumen, pero los plazos cortos son parte de nuestra propuesta. Si tu proyecto es urgente, dilo al cotizar: tenemos capacidad para urgencias.
4. **¿Atienden fuera de San Juan del Río?** Sí, damos servicio en Querétaro y estados vecinos. El traslado se incluye en la cotización.
5. **¿Dan garantía?** Sí. En rotulación vehicular, póliza por 2 años. En el resto, garantía de calidad en cada entrega.
6. **¿Puedo pedir una sola pieza?** Sí. Producimos desde una pieza única hasta series a gran escala.

---
### 3.3 — INNOVACIÓN DIGITAL `/innovacion-digital`

*(Modo Noche · es el hub del área)*

- Eyebrow: `ÁREA DE INNOVACIÓN TECNOLÓGICA Y DIGITAL`
- **H1:** `Innovación digital para empresas que ya no quieren hacerlo a mano`
- Subtexto: `La misma agencia que rotula tu flotilla ahora construye lo que corre en tus pantallas: páginas web, automatizaciones y herramientas hechas para cómo opera tu empresa de verdad.`
- CTA: **`Ver páginas web`** → `/paginas-web`

**H2 · El servicio estrella**
*(bloque grande, ocupa una pantalla, lleva al detalle)*
`Páginas web` — `Cómprala y es tuya, o réntala y olvídate de todo. Dos formas de tenerla, tres paquetes, cero letras chiquitas.`
→ **`Ver los paquetes`** → `/paginas-web`

**H2 · Otros servicios del área** `[PROVISIONAL — ver nota técnica]`
> **Nota para Claude Design:** esta sección debe construirse a partir de **un solo arreglo `SERVICIOS_DIGITALES` declarado arriba del archivo**, con campos `{ titulo, descripcion, icono, estado }` donde `estado` es `"activo"` o `"proximamente"`. Con 3 tarjetas provisionales basta; el usuario irá agregando más durante el desarrollo cambiando únicamente ese arreglo. Las tarjetas con `estado: "proximamente"` muestran un badge cian y no llevan enlace.

Tarjetas provisionales `[supuesto: sustituibles por completo]`:
1. **Automatizaciones** — `Conectamos las herramientas que ya usas para que dejen de pedirte trabajo manual.` `[próximamente]`
2. **Chatbots para atención y ventas** — `Atención en WhatsApp las 24 horas, con las respuestas de tu negocio, no genéricas.` `[próximamente]`
3. **Publicidad digital** — `Campañas que traen solicitudes reales a tu WhatsApp, medidas por costo por prospecto.` `[próximamente]`

**CTA FINAL**
`¿Tienes un proceso que te está comiendo horas? Cuéntanoslo y te decimos si se puede automatizar — aunque la respuesta sea que no.`
→ **`Platicarlo`** → `/contacto?interes=digital`

---
### 3.4 — PÁGINAS WEB `/paginas-web` ★ la estrella

*(Modo Noche · aquí va el carrusel 3D y los demos)*

**HERO**
- Eyebrow: `INNOVACIÓN DIGITAL · PÁGINAS WEB`
- **H1:** `Páginas web para empresas: cómprala o réntala`
- Subtexto: `Estás viendo un ejemplo ahora mismo. Esta página la hicimos nosotros — y la tuya la hacemos igual de bien.`
- CTA primario: **`Ver paquetes`** → `#paquetes` · secundario: **`Ver ejemplos en vivo`** → `#demos`

> Ese subtexto es la pieza de copy más importante del sitio: convierte tu propia web en la prueba. Es exactamente lo que pediste, dicho en una línea.

**PROBLEMA**
> **H2:** `El 90% de las páginas de empresas de la región son un folleto que nadie abre`
> Están hechas en plantilla, tardan seis segundos en cargar, no aparecen en Google y no hay a quién llamar cuando algo se rompe. Cuestan poco y no producen nada — que es la forma más cara de gastar.

**H2 · Dos formas de tenerla** *(las dos tarjetas grandes que pediste, lado a lado)*

**Tarjeta A — Sé dueño de tu página web**
`Pago único. El sitio es tuyo: código, dominio y cuentas a tu nombre. Te la entregamos funcionando y capacitamos a tu equipo para actualizarla.`
- Pago único, sin mensualidad
- Dominio y hosting a tu nombre
- Capacitación de entrega incluida
- Soporte por 30 días posteriores
- Ampliaciones y cambios se cotizan aparte
→ **`Cotizar mi página`**
*Para quién:* empresas que quieren un activo propio y ya tienen quién le dé mantenimiento.

**Tarjeta B — Renta tu página web** *(marcada como la más elegida)*
`Mensualidad fija. Nosotros ponemos el diseño, el hosting, el dominio, las actualizaciones y el soporte. Tú solo la usas.`
- Sin inversión inicial fuerte
- Hosting, dominio y certificado incluidos
- Cambios y mantenimiento cada mes
- Soporte directo, sin ticket
- Si te vas, no te quedas con el código `[supuesto: confírmame si esta condición es correcta]`
→ **`Ver los tres paquetes`** → `#paquetes`
*Para quién:* negocios que quieren estar en línea ya, sin descapitalizarse ni contratar a nadie.

**H2 · Tres paquetes de renta** *(id `#paquetes` — CARRUSEL 3D)*

`[PENDIENTE: precios y contenido exacto de cada paquete. Abajo va la estructura propuesta con nombres y escalera de valor; ajústala.]`

| | **Esencial** | **Impulso** ★ | **Autoridad** |
|---|---|---|---|
| Para quién | Estar en línea, bien | Que la página traiga clientes | Que la página trabaje sola |
| Páginas | 1 (one-page) | Hasta 5 | Sin límite práctico |
| Diseño | Plantilla adaptada a tu marca | Diseño propio | Diseño propio + animaciones |
| Contenido | Tú lo entregas | Redacción incluida | Redacción + fotografía |
| SEO | Básico | SEO local + Google Business | SEO local + blog + contenido mensual |
| Formularios | 1 | 1 + WhatsApp | Formularios + chatbot |
| Cambios al mes | 1 | 3 | Ilimitados razonables |
| Soporte | Correo | Correo y WhatsApp | WhatsApp directo |
| Reporte | — | Mensual | Mensual + junta trimestral |
| Precio | `$X/mes` | `$Y/mes` | `$Z/mes` |
| Alta | `$__` | `$__` | `$__` |

Subtexto bajo el carrusel: `Sin contrato forzoso a 12 meses. Si en el primer mes no te convence, no sigues.` `[supuesto: confírmame la política]`

**H2 · Míralas funcionando** *(id `#demos` — la sección de demos)*
`No te vamos a describir cómo quedaría. Interactúa con tres sitios reales, en la pantalla que quieras.`

- Selector: **Escritorio | Teléfono** (cambia el marco del dispositivo)
- 3 demos: `[PENDIENTE: 3 URLs de sitios ya desplegados]`
  1. `[Demo 1 — nombre del giro, ej. "Restaurante"]`
  2. `[Demo 2 — ej. "Servicios industriales"]`
  3. `[Demo 3 — ej. "Tienda / catálogo"]`

> ⚠️ **Nota técnica que hay que resolver antes de programar:** los demos se cargan en `<iframe>`, y un sitio solo se deja embeber si sus encabezados `X-Frame-Options` / `Content-Security-Policy: frame-ancestors` lo permiten. Si los demos son tuyos, configúralos para permitir `disenartemx.com`. Si no puedes tocarlos, el plan B es una **captura de pantalla de alto largo dentro del marco, con auto-scroll al hacer hover** — se ve casi igual y nunca falla. Que Claude Design implemente el iframe **con fallback automático a imagen** si no carga en 3 segundos.

**H2 · Qué incluye siempre, en cualquier esquema**
Diseño responsive real (no "se ve en celular") · velocidad de carga optimizada · SEO técnico desde el primer día · formulario que llega a tu correo · botón de WhatsApp · certificado de seguridad · Google Analytics configurado.

**H2 · Cómo trabajamos** *(4 pasos — aquí sí la numeración informa, porque es una secuencia real)*
1. **Cotización.** Nos cuentas a qué te dedicas y qué necesitas. Te mandamos propuesta y precio en menos de 24 h hábiles.
2. **Contenido y diseño.** Definimos estructura, textos e imágenes. Ves un diseño antes de que exista una sola línea de código.
3. **Construcción.** La programamos, la probamos en teléfono y computadora y la afinamos para Google.
4. **Publicación y entrega.** Sale al aire, te capacitamos y —si es renta— la seguimos cuidando cada mes.

**FAQ (Páginas web — vale oro para SEO long-tail)**
1. **¿Cuánto cuesta una página web?** `[PENDIENTE: rango]` Depende de cuántas secciones lleve y de si necesitas que redactemos el contenido. En renta arrancas desde `$X` al mes; en compra es un pago único.
2. **¿Cuál me conviene: comprar o rentar?** Si tienes quién le dé mantenimiento y prefieres que sea un activo tuyo, compra. Si quieres estar en línea sin invertir de golpe ni contratar a nadie, renta.
3. **¿Qué pasa si rento y luego quiero comprarla?** Se puede: te cotizamos la compra y descontamos parte de lo que ya pagaste. `[supuesto: confírmame si aplicará esta política — es un argumento de venta muy fuerte]`
4. **¿En cuánto tiempo está lista?** `[PENDIENTE: plazo real]` desde que tenemos el contenido completo.
5. **¿Aparece en Google?** Se entrega optimizada técnicamente y dada de alta en Google. Posicionarse en búsquedas competidas es un trabajo continuo, y eso viene en los paquetes con SEO.
6. **¿Yo puedo actualizarla?** En compra, te capacitamos para hacerlo. En renta, nos lo pides y lo hacemos nosotros dentro de los cambios de tu paquete.
7. **¿El dominio es mío?** Sí en el esquema de compra. En renta lo administramos nosotros mientras dure el servicio.

**CTA FINAL**
> **H2:** `¿Empezamos por la tuya?`
> `Cuéntanos a qué te dedicas y te decimos cuál de los dos esquemas te conviene — aunque sea el más barato.`
> **`Cotizar mi página web`** → `/contacto?interes=pagina-web`

---
### 3.5 — NOSOTROS `/nosotros`

*(Modo Taller)*

- **H1:** `20 años haciendo visible lo que las empresas quieren decir`
- Subtexto: `Diseñarte México es una agencia de publicidad e innovación digital en San Juan del Río, Querétaro, con más de 20 años de experiencia brindando soluciones especializadas para el sector industrial.`

**H2 · Qué hacemos**
`Nos enfocamos en optimizar la comunicación visual de las empresas, desarrollando materiales gráficos y estrategias digitales que refuercen su identidad y su presencia en el mercado.`

**H2 · Lo que nos respalda**
`Contamos con una larga trayectoria y una extensa lista de clientes que nos avala. Fuimos acreedores al reconocimiento de Imbera México como proveedor destacado, primer lugar, en 2023 y 2024 — dos años consecutivos que nos comprometen a seguir ofertando la calidad y el servicio que nos distingue.`
*(Bloque destacado con el dato en número grande: **1er lugar · 2023 y 2024 · Imbera México**)*

**H2 · Cómo trabajamos** — los 9 puntos de "Por qué Diseñarte" (mismos del inicio, aquí desarrollados).

**H2 · Dónde estamos** — San Juan del Río, Querétaro. Servicio en el estado y zonas vecinas. `[PENDIENTE: dirección exacta y horario para el mapa y el schema LocalBusiness]`

**Cita de cierre** *(la del catálogo, se gana su lugar)*
> *"El diseño es el intermediario entre la información y el entendimiento."* — Hans Hoffman

---
### 3.6 — CONTACTO `/contacto`

- **H1:** `Cuéntanos qué necesitas`
- Subtexto: `Respondemos en menos de 24 horas hábiles. Si es urgente, escríbelo en el mensaje.`

**El formulario (único en todo el sitio):**

| Campo | Tipo | Nota |
|---|---|---|
| Nombre | texto, requerido | |
| Empresa | texto, opcional | |
| Correo | email, requerido | validación en vivo |
| Teléfono / WhatsApp | tel, requerido | |
| ¿Qué necesitas? | select, requerido | Publicidad y señalética · Página web · Otro servicio digital · No sé todavía |
| Mensaje | textarea, requerido | placeholder: `Ej.: 40 letreros de seguridad para planta en El Marqués, instalados.` |
| Aviso de privacidad | checkbox, requerido | `He leído y acepto el aviso de privacidad.` |
| *(honeypot oculto)* | | anti-spam, sin CAPTCHA |

- El `select` se preselecciona solo según el parámetro `?interes=` de la URL.
- Botón: **`Enviar solicitud`** → al terminar, mensaje: **`Solicitud enviada. Te respondemos en menos de 24 horas hábiles.`**
- Si falla: `No se pudo enviar. Escríbenos por WhatsApp al 427 211 05 28 y lo resolvemos ahí mismo.`
- Envío al endpoint `/api/contacto` → correo a `ventas@disenartemx.com` `[PENDIENTE: confirmar]`

**Bloque lateral:** WhatsApp `427 211 05 28` · Teléfono `427 100 41 83` · Correo · Ubicación · Horario `[PENDIENTE]` · mapa embebido con `loading="lazy"`.

> ⚠️ **Legal (México):** el aviso de privacidad es obligatorio por la LFPDPPP en cualquier formulario que recolecte datos personales. Hay que publicar `/aviso-de-privacidad` y enlazarlo desde el checkbox y el footer. `[PENDIENTE: texto del aviso]`

---
### 3.7 — FOOTER (todas las páginas)

- Columna 1: logo + `Agencia de publicidad e innovación digital. San Juan del Río, Qro. Desde 2005.`
- Columna 2 — Publicidad: Señalética · Tableros · Flotillas · Campañas de seguridad · Láser
- Columna 3 — Innovación digital: Páginas web · Paquetes de renta · Otros servicios
- Columna 4 — Contacto: WhatsApp · Teléfonos · Correo · Ubicación
- Barra inferior: `© 2026 Diseñarte México®. Todos los derechos reservados.` · Aviso de privacidad · Redes sociales
- **Sin newsletter.** No tienes un programa de correo que lo alimente; un formulario muerto en el footer resta credibilidad.

---

## 4. BLOQUE SEO (obligatorio — se traslada tal cual al prompt de Claude Design)

### 4.1 Title tags y meta descriptions

| URL | Title (50–60) | Meta description (140–160) |
|---|---|---|
| `/` | `Agencia de publicidad en San Juan del Río \| Diseñarte México` | `Señalética industrial, tableros, rotulación de flotillas y páginas web para empresas. 20 años en San Juan del Río, Querétaro. Cotiza en 24 horas.` |
| `/publicidad` | `Señalética industrial y rotulación en Querétaro \| Diseñarte` | `Señalética bajo NOM-026-STPS, etiquetado de tuberías y SGA, tableros, rotulación de flotillas y películas de seguridad. Fabricamos e instalamos. Cotiza hoy.` |
| `/innovacion-digital` | `Innovación digital para empresas \| Diseñarte México` | `Páginas web, automatizaciones y herramientas digitales para empresas de Querétaro. Construimos activos que trabajan, no folletos digitales.` |
| `/paginas-web` | `Páginas web para empresas: compra o renta \| Diseñarte MX` | `Diseño de páginas web en San Juan del Río. Cómprala y es tuya o réntala desde una mensualidad fija con hosting, soporte y cambios incluidos.` |
| `/nosotros` | `Nosotros \| 20 años de publicidad industrial \| Diseñarte MX` | `Agencia de publicidad e innovación digital en San Juan del Río desde hace más de 20 años. Proveedor destacado 1er lugar de Imbera México 2023 y 2024.` |
| `/contacto` | `Contacto \| Diseñarte México, San Juan del Río, Qro.` | `Cotiza señalética industrial, rotulación o tu página web. Respondemos en menos de 24 horas hábiles. WhatsApp, teléfono y formulario directo.` |

### 4.2 Jerarquía de headings
Un **único H1 por página** (el del hero). Todos los títulos de sección son H2; los subtítulos internos (materiales, tipos, pasos) son H3. Ningún H2 sin H1 arriba, ningún salto de H2 a H4.

### 4.3 Alt texts propuestos
- Logo: `Diseñarte México, agencia de publicidad en San Juan del Río`
- Hero inicio (video/póster): `Instalación de señalética industrial por el equipo de Diseñarte México`
- Publicidad – señalética: `Letreros de seguridad industrial bajo norma NOM-026-STPS instalados en planta`
- Publicidad – tuberías: `Etiquetado de tuberías con código de colores en instalación industrial`
- Publicidad – tableros: `Tablero de seguridad industrial con indicadores y KPIs en piso de planta`
- Publicidad – flotillas: `Camión de carga rotulado con vinil de corte e identidad corporativa`
- Publicidad – láser: `Reconocimiento corporativo en acrílico con grabado láser`
- Páginas web – demos: `Ejemplo de página web para empresa mostrado en computadora y teléfono`
- Nosotros: `Equipo de Diseñarte México en su taller de producción en San Juan del Río`
- Reconocimiento: `Reconocimiento de Imbera México a Diseñarte como proveedor destacado 2024`

### 4.4 Datos estructurados JSON-LD (solo nombrarlos; Claude Design escribe el código)
- **Todas las páginas:** `Organization`, `WebSite`, `BreadcrumbList`
- `/` y `/nosotros`: `LocalBusiness` (con dirección, teléfono, horario, `geo`, `areaServed: Querétaro`)
- `/publicidad`: `Service` (uno por servicio principal) + `FAQPage`
- `/paginas-web`: `Service` + `Offer` (uno por paquete, con `priceCurrency: MXN`) + `FAQPage`
- `/contacto`: `ContactPage`

### 4.5 Técnico
Canonical en cada página · `robots: index, follow` · Open Graph + Twitter Card (imagen 1200×630 con el gradiente firma y el logo) · `sitemap.xml` + `robots.txt` · URLs limpias con guiones y sin `.html` · `hreflang` no aplica (sitio solo en español) · enlaces internos cruzados entre Publicidad ↔ Inicio ↔ Páginas web con texto ancla descriptivo (nunca "click aquí").

---

## 5. HERO — "La D rueda"

> **Versión definitiva.** El hero es un video en loop de la escultura de la D con una bolita rodando por su canal. Se descarta el sistema de atmósfera de objetos flotantes: el sitio vuelve al esquema de dos temperaturas de la decisión 0.3, y el trazo (sección 1.7) recupera su papel original.

### 5.0 — El concepto

Una pieza escultórica flotando en el aire: **el isotipo de Diseñarte tallado en material sólido**, con un canal excavado que recorre todo su contorno. Por ese canal rueda una bolita magenta, sin parar, dando vueltas para siempre. Alrededor flotan planos de vidrio esmerilado y un haz de luz violeta atraviesa la escena.

Tres razones por las que este concepto funciona:

**1. El contorno del isotipo es un circuito cerrado, así que el loop es perfecto.** La bolita entra por donde salió. No hay ping-pong, no hay corte, no hay truco.

**2. La estela de la bolita es el trazo.** Al rodar, el canal se ilumina detrás de ella con el gradiente magenta→cian y se apaga lento. Es el mismo elemento firma de la sección 1.7: nace en el hero y, al hacer scroll, sale del canal y baja por toda la página.

**3. Es tu marca, no una metáfora de tu marca.** Quien la ve tres segundos ya se aprendió tu logo sin leer una palabra.

⚠️ **Advertencia de forma, y es la que más generaciones te va a ahorrar:** tu isotipo **no es una letra D**. Es un cuadrado redondeado con la D calada en negativo y un swoosh interior. Si el prompt dice *"a letter D"*, el modelo te devuelve una D tipográfica cualquiera. Siempre hay que pedirle que esculpa **la forma adjunta**, y adjuntar el archivo.

### 5.1 — Composición y materiales

| | Especificación |
|---|---|
| **Encuadre** | 16:9. La escultura ocupa el **60% derecho**, rotada unos 15° en Y para que se lea el volumen del canal. El tercio izquierdo queda vacío y en penumbra: ahí va el H1. Regla dura — si el titular no se lee, el hero fracasó. |
| **Material (opción 1)** | Porcelana blanca hueso, satinada, con subsurface scattering suave en los bordes finos. Chaflán de 2 mm en todas las aristas. |
| **Material (opción 2)** | **Acrílico esmerilado de 40 mm**, translúcido, con refracción interna y cantos pulidos que brillan. Es un guiño a tu propio oficio —tú cortas acrílico— y proyecta cáusticas violetas sobre el fondo. |
| **El canal** | Excavado en la cara frontal, sección en U, ancho ≈ 1/8 del grosor del trazo. Interior más pulido que el exterior. |
| **La bolita** | Esfera del 80% del ancho del canal, metálica pulida, **magenta `#A53692`**, con halo propio muy tenue. Único punto saturado de la escena. |
| **La estela** | El interior del canal se enciende detrás de la bolita con el gradiente firma (`#7C07A6` → `#A53692` → `#5CC6D0`) y se apaga en ~1.5 s. Siempre queda un rastro tenue en todo el recorrido. |
| **Luz** | Key suave arriba-izquierda. **Haz volumétrico violeta** cruzando en diagonal por detrás, con neblina fina. Rim light cian tenue en el borde derecho. Sombra difusa. |
| **Entorno** | Dos o tres planos de **vidrio esmerilado** flotando a distintas profundidades, rotando lentísimo. Fondo: degradado plano `#0E0714` → `#1A0F24`. Nada más. |
| **Cámara** | Casi fija: orbital drift de máximo 3–4° que regresa exactamente a su punto de partida. Profundidad de campo real. |
| **Grano** | Grano de película fino al 6%. Es lo que quita el acabado "3D limpio de plantilla". |

### 5.2 — El recorrido y el ritmo

Ocho segundos, **una sola vuelta completa**. Una vuelta por loop, no tres: la calma es parte del lujo.

| Tramo | Ritmo |
|---|---|
| Asta, de arriba abajo | Rápido, acelerando |
| Curva inferior | Lento, es el momento contemplativo |
| Subida por la derecha | Muy lento, casi se detiene arriba |
| Curva superior y vuelta al asta | Se acelera de nuevo |

**La bolita no va a velocidad constante.** Se comporta como si pesara. Es el detalle que separa esto de un GIF genérico.

### 5.3 — Rutas de producción

| | **A · Render 3D (Blender / Spline)** | **B · Ambiente IA + bolita en SVG** ★ | **C · Todo con IA** |
|---|---|---|---|
| Control del recorrido | Total | Total (la capa la escribes tú) | Bajo |
| Loop perfecto | Sí | Sí, por construcción | Solo con la técnica de 5.6 |
| Peso | 1.5–2.5 MB | ~2 MB + 15 KB de capa | 1.5–2.5 MB |
| Quién lo hace | Alguien con Blender | Cualquiera + Claude Design | Cualquiera |
| Editar después | Un parámetro | Una curva de easing | Regenerar todo |

**Recomendación: camino B.** Le pides a la IA solo el **ambiente** —lo único que estos modelos loopean bien— y **la bolita va encima como capa SVG** con `offset-path` sobre el trazado del canal. Ahí no se sale, no cambia de tamaño, el ritmo lo defines con una curva de easing y el loop cierra exacto porque lo cierras tú. Una costura mínima en el video de fondo no se nota, porque el ojo va a la bolita.

Si consigues quien modele en Blender, el camino A da el mejor resultado y el brief de render está en 5.7.

### 5.4 — Prompts de la imagen base

Adjunta el archivo **NEGRO** del logo (silueta sólida — es la que mejor lee un modelo de imagen) y, como segunda referencia de paleta, el **COLOR**. **Recorta solo el isotipo**, sin el lettering "Diseñarte México": si lo dejas, el modelo intentará esculpirlo también.

**Variante porcelana**
```text
Using the attached image as the EXACT shape reference: sculpt this logo mark
as a physical object floating in space. Keep its geometry precisely — a
rounded square with a D-shaped negative cutout and an inner swoosh. Do not
redraw it as a typographic letter D.

Material: bone-white porcelain, satin finish, soft subsurface scattering on
the thin edges, 2mm rounded chamfer on all edges. A narrow U-shaped channel
is carved into the front face, running along the complete outer contour of
the mark like a closed circuit — clearly visible, slightly more polished
inside than the surrounding surface.

The object sits in the right 60% of the frame, rotated about 15 degrees on
its vertical axis so the depth of the channel reads. The left third is empty
and in shadow. Two panes of frosted glass float at different depths behind
it, softly out of focus. A volumetric violet light beam (#7C07A6) crosses
diagonally behind the object through fine haze. Soft key light from upper
left, faint cyan (#5CC6D0) rim light on the right edge. Background: flat
gradient from #0E0714 to #1A0F24, nothing else.

Shallow depth of field, fine film grain, photorealistic product render,
calm and premium. 16:9. No text, no wordmark, no logos, no watermarks,
no spheres or balls.
```

**Variante acrílico**
```text
Same instructions and same shape reference as above, but the material is
thick frosted acrylic instead of porcelain: translucent, 40mm thick, with
visible internal light refraction and softly glowing polished edges. The
carved channel is polished clear so it reads as a bright line against the
frosted body. Light passes through the object and casts a soft violet
caustic on the surface behind it. Everything else identical: 15-degree
rotation, right 60% of frame, left third dark and empty, frosted glass
panes, volumetric violet beam, #0E0714 to #1A0F24 background, shallow depth
of field, film grain, 16:9. No text, no wordmark, no spheres or balls.
```

**Cómo elegir entre las generaciones:** quédate con la que tenga el **canal más continuo y legible en toda la vuelta**, no con la más bonita. Ese canal es el que vas a trazar como `path` para la bolita, y uno que se pierde en sombra a media vuelta no sirve.

### 5.5 — Prompt de video para el camino B (solo ambiente)

Adjunta la imagen elegida **como fotograma inicial y como fotograma final** (Kling, Luma y Runway lo permiten con "start & end frame" o "keyframes"). Poniendo la misma imagen en las dos casillas, el loop cierra por construcción. Pedírselo solo por texto casi nunca funciona.

```text
Animate the attached image. 8 seconds, 16:9, no audio.

The camera holds almost completely still with a barely perceptible orbital
drift of no more than 3 degrees that returns to its starting position. The
sculpture does not move. The frosted glass panes rotate very slowly at
different speeds; the volumetric violet haze drifts; the light on the carved
channel breathes almost imperceptibly, as if a cloud passed. Fine dust
particles float slowly through the light beam.

Nothing else changes. No objects enter or leave the frame. The final frame
must match the first frame exactly. Preserve the geometry, material,
palette, grain and depth of field of the source image. The left third stays
dark and empty. No text, no logos, no watermarks, no spheres or balls.
```

La bolita se monta encima como capa SVG. Especificación en el bloque de 5.8.

### 5.6 — Si quieres la vuelta completa hecha 100% con IA

**No uses la misma imagen como inicio y fin con la bolita en cuadro.** El modelo casi siempre lo resuelve haciendo *boomerang*: la bolita avanza medio camino y regresa por donde vino. Una bola que retrocede rompe la física y se nota muchísimo.

La técnica correcta es **encadenar cuatro clips**.

**Paso 1 — cuatro imágenes fijas** idénticas salvo por la posición de la bolita. Lo más confiable es generar la primera y luego usar edición de imagen para moverla, así el material y la luz no cambian.

```text
Using the attached image, add a small polished metallic sphere in magenta
(#A53692) resting inside the carved channel, positioned at [POSITION]. The
sphere sits strictly within the channel and is about 80% of the channel's
width, with a very faint glow. Change nothing else: same geometry, same
material, same lighting, same background, same grain, same framing.
```
`[POSITION]` = *the top of the vertical stem* / *the bottom curve* / *the right side of the bowl* / *the upper curve*.

**Paso 2 — cuatro clips de 2 s**, cada uno con fotograma inicial y final:

| Clip | Inicial | Final |
|---|---|---|
| 1 | Pos. A | Pos. B |
| 2 | Pos. B | Pos. C |
| 3 | Pos. C | Pos. D |
| 4 | Pos. D | **Pos. A** ← cierra el círculo |

```text
Animate from the first keyframe to the last keyframe. 2 seconds, 16:9, no
audio. The magenta sphere rolls smoothly along the carved channel from its
starting position to its ending position, staying strictly inside the
channel at all times and keeping a constant size. It never leaves the
channel and never reverses direction.

Behind it, the inside of the channel glows with a gradient from #7C07A6 to
#A53692 to #5CC6D0 and fades out over about 1.5 seconds, leaving a faint
trail.

The camera does not move at all. The sculpture does not move. The frosted
glass panes and the volumetric haze drift almost imperceptibly. Preserve the
geometry, material, palette, grain and depth of field of the keyframes. The
left third of the frame stays dark and empty. No text, no logos, no
watermarks.
```

**Paso 3 — montaje**
```bash
ffmpeg -f concat -safe 0 -i lista.txt -c:v libvpx-vp9 -crf 32 -b:v 0 -an hero.webm
```

**Dos cosas que hay que corregir en el montaje:**
- **El cambio de velocidad se pierde**, porque cada tramo dura lo mismo. Se recupera dándole a cada clip una velocidad distinta (el del asta al 130%, el de la subida al 70%) y ajustando el total a 8 s.
- **Habrá micro-saltos en los empalmes**: material, grano y neblina no coinciden al 100% entre clips generados por separado. Se tapan con un **crossfade de 0.4 s en cada unión**, no solo en el cierre del loop.

### 5.7 — Brief de render para el camino A (Blender / Spline)

```text
ESCENA: "La D rueda" — hero de Diseñarte México
Loop perfecto de 8 s, 1920x1080, 30 fps, sin audio.

OBJETO
Escultura 3D del isotipo de Diseñarte (importar el SVG del logo y extruir).
NO es una letra D tipográfica: es un cuadrado redondeado con la D calada en
negativo y un swoosh interior. Extrusión = 1/3 del ancho de la pieza.
Chaflán de 2 mm en todas las aristas.
Canal en U excavado en la cara frontal, siguiendo el contorno exterior
completo como circuito cerrado. Ancho = 1/8 del grosor del trazo. Interior
del canal más pulido que el exterior.

MATERIALES
- Pieza: porcelana blanca hueso. Base color #F4F2EE, roughness 0.35,
  subsurface scattering de radio corto y tinte cálido. Sin metalness.
  (Alternativa: acrílico esmerilado, transmisión 0.85, espesor 40 mm,
  cantos pulidos.)
- Interior del canal: mismo material, roughness 0.18.
- Bolita: esfera metálica pulida, base color #A53692, metalness 0.9,
  roughness 0.15, emisión muy baja del mismo color.
- Planos flotantes: vidrio esmerilado, transmisión 0.9, roughness 0.4.

ANIMACIÓN
La bolita da UNA vuelta completa en 8 s con velocidad NO constante: acelera
en los tramos descendentes, frena en los ascendentes, casi se detiene en el
punto más alto. Curva de animación con ease, nunca lineal.
Detrás de ella, el interior del canal se ilumina con un gradiente
#7C07A6 → #A53692 → #5CC6D0 que se desvanece en 1.5 s, dejando siempre un
rastro tenue en todo el recorrido.
Dos planos de vidrio rotan muy lento; uno cruza por delante de la pieza una
sola vez durante el loop.
Cámara: orbital drift de máximo 4 grados y dolly-in casi imperceptible.
Todo el movimiento debe cerrar exactamente donde empezó.

ILUMINACIÓN
Key light suave arriba-izquierda, área grande, sombras difusas.
Haz volumétrico violeta #7C07A6 en diagonal DETRÁS de la pieza, niebla fina
de baja densidad.
Rim light cian #5CC6D0 de baja intensidad en el borde derecho.
Fondo: degradado plano #0E0714 → #1A0F24. Nada más.

ENCUADRE (regla dura)
La pieza ocupa el 60% derecho, rotada unos 15 grados en Y. El tercio
izquierdo queda vacío y en penumbra — ahí va el titular. Verificar que
ningún elemento brillante entre en ese tercio en ningún frame.

POST
Profundidad de campo real. Grano de película fino al 6%. Sin viñeteo, sin
bloom exagerado, sin destellos de lente.
```

**Entrega, sea cual sea el camino:**
- 1920×1080, 30 fps, 8 s exactos, sin audio.
- **WebM (VP9, CRF 32)** como fuente principal + **MP4 (H.264)** de respaldo para Safari.
- Objetivo: **< 2.5 MB** entre los dos. Si se pasa, baja a 24 fps antes que bajar resolución.
- **PNG del frame 1** a 1920×1080 para el `poster` y el fallback estático.
- **Versión 1:1** recortada a la pieza, para <768px. En 16:9 la escultura queda diminuta en vertical.
- Verifica el loop reproduciendo el clip dos veces seguidas antes de darlo por bueno.

### 5.8 — Bloque para Claude Design (sustituye el punto 6.2)

```text
--- 5.8 / 6.2 HERO: VIDEO 3D EN LOOP ---
El hero de Inicio lleva un video 3D de fondo: una escultura del isotipo de
Diseñarte con una bolita magenta rodando por un canal excavado en su
contorno. Es un LOOP PERFECTO (el clip cierra sobre sí mismo), no ping-pong.

MARCADO:
<video autoplay muted loop playsinline preload="metadata"
       poster="hero-poster.jpg" aria-hidden="true">
  <source src="hero-d-1x1.webm" type="video/webm" media="(max-width:767px)">
  <source src="hero-d.webm" type="video/webm">
  <source src="hero-d.mp4"  type="video/mp4">
</video>

REGLAS:
- Contenedor con aspect-ratio fijo y object-fit: cover, ancho y alto
  declarados, para que CLS = 0.
- Velo por encima del video y por debajo del texto:
  linear-gradient(90deg,#0E0714 0%,rgba(14,7,20,.6) 40%,transparent 70%).
  El H1 vive en el tercio izquierdo y debe ser legible siempre.
- prefers-reduced-motion: reduce → NO cargar el video; renderizar
  hero-poster.jpg como fondo estático.
- navigator.connection.saveData → mismo fallback estático.
- Pausar el video con IntersectionObserver cuando el hero sale del viewport
  y reanudar al volver.
- preload="metadata", nunca "auto". El poster carga primero y es el LCP.
- El video es decorativo: aria-hidden="true", sin pista de audio.

CAPA DE LA BOLITA (solo si el video entregado NO trae la bolita —
camino B de la sección 5.3):
- Un <svg> superpuesto al video, pointer-events: none, aria-hidden.
- Un <path> invisible que traza el canal de la escultura tal como se ve en
  el video (hay que trazarlo sobre el frame, no inventarlo).
- Un <circle> de r pequeño, relleno #A53692, con un <feGaussianBlur> tenue
  como halo, animado con offset-path sobre ese path, duración 8s, iteración
  infinita, y una curva de easing que acelere en los tramos descendentes y
  casi se detenga en el punto más alto (usa varios keyframes con offset-
  distance en porcentajes desiguales, no una animación lineal).
- La estela: un segundo <path> encima del canal con el --gradiente como
  stroke y stroke-dasharray animado por detrás de la bolita.
- La capa se oculta con prefers-reduced-motion y con saveData.

CONTINUIDAD CON EL TRAZO:
Justo debajo del hero arranca "el trazo" (elemento firma, sección 1.7): la
línea SVG con el gradiente que recorre toda la página al hacer scroll. Debe
entrar por el borde inferior del hero alineada con el lado derecho, como si
la estela de la bolita se hubiera salido del canal y siguiera bajando por la
página. Esa alineación es intencional: no la centres.
```

---

## 6. PROMPT ONE-SHOT PARA CLAUDE DESIGN

> Copia **todo lo que está dentro del bloque** y pégalo en Claude Design junto con los assets (MP4 de transición + Image 1 + Image 2 + logo en SVG + tus fotos de proyectos).

```text
=========================================================
CONSTRUYE EL SITIO COMPLETO DE DISEÑARTE MÉXICO
Sitio de 6 páginas, responsive, mobile-first, en español.
Genéralo COMPLETO de una sola vez, no página por página.
=========================================================

--- 6.1 ASSETS ADJUNTOS Y SU ROL ---
- hero-d.webm / hero-d.mp4 → video 3D en loop de la escultura del isotipo con
  la bolita. Fondo del hero de Inicio.
- hero-d-1x1.webm / .mp4 → misma escena recortada a 1:1, para <768px.
- hero-poster.jpg → primer frame del video. Atributo poster y fallback estático.
- logo.svg → imagotipo Diseñarte México. Versión a color sobre fondo claro,
  versión en blanco sobre fondo oscuro. Nunca deformar, nunca recolorear.
- Fotos de proyectos → secciones de Publicidad y bloque de trabajo reciente.

--- 6.2 HERO: VIDEO 3D EN LOOP ---
El hero de Inicio lleva un video 3D de fondo: una escultura del isotipo de
Diseñarte, con una bolita magenta rodando por un canal excavado en su
contorno. Es un LOOP PERFECTO (el clip cierra sobre sí mismo), no ping-pong.
NO uses WebGL ni Three.js: es un <video> con poster.
La especificación completa está en el bloque "5.8 / 6.2 HERO: VIDEO 3D EN
LOOP" de la sección 5.8 del documento de estrategia: pégalo aquí íntegro y
trátalo como parte de este prompt.
Lo innegociable: <video> con autoplay, muted, loop, playsinline,
preload="metadata", poster y aria-hidden; aspect-ratio fijo y object-fit
cover para CLS = 0; velo lateral para que el H1 del tercio izquierdo sea
legible; versión cuadrada por <source media> en <768px; fallback a poster
estático con prefers-reduced-motion o saveData; pausar con
IntersectionObserver fuera del viewport; y el trazo (elemento firma) entra
por el borde inferior del hero alineado a la derecha, como si fuera la
estela de la bolita saliendo del canal.

--- 6.3 DESIGN SYSTEM ---
COLORES (variables CSS, sin excepciones):
  --tinta: #0E0714        fondo Modo Noche
  --tinta-2: #1A0F24      superficies elevadas sobre tinta
  --magenta: #A53692      primario de marca (botones primarios)
  --violeta: #7C07A6      secundario, gradientes, cortes diagonales
  --cian: #5CC6D0         acento (SOLO sobre fondo oscuro)
  --papel: #F2F1F3        fondo Modo Taller
  --blanco: #FFFFFF
  --gris: #96989A         SOLO divisores, bordes y texto >= 24px
  --gris-texto: #55575A   texto secundario sobre fondo claro
  --gradiente: linear-gradient(100deg,#7C07A6 0%,#A53692 45%,#5CC6D0 100%)

REGLAS DE CONTRASTE (no negociables):
  - Nunca texto blanco sobre --cian (contraste 2.0:1, reprueba AA).
  - Nunca --gris como texto corrido sobre fondo claro (2.9:1). Usa --gris-texto.
  - Texto blanco sobre --magenta sí se permite (6.0:1).
  - Texto sobre --cian debe ser --tinta.

MODOS: dos temperaturas con los mismos tokens.
  Modo Noche (fondo --tinta): Inicio, Innovación Digital, Páginas Web, Contacto.
  Modo Taller (fondo --papel): Publicidad, Nosotros.
  Impleméntalos como clase en <body>: .modo-noche / .modo-taller.

TIPOGRAFÍA:
  Display: 'Creato Display' con fallback a 'Outfit' (Google Fonts).
  Decláralo en UNA variable: --font-display, para poder sustituirlo en una línea.
  Pesos display: 300, 700, 900.
  Texto: 'Inter', pesos 400, 500, 600.
  font-display: swap. Subset latino. Precarga solo los 2 pesos del hero.
  Escala desktop / mobile:
    Display hero 88 / 40 px, line-height .95, letter-spacing -.03em, peso 900
    H1 56 / 34 · H2 40 / 28 · H3 26 / 21 (display 700)
    Body L 20 / 18 · Body 17 / 16 (Inter 400, line-height 1.65)
    Eyebrow 13 / 12 px, MAYÚSCULAS, letter-spacing .16em, Inter 600
    Dato 64 / 40 px, display 900, font-variant-numeric: tabular-nums

ESPACIADO Y GRID:
  Base 8px. Escala: 8/16/24/32/48/64/96/128.
  Contenedor máx 1240px, padding lateral 24px mobile / 48px desktop.
  Padding vertical por sección: 128px desktop, 72px mobile.
  Grid de 12 columnas, gap 24px.

FORMAS:
  --radio-card: 28px en tres esquinas y 6px en la superior izquierda
    (border-radius: 6px 28px 28px 28px). Esto hereda la forma del isotipo
    y se aplica a TODAS las tarjetas del sitio. Es el detalle de sistema.
  --radio-boton: 999px (pill).
  Sombras: nivel 1 = 0 2px 8px rgba(14,7,20,.10);
           nivel 2 = 0 12px 32px rgba(14,7,20,.18).
  En Modo Noche las sombras se sustituyen por un borde 1px rgba(255,255,255,.08).

CORTES DIAGONALES (el sistema visual):
  Cada cambio de sección se resuelve con un corte diagonal de 6 grados,
  usando clip-path en un pseudo-elemento (nunca una imagen). El corte entre
  Modo Noche y Modo Taller lleva el --gradiente. Los cortes internos son
  planos, del color de la sección siguiente.

ICONOGRAFÍA: línea, grosor 1.5px, tamaño 24px, terminaciones redondeadas.
  Sin iconos rellenos, sin emojis en la interfaz.

--- 6.4 ESTRUCTURA Y COPY ---
Construye las 6 páginas con EXACTAMENTE el copy que se te entrega en el
documento de estrategia (sección 3). NO inventes copy. NO uses lorem ipsum.
NO reescribas los textos. Si un bloque dice [PENDIENTE: ...], déjalo visible
como placeholder claramente marcado, no lo rellenes con texto inventado.

Rutas: / · /nosotros · /publicidad · /innovacion-digital · /paginas-web · /contacto

--- 6.5 NAVBAR ---
Sticky. Transparente sobre el hero, con fondo --tinta-2 y sombra al hacer
scroll (transición 250ms). Logo a la izquierda (versión blanca en Modo Noche,
color en Modo Taller). Links: Inicio · Nosotros · Publicidad ·
Innovación Digital (dropdown: Páginas web / Otros servicios) · botón [Cotizar].
Los anclas internas hacen smooth-scroll con offset del alto del navbar.
Mobile: menú hamburguesa a pantalla completa, links apilados con reveal
escalonado de 40ms, tap targets de 48px, cierre con Escape y con tap fuera.

--- 6.6 BOTONES Y CTAs ---
Primario: fondo --magenta, texto blanco, pill, padding 16px 32px, Inter 600 17px.
  hover: fondo --violeta + translateY(-2px). active: translateY(0).
Secundario (ghost): borde 1.5px currentColor, fondo transparente.
  hover: fondo currentColor al 8%.
Terciario (link): subrayado que crece de izquierda a derecha en 200ms.
Focus visible en todos: outline 2px --cian con offset 3px (en Modo Taller,
  outline --violeta para que contraste).
Disabled: opacidad .45, cursor not-allowed.
Todos los CTAs de servicio llevan a /contacto?interes=publicidad |
pagina-web | digital, según la sección donde viven.

--- 6.7 MICRO-INTERACCIONES Y ANIMACIONES ---
REGLA DURA: animar EXCLUSIVAMENTE con transform y opacity. Prohibido animar
width, height, top, left, box-shadow, filter o background-position.
Todo el movimiento entra por un único IntersectionObserver compartido, se
dispara UNA sola vez por elemento y se desconecta (unobserve) tras dispararse.
Nada de librerías de animación externas. Nada de Three.js ni WebGL.

  - Reveals: fade-up (translateY 24px → 0, opacity 0 → 1), 600ms,
    cubic-bezier(.22,1,.36,1), stagger de 80ms entre hermanos.
  - EL TRAZO (elemento firma): un SVG de una sola ruta con el --gradiente que
    recorre verticalmente toda la página, entrando y saliendo entre secciones.
    Se dibuja con stroke-dashoffset ligado al progreso de scroll
    (usa scroll-driven animations de CSS si el navegador las soporta;
    si no, un rAF con throttle). En mobile se reduce a una línea vertical de
    2px pegada al borde izquierdo. Con prefers-reduced-motion aparece dibujado
    al 100% desde el inicio, sin animación.
  - Titulares del hero: reveal por líneas con máscara (translateY + opacity),
    stagger de 90ms. Una sola vez, al cargar.
  - Tarjetas: hover = translateY(-6px) + el borde superior izquierdo
    (la esquina de 6px) se tiñe con --gradiente. 200ms.
  - Números y datos: cuenta ascendente al entrar en viewport, 1200ms,
    solo la primera vez.
  - Paralaje: SOLO en la imagen de fondo del CTA final (translateY sutil,
    máximo 40px de recorrido). En ningún otro lado.
  - Respeta prefers-reduced-motion en TODO: sin reveals, sin paralaje,
    sin video, sin conteo. El contenido aparece en su estado final.

--- 6.7b CARRUSEL 3D DE PAQUETES (elemento destacado) ---
En /paginas-web, sección #paquetes. Tres tarjetas de paquete en un carrusel
tridimensional, hecho con CSS PURO (perspective + rotateY + translateZ).
Sin librerías. Sin WebGL.
  - Contenedor con perspective: 1600px.
  - Tarjeta central: escala 1, rotateY 0, opacidad 1, borde de 2px con
    --gradiente y badge "El más elegido".
  - Tarjetas laterales: rotateY -32deg / +32deg, translateZ(-180px),
    translateX(±340px), escala .86, opacidad .55, sin sombra.
  - Transición entre estados: 550ms cubic-bezier(.22,1,.36,1), solo transform
    y opacity.
  - Controles: flechas a los lados, puntos indicadores abajo, arrastre con
    puntero y swipe táctil, navegación con flechas del teclado.
  - Accesibilidad: role="region" con aria-label, cada tarjeta con
    aria-hidden cuando no está activa, los controles con aria-label,
    y una tabla comparativa equivalente accesible por teclado como
    alternativa (puede ir colapsada bajo un <details>).
  - Mobile (<768px): el 3D se desactiva. Se convierte en un carrusel
    horizontal con scroll-snap, una tarjeta a la vez, sin rotación.
  - Con prefers-reduced-motion: se muestran las tres tarjetas apiladas
    en columna, sin carrusel.

--- 6.7c SECCIÓN DE DEMOS (en /paginas-web, #demos) ---
Tres demos mostrados dentro de un marco de dispositivo dibujado en CSS
(no imagen). Selector de vista: [Escritorio] / [Teléfono], que cambia el
marco y el ancho del contenido.
  - Cada demo carga una URL en un <iframe> con loading="lazy",
    sandbox="allow-scripts allow-same-origin", y title descriptivo.
  - FALLBACK OBLIGATORIO: si el iframe no carga en 3 segundos (o dispara
    error por X-Frame-Options), sustitúyelo automáticamente por una imagen
    de captura larga del sitio con auto-scroll vertical al hacer hover
    (animación con transform: translateY, en bucle lento).
  - Los iframes solo se cargan cuando la sección entra en viewport.
  - Las URLs de los demos deben declararse en UN solo arreglo DEMOS al
    inicio del archivo, con { nombre, giro, url, imagenFallback }.

--- 6.7d SERVICIOS DIGITALES (provisional) ---
En /innovacion-digital, la sección "Otros servicios" se construye desde UN
solo arreglo SERVICIOS_DIGITALES declarado al inicio del archivo, con
{ titulo, descripcion, icono, estado } donde estado es "activo" o
"proximamente". Las tarjetas "proximamente" llevan un badge cian y no
enlazan a ningún lado. El usuario irá agregando servicios modificando
únicamente ese arreglo — que sea trivial de editar y esté comentado.

--- 6.7e BOTONES FLOTANTES: WHATSAPP Y CHATBOT ---
Un solo botón flotante abajo a la derecha (24px del borde) que al pulsarlo
despliega hacia arriba dos acciones, con stagger de 60ms:
  1. WhatsApp → https://wa.me/524272110528?text=Hola%2C%20vengo%20de%20su%20p%C3%A1gina%20web%20y%20quiero%20cotizar
     Icono de WhatsApp, fondo #25D366.
  2. Chatbot → NO implementes el chat. Solo monta el contenedor
     <div id="chatbot-root" data-estado="pendiente"></div> y expón una función
     global window.DZChat = { abrir(), cerrar() } que por ahora muestre un
     panel vacío con el mensaje "Chat disponible próximamente". El widget real
     se conectará después.
Ambos con aria-label. Nunca deben tapar el CTA principal en mobile: el
contenedor flotante se oculta cuando el CTA final está en viewport.

--- 6.8 RESPONSIVE / MOBILE-FIRST ---
Breakpoints: 0–767 mobile · 768–1023 tablet · 1024+ desktop.
Escribe el CSS mobile-first (min-width, nunca max-width salvo excepciones).
  - Hero: el video no debe reventar en mobile; usa object-fit: cover con
    aspect-ratio fijo y punto focal centrado. En <768px considera cargar
    solo el poster si la conexión es lenta (navigator.connection.saveData).
  - Grids de 3 columnas → 1 columna. Tablas de materiales → tarjetas apiladas.
  - La tabla comparativa de paquetes en mobile → scroll horizontal con
    la primera columna fija.
  - Tap targets mínimos de 48px. Espaciado vertical entre interactivos: 12px.
  - Nada de hover como único medio de acceso a información.

--- 6.9 SEO TÉCNICO (obligatorio) ---
  - HTML5 semántico: header, nav, main, section, article, aside, footer.
    Nada de div soup. Cada sección con su <h2>.
  - Un solo <h1> por página, el del hero.
  - Title tags, meta descriptions y canonical según la tabla entregada.
  - meta robots: index, follow.
  - Open Graph completo (og:title, og:description, og:image 1200x630,
    og:type, og:url, og:locale es_MX) + Twitter Card summary_large_image.
  - JSON-LD: Organization + WebSite + BreadcrumbList en todas;
    LocalBusiness en / y /nosotros; Service + FAQPage en /publicidad;
    Service + Offer (priceCurrency MXN) + FAQPage en /paginas-web;
    ContactPage en /contacto.
  - Alt text descriptivo en TODAS las imágenes, según la lista entregada.
    Imágenes decorativas con alt="" y aria-hidden.
  - loading="lazy" en todo lo que esté fuera del viewport inicial;
    preload del asset del hero; width y height explícitos en toda imagen
    (CLS = 0).
  - Genera sitemap.xml y robots.txt.
  - Enlaces internos con texto ancla descriptivo. Nunca "click aquí".

--- 6.10 ACCESIBILIDAD ---
Contraste mínimo AA (4.5:1 texto, 3:1 texto grande) — aplica las reglas de
contraste del 6.3. Foco visible en todo interactivo. Orden de tabulación
lógico. aria-label en iconos sin texto, en el carrusel y en los flotantes.
Los acordeones de FAQ con <details>/<summary> o con aria-expanded correcto.
Skip link "Ir al contenido" al inicio del body. Idioma declarado: lang="es-MX".

--- 6.11 ESTADOS DE CONTENIDO ---
  - Proyectos y testimonios: marca los placeholders de forma evidente
    (borde punteado + etiqueta "PENDIENTE"), nunca con contenido inventado.
  - Formulario: estados de carga (botón con spinner y texto "Enviando…"),
    éxito y error, con los mensajes exactos entregados en el copy.
  - Imágenes que fallan: fondo con el --gradiente al 12% y el alt visible.
  - Secciones vacías: no se renderizan; no dejes huecos.

--- 6.12 DO'S & DON'TS ---
SÍ: usar el copy entregado tal cual · respetar la paleta exacta ·
    animar solo con transform y opacity · mobile-first · HTML semántico ·
    comentar el código por sección.
NO: lorem ipsum · inventar copy, precios, testimonios o clientes ·
    fotos de stock genéricas ni imágenes tipo "AI slop" ·
    glassmorphism, partículas de fondo, gradientes animados, blobs ·
    Three.js, WebGL, librerías de animación ·
    más de un H1 por página · texto blanco sobre cian ·
    newsletter en el footer · carruseles automáticos que no se pueden pausar.

--- 6.13 FORMATO DE SALIDA ---
Sitio de 6 páginas, responsive, código limpio y semántico, comentado por
sección. CSS con variables en :root, organizado por: tokens → base →
componentes → secciones → utilidades → media queries. JavaScript en vanilla,
diferido (defer), sin dependencias. Un solo IntersectionObserver compartido.
Arreglos de configuración (DEMOS, SERVICIOS_DIGITALES, PAQUETES) declarados
y comentados al inicio para que sean fáciles de editar.
=========================================================
```

---

## 7. WIREFRAMES

### 7.1 — INICIO (desktop)

```
┌────────────────────────────────────────────────────────────┐
│ [LOGO]   Inicio Nosotros Publicidad Innov.Digital▾ [Cotizar]│ ← sticky, transparente→sólida
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ██████ VIDEO 3D: LA D RUEDA · loop perfecto ██████████    │ ← poster = LCP
│  ┌──────────────────────────────┐                          │
│  │ SAN JUAN DEL RÍO · DESDE 2005│                          │ ← eyebrow
│  │ H1: Diseño, publicidad e     │                          │ ← reveal por líneas, 90ms stagger
│  │     innovación digital…      │                          │
│  │ subtexto                     │                          │
│  │ [Cotizar mi proyecto] (Ver…) │                          │
│  └──────────────────────────────┘                          │
├────────────────────────────────────────────────────────────┤
│ +20 años │ 1er lugar Imbera 23-24 │ NOM-026 │ Garantía 2 a.│ ← barra confianza, números cuentan
╲────────────────────────────────────────────────────────────╱ ← CORTE DIAGONAL 6° (gradiente)
│      H2: Tu empresa ya dice algo…  (2 líneas, centrado)     │ ← fade-up · mucho aire
├────────────────────────────────────────────────────────────┤
│  #areas   H2: Dos áreas, un mismo oficio                    │
│  ┌─────────────────────────┐ ┌─────────────────────────┐   │
│  │  PUBLICIDAD             │ │  INNOVACIÓN DIGITAL     │   │ ← 2 bloques grandes, no tarjetitas
│  │  foto real de planta    │ │  captura de sitio       │   │   hover: -6px + esquina degradada
│  │  texto + [Ver →]        │ │  texto + [Ver →]        │   │
│  └─────────────────────────┘ └─────────────────────────┘   │
├────────────────────────────────────────────────────────────┤
│  H2: Por qué las plantas nos vuelven a llamar               │
│  [01][02][03]                                              │ ← grid 3×3
│  [04][05][06]                                              │   stagger 80ms por fila
│  [07][08][09]                                              │
├────────────────────────────────────────────────────────────┤
│  H2: Trabajo reciente   ← ← carrusel horizontal → →         │ ← scroll-snap, drag
├────────────────────────────────────────────────────────────┤
│  CTA FINAL — fondo image2 con paralaje sutil               │ ← único paralaje del sitio
│  H2 + subtexto + [Pedir cotización] (Escribir por WhatsApp) │
├────────────────────────────────────────────────────────────┤
│  FOOTER 4 columnas · © · aviso de privacidad · redes        │
└────────────────────────────────────────────────────────────┘
        ┃ ← EL TRAZO recorre toda la página, se dibuja con el scroll
                                                    ( ✚ ) ← flotante WA + chatbot
```

### 7.2 — PÁGINAS WEB (desktop) — la página que tiene que impresionar

```
┌────────────────────────────────────────────────────────────┐
│ [LOGO]  …nav…                                    [Cotizar] │
├────────────────────────────────────────────────────────────┤
│  INNOVACIÓN DIGITAL · PÁGINAS WEB                          │
│  H1: Páginas web para empresas: cómprala o réntala         │ ← reveal por líneas
│  "Estás viendo un ejemplo ahora mismo…"                    │ ← la línea clave
│  [Ver paquetes]  (Ver ejemplos en vivo)                    │
├────────────────────────────────────────────────────────────┤
│  H2: El 90% de las páginas de la región son un folleto…    │ ← fade-up
╲────────────────────────────────────────────────────────────╱
│  H2: Dos formas de tenerla                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐      │
│  │ SÉ DUEÑO              │  │ RENTA        ★ popular│      │ ← borde con gradiente en B
│  │ pago único            │  │ mensualidad fija      │      │
│  │ ✓ ✓ ✓ ✓ ✓             │  │ ✓ ✓ ✓ ✓ ✓             │      │
│  │ [Cotizar]             │  │ [Ver paquetes]        │      │
│  └───────────────────────┘  └───────────────────────┘      │
├────────────────────────────────────────────────────────────┤
│  #paquetes   H2: Tres paquetes de renta                    │
│                                                            │
│      ╱‾‾‾‾╲      ┌────────────┐      ╱‾‾‾‾╲                 │ ← CARRUSEL 3D (CSS puro)
│     ╱ Esen ╲     │  IMPULSO ★ │     ╱ Auto ╲                │   laterales: rotateY ±32°,
│    │  cial  │    │            │    │ ridad  │               │   translateZ -180px, op .55
│     ╲      ╱     │  $Y / mes  │     ╲      ╱                │   centro: escala 1, borde
│      ╲____╱      │  [Elegir]  │      ╲____╱                 │   con --gradiente
│                  └────────────┘                            │
│           ‹   ● ○ ○   ›   (drag / swipe / teclado)          │
│   ▸ Ver tabla comparativa completa  (details, accesible)    │
├────────────────────────────────────────────────────────────┤
│  #demos  H2: Míralas funcionando                           │
│              [ Escritorio | Teléfono ]                     │ ← toggle cambia el marco
│   ┌──────────────────────────────────────┐   ┌────┐        │
│   │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │   │ ▁▁ │        │ ← marco dibujado en CSS
│   │ │   iframe del demo (lazy)         │ │   │ ▕▏ │        │   fallback: captura +
│   │ │                                  │ │   │ ▕▏ │        │   auto-scroll en hover
│   │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │   └────┘        │
│   └──────────────────────────────────────┘                 │
│              ‹  demo 1 · demo 2 · demo 3  ›                │
├────────────────────────────────────────────────────────────┤
│  H2: Qué incluye siempre  — 7 ítems en grid                │
├────────────────────────────────────────────────────────────┤
│  H2: Cómo trabajamos  — 01 → 02 → 03 → 04                  │ ← aquí la numeración SÍ informa
│  (línea de progreso conectando los 4 pasos = EL TRAZO)     │   (es una secuencia real)
├────────────────────────────────────────────────────────────┤
│  H2: Preguntas frecuentes  — acordeón <details>            │ ← FAQPage schema
├────────────────────────────────────────────────────────────┤
│  CTA FINAL: ¿Empezamos por la tuya?                        │
├────────────────────────────────────────────────────────────┤
│  FOOTER                                                    │
└────────────────────────────────────────────────────────────┘
```

### 7.3 — MOBILE (mismo orden, 1 columna, tap targets ≥48px)

```
INICIO                          PÁGINAS WEB
[ ☰   LOGO      (Cotizar) ]     [ ☰   LOGO      (Cotizar) ]
[ VIDEO HERO (o poster) ]       [ H1 · subtexto ]
[ H1 ]                          [ CTAs apilados, ancho completo ]
[ subtexto ]                    [ PROBLEMA ]
[ Cotizar mi proyecto ]  ancho  ├─ corte diagonal ─┤
[ Ver lo que hacemos ]   100%   [ Tarjeta: SÉ DUEÑO ]
[ barra confianza ] scroll-x    [ Tarjeta: RENTA ★ ]
├─ corte diagonal ─┤            [ PAQUETES ]
[ PROBLEMA ]                      → sin 3D: carrusel
[ Bloque PUBLICIDAD ]               horizontal con
[ Bloque INNOVACIÓN ]               scroll-snap, 1 a la vez
[ 9 razones (1 col) ]           [ tabla comparativa:
[ Trabajo reciente ] scroll-x     scroll-x, 1ª col fija ]
[ CTA final ]                   [ DEMOS: solo marco de
[ FOOTER acordeón ]               teléfono, sin toggle ]
        ┃ trazo 2px             [ Qué incluye · 1 col ]
   borde izquierdo              [ Cómo trabajamos: vertical ]
              ( ✚ )             [ FAQ acordeón ]
                                [ CTA final ]
```

**Notas de movimiento en mobile:** sin paralaje, sin 3D, sin conteo de números si `saveData` está activo. El trazo se reduce a una línea de 2px en el borde izquierdo. El flotante se oculta cuando el CTA final entra en viewport.

---

## 8. LO QUE NECESITO DE TI PARA CERRAR

Sin esto no se puede publicar (el resto ya está resuelto):

| # | Qué | Dónde impacta |
|---|---|---|
| 1 | **Precios y contenido exacto de los 3 paquetes de renta** + precio o rango de la venta | Carrusel 3D, tabla, FAQ, schema `Offer` |
| 2 | **Política de renta**: ¿contrato mínimo? ¿el cliente puede comprarla después? ¿qué pasa si se va? | Tarjeta de renta y FAQ (son las 2 objeciones que más matan la venta) |
| 3 | **3 URLs de demos** ya desplegadas + confirmar si permiten iframe | Sección de demos |
| 4 | **3 proyectos reales** con foto, cliente, qué se hizo y un dato de resultado | Trabajo reciente (Inicio) |
| 5 | **Correo oficial**: ¿`ventas@disenartemx.com` o `ventas@rotulosdisenarte.com`? | Formulario, footer, schema |
| 6 | **Dirección exacta y horario** | Mapa y `LocalBusiness` |
| 7 | **Texto del aviso de privacidad** | Obligatorio por LFPDPPP |
| 8 | **¿Tienes licencia web de Creato Display?** Si no, arrancamos con Outfit | Tipografía |
| 9 | **Plazo real de entrega** de una página web | FAQ (pregunta 4) |
| 10 | **Fotos de producto instalado** (señalética, tuberías, tableros, flotillas, láser) | Toda la página de Publicidad |
| 11 | **El isotipo en SVG vectorial** (no PNG) — es la base para extruir la escultura y para trazar el canal | Hero de Inicio |
| 12 | **Quién produce el hero:** ¿Blender, o la ruta de ambiente con IA + bolita en SVG? | Define el calendario de producción |

**Lo que puedes darme después, sin frenar el desarrollo:** la lista definitiva de "otros servicios digitales" (la sección está construida para que la edites en un arreglo), los testimonios y los logos de clientes.

---

### Siguiente paso sugerido
1. Lee y edita este documento — sobre todo la sección 3 (copy) y la 1.4 (paleta).
2. Contesta las 10 filas de la sección 8.
3. Produce el hero: genera la imagen base con los prompts de la 5.4, elige la de canal más legible y sigue el camino de la 5.3 que te acomode.
4. Pega el bloque de la sección 6 en Claude Design junto con los assets.
5. Audita el resultado contra la sección 6.12 (Do's & Don'ts) antes de publicar.
