# Impl — Feature 7 `deliverable_video_demo`

> Feature 7 del backlog (`feature_list.json`): `layer: docs`, `sdd: false`, `status: in_progress`. **No** se marca `done` desde aquí; el MP4 lo graba el humano. Este informe documenta solo la parte automatizable (estructura `deliverables/`, guión, tips y configuración de `git-lfs`).

---

## Resumen de cambios

### Archivos creados

| Ruta | Rol |
|------|-----|
| `deliverables/README.md` | Índice de entregables; resumen del video planificado con duración (120-240 s) y 2-3 oraciones de descripción; instrucciones de `git lfs install` y mapeo acceptance → archivo. |
| `deliverables/script.md` | Guión completo del video en español. Sección "Antes de grabar" (checklist), tabla de duración objetivo (~150 s), 4 escenas con timestamp, descripción de pantalla, énfasis visual y texto exacto del voice-over. |
| `deliverables/recording-tips.md` | Página única con herramientas (QuickTime / OBS / Loom), formato MP4 H.264 1080p, voice-over vs subtítulos, peso del archivo y workflow con git-lfs. |

### Archivos modificados

| Ruta | Cambio |
|------|--------|
| `.gitattributes` (raíz) | Añadida la línea `deliverables/*.mp4 filter=lfs diff=lfs merge=lfs -text` con comentario explicativo. Mantiene la regla previa `*.sh text eol=lf`. |
| `README.md` (raíz) | **Sólo sección 7 "Entregables"**. La tabla ahora lista `deliverables/README.md`, `deliverables/script.md` y `deliverables/recording-tips.md` con descripciones; mantiene el bullet de `deliverables/demo.mp4` marcado como pendiente (graba el humano); enlaza `AI_USAGE.md` como link relativo. Resto del README intacto. |

### Archivos NO tocados (por regla dura del prompt)

- `product/`, `tests/`, `docker/`, `specs/`, `progress/current.md` — sin cambios.
- Otras secciones del `README.md` (§1-§6, §8) — sin cambios.
- `feature_list.json` — sin cambios (la feature 7 sigue en `in_progress`; no la marco `done`).
- No se ejecutó la app, no se levantó Docker, no se grabó nada.

---

## Mapeo acceptance (feature 7) → archivo

| # | Acceptance | Archivo / Sección |
|---|------------|-------------------|
| 1 | Existe `deliverables/demo.mp4` commiteado (usar git-lfs si supera 50 MB) | **Pendiente del humano** (grabación). Infra lista: `.gitattributes` configura LFS para `deliverables/*.mp4`; `deliverables/README.md` §"Antes de commitear el MP4" y `deliverables/recording-tips.md` §"Peso del archivo y git-lfs" documentan los pasos `git lfs install` + add + commit + push. |
| 2 | Duración 120-240 s (verificable con `ffprobe`) | `deliverables/README.md` §"Resumen del video planificado" (objetivo 120-240 s). `deliverables/script.md` §"Duración total objetivo" (tabla con ~150 s acumulados) y §"Notas finales para el editor" (comando `ffprobe` para verificar). `deliverables/recording-tips.md` §"Formato de salida" (idem). |
| 3 | Muestra las 4 escenas: (1) home priorizada, (2) detalle con `ai_summary` + `suggested_action`, (3) simulador con interesado + spam, (4) `localhost:3000` desde `docker compose up` | `deliverables/script.md` §"Escena 1" a §"Escena 4". Cada escena tiene timestamp, descripción de pantalla, énfasis visual y voice-over en español. IDs concretos sugeridos del dataset: `lead-02` (alto Trust Score, presupuesto 450 000 USD, "precalificación bancaria") como ejemplo de detalle; los leads spam reales en `leads_mock.json` son `lead-11`, `lead-12`, `lead-13`. |
| 4 | Narración (voz o subtítulos) sobre problema, solución y wow factor | `deliverables/script.md` — cada escena incluye el texto exacto del voice-over en español. `deliverables/recording-tips.md` §"Voice-over vs subtítulos" detalla las dos rutas (grabar con voz vs agregar subtítulos en post con iMovie / CapCut). |
| 5 | `deliverables/README.md` lista el video con duración y resumen 2-3 oraciones | `deliverables/README.md` §"Inventario" (tabla con `demo.mp4` y estado pendiente) + §"Resumen del video planificado" (duración 120-240 s + 3 oraciones que cubren el recorrido por las 4 escenas y mencionan `docker compose up`). |

---

## TODOs pendientes para el humano

Estos pasos cierran la feature 7 — solo el humano puede ejecutarlos:

1. **Instalar git-lfs una sola vez** en la máquina que vaya a hacer el commit:
   - macOS: `brew install git-lfs && git lfs install`
   - Linux (Debian/Ubuntu): `sudo apt install git-lfs && git lfs install`
   - Windows: instalador en <https://git-lfs.com> y luego `git lfs install`
2. **Levantar la app** con `docker compose -f docker/docker-compose.yml up lead-trust-copilot` y verificar `localhost:3000` (con `.env` y `ANTHROPIC_API_KEY` válida).
3. **Grabar `deliverables/demo.mp4`** siguiendo el orden y los textos de [`deliverables/script.md`](../deliverables/script.md). Duración objetivo ~150 s, rango aceptable 120-240 s. Formato MP4 H.264, 1920×1080.
4. **Verificar duración** con `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 deliverables/demo.mp4` y confirmar que cae entre 120 y 240.
5. **Commitear el MP4:** `git add deliverables/demo.mp4 && git commit -m "Add demo video (feature 7)" && git push`. Verificar con `git status` que aparece como Git LFS object antes del commit.
6. **(Opcional) Subtítulos** si el video se grabó sin voice-over: usar iMovie o CapCut con el texto exacto del voice-over de cada escena.
7. **Cerrar la feature:** el `leader` (junto al `reviewer`) marcará la feature 7 como `done` en `feature_list.json` una vez que `deliverables/demo.mp4` esté commiteado y `ffprobe` confirme la duración.

---

## Notas de verificación

- **No se ejecutó `./init.sh` ni `./docker/scripts/product-test.sh`** porque esta feature es `layer: docs` y no introduce código de producto ni tests. La verificación final del MP4 (existencia, duración, contenido) es manual y queda del lado del humano + reviewer.
- **Datos del producto consultados (sin inventar):**
  - 15 leads en [`product/backend/data/leads_mock.json`](../product/backend/data/leads_mock.json) (confirmado por lectura directa).
  - Leads de alto potencial sugeridos para la Escena 2: `lead-02` (Claudia Benítez, San Isidro, 450 000 USD, "precalificación bancaria, firma en 60 días") y `lead-01` (Martín García, Palermo/Belgrano, 130 000 USD, "listo para cerrar rápido").
  - Leads obviamente spam visibles en los mocks: `lead-11`, `lead-12`, `lead-13` (mensajes en mayúsculas, emails desechables, teléfonos inválidos).
  - El botón de simulación dispara `POST /api/leads/simulate` (verificado en [`product/frontend/components/SimulatorPanel.tsx`](../product/frontend/components/SimulatorPanel.tsx) líneas 27-58), no `POST /api/leads/analyze`. El guión describe el ciclo completo pero menciona "el pipeline" sin atarlo a una ruta específica para no confundir al espectador.
  - `SimulatorPanel` está montado en la **columna izquierda arriba del feed** (verificado en [`pages/index.tsx`](../pages/index.tsx) líneas 109-122). La Escena 3 lo refleja correctamente.
  - La sección secundaria de spam ("Leads Spam Detectados") aparece bajo el feed con fondo `red-950` e ícono ⚠ (verificado en [`pages/index.tsx`](../pages/index.tsx) líneas 124-150). El guión la describe acorde.
