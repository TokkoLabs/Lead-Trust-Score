# Entregables — Lead Trust Copilot

> Carpeta de artefactos finales del hackaton. Acompaña al [`README.md`](../README.md) raíz y a [`AI_USAGE.md`](../AI_USAGE.md).

---

## Inventario

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `demo.mp4` | **Pendiente — graba el humano** | Video MP4 de 2 a 4 minutos del producto en vivo: home priorizada por Trust Score, panel de detalle con `ai_summary` y `suggested_action`, simulador de leads (interesado y spam) y la app corriendo en `localhost:3000` desde `docker compose up`. |
| [`script.md`](script.md) | Listo | Guión narrado escena por escena, en español, con timestamps, qué mostrar en pantalla, texto exacto del voice-over y checklist "Antes de grabar". |
| [`recording-tips.md`](recording-tips.md) | Listo | Tips prácticos para grabar: herramientas (QuickTime, OBS, Loom), formato MP4 H.264 1920×1080, voice-over o subtítulos, y cómo manejar el peso del archivo con `git-lfs`. |

---

## Resumen del video planificado

- **Duración objetivo:** 120 a 240 segundos (2 a 4 minutos), verificable con `ffprobe deliverables/demo.mp4`.
- **Qué muestra (2-3 oraciones):** Lead Trust Copilot recibe leads inmobiliarios entrantes, los clasifica con Claude y los prioriza en un dashboard agéntico. El video recorre la home con la cola ordenada por Trust Score, abre el panel de detalle de un lead de alto potencial para mostrar el `ai_summary` y la `suggested_action`, dispara el simulador en vivo para inyectar un lead interesado y uno spam, y deja claro que todo corre con un único `docker compose -f docker/docker-compose.yml up` en `localhost:3000`.

---

## Antes de commitear el MP4 (instrucciones para el humano)

1. **Instalar `git-lfs` una sola vez en tu máquina:**

   ```bash
   git lfs install
   ```

   En macOS: `brew install git-lfs && git lfs install`. En Linux: `sudo apt install git-lfs && git lfs install`. En Windows: usar el instalador de <https://git-lfs.com>.

2. **El repo ya está configurado** para trackear `deliverables/*.mp4` por LFS. La línea relevante vive en [`.gitattributes`](../.gitattributes) raíz:

   ```
   deliverables/*.mp4 filter=lfs diff=lfs merge=lfs -text
   ```

   Esto se aplicará automáticamente al hacer `git add deliverables/demo.mp4`.

3. **Grabar siguiendo [`script.md`](script.md)** (duración 120-240 s, formato MP4 H.264, ver [`recording-tips.md`](recording-tips.md) para detalles).

4. **Commitear:**

   ```bash
   git add deliverables/demo.mp4
   git status                # confirma que aparece como "Git LFS object"
   git commit -m "Add demo video (feature 7)"
   git push
   ```

   Si el archivo supera 50 MB y `git push` falla con un error de tamaño, revisar que `git lfs install` se haya ejecutado en la máquina y que `.gitattributes` esté commiteado **antes** que el MP4.

---

## Mapeo a `feature_list.json` (feature 7 `deliverable_video_demo`)

| Acceptance | Cubierto por |
|------------|--------------|
| 1. `deliverables/demo.mp4` commiteado (git-lfs si >50 MB) | [`.gitattributes`](../.gitattributes) raíz + instrucciones de `git lfs install` arriba + [`recording-tips.md`](recording-tips.md). El MP4 lo graba y commitea el humano. |
| 2. Duración 120-240 s | Tabla "Inventario" arriba + sección "Duración total objetivo" en [`script.md`](script.md). |
| 3. Muestra las 4 escenas obligatorias | [`script.md`](script.md) §"Escena 1" a §"Escena 4". |
| 4. Narración con voz o subtítulos | [`script.md`](script.md) — cada escena incluye el texto exacto del voice-over en español. [`recording-tips.md`](recording-tips.md) §"Voice-over vs subtítulos". |
| 5. Listado del video con duración y resumen 2-3 oraciones | Este archivo (sección "Resumen del video planificado" arriba). |
