# Guión del video demo — Lead Trust Copilot

> Guión narrado para grabar `deliverables/demo.mp4`. Duración objetivo: **150 segundos** (rango aceptable 120-240 s). Idioma: español. Voice-over o subtítulos (ver [`recording-tips.md`](recording-tips.md)).

---

## Antes de grabar (checklist)

Ejecutar de arriba hacia abajo. Si alguno falla, no grabes todavía.

- [ ] `git status` limpio. Cualquier cambio sin commitear puede arruinar el shot.
- [ ] `.env` en la raíz del repo con `ANTHROPIC_API_KEY=sk-ant-...` válida. Probar con `echo $ANTHROPIC_API_KEY` no aplica — la variable se inyecta vía `env_file` en `docker-compose.yml` (ver [`README.md`](../README.md) §3).
- [ ] App levantada: `docker compose -f docker/docker-compose.yml up lead-trust-copilot`. Esperar a ver "ready - started server on 0.0.0.0:3000" en la terminal.
- [ ] Abrir <http://localhost:3000> en el navegador. Verificar que aparece el dashboard con la cola de **15 leads** poblada (mock cargado desde [`product/backend/data/leads_mock.json`](../product/backend/data/leads_mock.json)).
- [ ] Hacer click en al menos un lead para precalentar la API de Claude — el primer `POST /api/leads/analyze` puede tardar ~3-5 s mientras Anthropic hace cold start. Refrescar la página para limpiar el estado antes de grabar.
- [ ] Cerrar pestañas/notificaciones que puedan asomar en la captura (Slack, mail, etc.).
- [ ] Resolución del display: **1920×1080** (Full HD). Zoom del navegador al **100 %**.
- [ ] Micrófono probado (si vas a hacer voice-over en vivo). Alternativa: grabar el video sin voz y agregar narración o subtítulos en post.
- [ ] Herramienta de grabación lista (QuickTime, OBS o Loom). Ver opciones en [`recording-tips.md`](recording-tips.md).
- [ ] Tener este guión abierto en una pantalla secundaria o impreso. **No** lo dejes visible en la grabación.

---

## Duración total objetivo

| Bloque | Tiempo aproximado | Acumulado |
|--------|-------------------|-----------|
| Intro + Escena 1 (home priorizada) | 30 s | 0:00 – 0:30 |
| Escena 2 (panel de detalle del lead) | 45 s | 0:30 – 1:15 |
| Escena 3 (simulador en vivo: interesado + spam) | 60 s | 1:15 – 2:15 |
| Escena 4 (cierre: app corriendo en `localhost:3000` desde Docker) | 15 s | 2:15 – 2:30 |
| **Total** | **~150 s** | dentro de 120-240 |

---

## Escena 1 — Home del dashboard con leads priorizados por Trust Score

**Timestamp:** `00:00 – 00:30`

**Qué se ve en pantalla:**
- Navegador en <http://localhost:3000>. Dashboard completo: barra lateral del `DashboardLayout`, panel `SimulatorPanel` arriba a la izquierda, lista `LeadsFeed` con los 15 leads ordenados de mayor a menor Trust Score.
- A la derecha, el placeholder "Selecciona un lead del feed para ver el análisis IA detallado".
- Mostrar bien los badges de color: verde (>75), amarillo (40-75), rojo (<40), y los tags de urgencia (Alta / Media / Baja).

**Destacar visualmente:**
- Mover el cursor lentamente sobre los tres primeros leads de la cola — los de mayor Trust Score — para que se vea cómo el orden refleja el potencial.
- Pasar al final de la lista para mostrar contraste con los leads de bajo score (mensajes vagos tipo "info dpto", "precio?", "alquiler").

**Voice-over (texto exacto):**

> "Esto es Lead Trust Copilot. Un dashboard agéntico para inmobiliarias que recibe leads entrantes y los prioriza con inteligencia artificial. Cada lead se clasifica por Trust Score de cero a cien y se ordena en una cola visual. Los verdes son leads con alto potencial de cierre. Los amarillos requieren más calificación. Los rojos suelen ser mensajes vagos o consultas frías que pueden esperar."

---

## Escena 2 — Selección de un lead y panel de detalle con `ai_summary` + `suggested_action`

**Timestamp:** `00:30 – 01:15`

**Qué se ve en pantalla:**
- Hacer click en un lead de alto Trust Score. **Sugerencia:** `lead-02` (Claudia Benítez — casa en San Isidro, presupuesto 450 000 USD, "precalificación bancaria, firma en 60 días"). Alternativa: `lead-01` (Martín García — departamento en Palermo / Belgrano, presupuesto 130 000 USD, "listo para cerrar rápido").
- Aparece el `LeadDetailPanel` a la derecha. Mientras carga, mostrar brevemente el **skeleton/shimmer UI**.
- Cuando llega la respuesta, destacar en este orden:
  1. **Trust Score Badge** circular o radial con color semántico.
  2. **Conversion Score** y **Urgency Score** como barras o badges secundarios.
  3. **Análisis IA**: el párrafo `ai_summary` generado por Claude (2-3 oraciones en español).
  4. **Acción Recomendada** (`suggested_action`) con el botón "Copiar al portapapeles".
  5. **Propiedades coincidentes** del catálogo (resolvidas de `property_match_ids`).

**Destacar visualmente:**
- Hacer click en el botón "Copiar al portapapeles" para mostrar feedback visual (toast / cambio de estado del botón). Si el feedback es sutil, pausar un beat.
- Cursor encima del `ai_summary` mientras se narra esa parte.

**Voice-over (texto exacto):**

> "Cuando seleccionamos un lead, Claude lo analiza en tiempo real. Devuelve un JSON estricto con tres scores: Trust, Conversion y Urgency. Genera un resumen ejecutivo del perfil del lead y, sobre todo, una acción recomendada concreta y copiable, lista para que el agente comercial la use. Además, cruza el lead con el catálogo de propiedades del backend y sugiere las que mejor encajan con su zona, presupuesto y tipo. Todo viene en una sola llamada a la API."

---

## Escena 3 — Simulador en vivo con un lead interesado y uno spam

**Timestamp:** `01:15 – 02:15`

**Qué se ve en pantalla:**
- Volver el foco al `SimulatorPanel` arriba a la izquierda. Tiene dos botones: **"Simular Lead Interesado"** y **"Simular Lead Spam"**.
- **Primer click:** "Simular Lead Interesado". Mostrar el estado de carga visual mientras se ejecuta el ciclo `POST /api/leads/simulate` → análisis IA → inserción en la cola. Cuando llega la respuesta, el nuevo lead aparece animado en la **posición que le toca según su Trust Score** (no necesariamente arriba — depende del score que devuelva Claude). Resaltar la transición.
- **Segundo click:** "Simular Lead Spam". El lead generado debería tener `is_spam: true` y aparecer en la **sección secundaria "Leads Spam Detectados"** al fondo de la columna, con fondo rojo oscuro e ícono de alerta ⚠.

**Destacar visualmente:**
- Antes del primer click, hacer una pausa breve para que el espectador anticipe.
- Apuntar con el cursor a la posición donde aparece el nuevo lead interesado.
- Después del segundo click, scrollear hasta la sección "Leads Spam Detectados" para que se vea el contraste de fondo rojo + ícono.

**Voice-over (texto exacto):**

> "Para mostrar cómo se comporta el sistema con tráfico real, agregamos un simulador. Este botón inyecta un lead interesado: el pipeline lo analiza, le asigna un Trust Score y lo inserta en la posición exacta que le corresponde en la cola. Y este otro botón inyecta un lead spam: Claude lo detecta, devuelve `is_spam` verdadero, y la app lo manda automáticamente a una sección diferenciada al fondo, con fondo rojo y un ícono de alerta. El agente comercial nunca pierde tiempo con basura."

---

## Escena 4 — La app corriendo en `localhost:3000` desde `docker compose up`

**Timestamp:** `02:15 – 02:30`

**Qué se ve en pantalla:**
- Alt-tab a la terminal donde corre `docker compose -f docker/docker-compose.yml up lead-trust-copilot`. Mostrar la salida con `Local: http://localhost:3000` y, si es posible, las líneas de los `POST /api/leads/analyze` y `POST /api/leads/simulate` recientes en el log.
- Alt-tab de vuelta al navegador para reforzar que el dashboard que se vio en las escenas anteriores es el mismo proceso del contenedor.
- Opcional: encuadrar también la URL bar del navegador con `localhost:3000` visible.

**Destacar visualmente:**
- Cursor sobre la línea del log que dice "ready" o "started server on 0.0.0.0:3000".
- Si vas a mostrar el `docker-compose.yml`, abrirlo solo medio segundo — no es el foco.

**Voice-over (texto exacto):**

> "Todo lo que viste corre en un único contenedor Docker. Un `docker compose up` y el dashboard está en localhost tres mil, con la clave de Claude inyectada desde un `.env` y nunca hardcodeada. Cero ops, listo para demo. Eso es Lead Trust Copilot."

---

## Notas finales para el editor

- Si la grabación termina más larga de 240 s, **recortar la Escena 3** (es la que más se presta a edición): elegir el mejor de los dos clicks o acelerar las transiciones.
- Si queda más corta de 120 s, agregar 5-10 s al inicio mostrando la pestaña del archivo [`product/backend/services/ai_analyser.ts`](../product/backend/services/ai_analyser.ts) abierta en el editor — refuerza que el JSON estricto se fuerza desde el system prompt.
- Si grabás sin voz, sumar subtítulos quemados con el texto exacto del voice-over de cada escena (ver [`recording-tips.md`](recording-tips.md) §"Voice-over vs subtítulos").
- Verificar la duración final con: `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 deliverables/demo.mp4`. El número debe quedar entre 120 y 240.
