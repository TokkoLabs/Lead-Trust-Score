# Tips de grabación — `demo.mp4`

> Una sola página. Cubre herramientas, formato, voice-over y peso del archivo. Complementa [`script.md`](script.md) y [`README.md`](README.md).

---

## Herramientas sugeridas

| Herramienta | Plataforma | Por qué usarla |
|-------------|------------|----------------|
| **QuickTime Player** (File → New Screen Recording) | macOS (preinstalado) | Gratis, exporta MP4 H.264 nativo, captura audio del micrófono interno. Suficiente para una demo de 2-4 minutos. |
| **OBS Studio** (<https://obsproject.com>) | macOS / Linux / Windows | Gratis, open source. Permite escenas, mezcla de audio (micrófono + audio del sistema), y exportar directo a MP4. Recomendado si querés más control. |
| **Loom** (<https://www.loom.com>) | Web + apps | Free tier para videos cortos. Sube a la nube automáticamente; útil si querés un link rápido además del MP4 commiteado. Descargar el MP4 desde la UI para incluirlo en el repo. |

> Si no sabés cuál usar y estás en macOS: **QuickTime**. Hace el trabajo y exporta el formato correcto sin tocar nada.

---

## Formato de salida

- **Contenedor:** MP4.
- **Codec de video:** H.264 (AVC). Es el más compatible con players y con `ffprobe`.
- **Codec de audio:** AAC.
- **Resolución:** 1920×1080 (Full HD). No usar 4K — el archivo se vuelve enorme y no aporta a una demo de UI.
- **Framerate:** 30 fps es suficiente. 60 fps solo si tu herramienta lo da gratis.
- **Bitrate:** dejar el preset por defecto de la herramienta (típicamente 8-12 Mbps en 1080p). No hace falta tunear.

**Verificar formato y duración tras exportar:**

```bash
ffprobe -v error -show_format -show_streams deliverables/demo.mp4
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 deliverables/demo.mp4
```

La duración debe estar entre **120 y 240 segundos** (acceptance viñeta 2 de la feature 7).

---

## Voice-over vs subtítulos

Tenés dos opciones — elegí una:

1. **Voice-over en vivo** mientras grabás la pantalla. Más natural y rápido si tu micrófono es decente y leíste el guión un par de veces antes. Usar el texto exacto de cada escena en [`script.md`](script.md).

2. **Grabar sin audio y agregar subtítulos en post.** Si el micrófono no rinde o preferís evitar el voice-over: grabá solo la pantalla, después agregás subtítulos quemados con el texto exacto del voice-over del guión. Herramientas para subtítulos:
   - **iMovie** (macOS, gratis) — Add → Title.
   - **CapCut** (multiplataforma, gratis) — Caption.
   - **OBS** con plugins de overlay si grabás y editás en el mismo flujo.

El acceptance pide "narración (voz o subtítulos)" — cualquiera de los dos cumple, pero **una de las dos tiene que estar**.

---

## Peso del archivo y `git-lfs`

Un video MP4 de 2-4 min en 1080p suele pesar **entre 20 y 80 MB**. Si pasa de 50 MB GitHub rechaza el push sin LFS.

**El repo ya está configurado** — `.gitattributes` raíz contiene:

```
deliverables/*.mp4 filter=lfs diff=lfs merge=lfs -text
```

Lo que falta es **instalar git-lfs en tu máquina** (una sola vez) y commitear:

```bash
# 1. Instalar git-lfs (una vez por máquina)
brew install git-lfs        # macOS
# sudo apt install git-lfs  # Debian/Ubuntu
# Windows: https://git-lfs.com
git lfs install

# 2. Confirmar que el repo lo reconoce
git lfs track
#   deliverables/*.mp4 (.gitattributes)

# 3. Agregar el MP4 y verificar
git add deliverables/demo.mp4
git status
# El archivo debería aparecer como "Git LFS object" en el output detallado

# 4. Commitear y pushear
git commit -m "Add demo video (feature 7)"
git push
```

Si tu MP4 termina pesando **menos de 50 MB**, técnicamente podrías commitear sin LFS — pero igual conviene dejarlo en LFS para mantener el repo liviano y consistente con el acceptance.

---

## Errores comunes

- **"file ... is larger than 100 MB" al pushear:** olvidaste `git lfs install` o commiteaste `.gitattributes` después del MP4. Solución: `git lfs migrate import --include="deliverables/*.mp4"` y volver a pushear.
- **El video se ve "cuadrado" o pixelado:** estabas grabando en una resolución menor a 1080p. Re-exportar desde la herramienta seteando el output explícitamente.
- **El audio del voice-over se escucha en eco:** estabas capturando audio del sistema **y** del micrófono al mismo tiempo. En QuickTime: bajar el volumen del sistema. En OBS: silenciar la fuente de audio del sistema.
- **`ffprobe` reporta duración 0 o NaN:** el archivo quedó corrupto al exportar. Re-exportar con otro preset.
