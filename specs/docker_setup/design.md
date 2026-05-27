# Design — docker_setup

Feature: Docker Compose para Demo Local
Proyecto: lead-trust-copilot
ID: F6

---

## 1. Archivos creados / modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `docker/Dockerfile` | Creado | Imagen multi-stage para Next.js 14 |
| `docker/docker-compose.yml` | Modificado | Servicio `lead-trust-copilot` añadido al compose existente del arnés |
| `.env.example` | Creado | Plantilla de variables en la raíz del repo |
| `next.config.js` | Creado | Configuración mínima de Next.js requerida por `npm run build` |
| `tsconfig.json` | Actualizado | Ampliado para incluir `pages/` y `product/frontend/` en la compilación |
| `package.json` | Actualizado | Scripts `dev`, `build` y `start` añadidos para que el Dockerfile pueda invocarlos |
| `README.md` | Actualizado | Sección "Demo local" añadida al inicio con los tres pasos de arranque |

---

## 2. Estructura del Dockerfile (multi-stage)

### Etapa `builder` — `node:20-alpine`

Responsabilidad: compilar la aplicación Next.js.

Pasos clave:
1. `COPY package.json package-lock.json* ./` → capa de dependencias cacheada.
2. `RUN npm ci` → instalación determinista con lockfile.
3. `COPY pages/ product/ tailwind.config.js tsconfig.json next.config.js ./` → fuentes.
4. `RUN mkdir -p public` → garantiza que Next.js no falle si `public/` no existe en el repo (R8).
5. `RUN npm run build` → genera `.next/` con la build de producción.

Variable `NODE_ENV=production` se fija en esta etapa para que Next.js aplique
optimizaciones de producción en tiempo de build.

`ANTHROPIC_API_KEY` NO se declara aquí. `next build` no la necesita porque la
key solo se consume en API routes que se ejecutan en runtime (R5).

### Etapa `runner` — `node:20-alpine`

Responsabilidad: imagen liviana lista para `next start`.

Solo se copian los artefactos necesarios desde `builder`:
- `package.json` — necesario para que `npm start` resuelva el script.
- `node_modules/` — dependencias de producción.
- `.next/` — build compilada.
- `public/` — assets estáticos.

`CMD ["npm", "start"]` lanza `next start` en el puerto 3000 por defecto (R1).

**Beneficio del multi-stage:** la imagen final no contiene el código fuente,
las herramientas de compilación ni las devDependencies, reduciendo su tamaño
y superficie de ataque (R2).

---

## 3. Inyección de ANTHROPIC_API_KEY en runtime

La key se lee desde `.env` en la raíz del repo vía la directiva `env_file`
del servicio compose:

```yaml
env_file:
  - ../.env
```

El path `../.env` es relativo al archivo `docker/docker-compose.yml`
(un nivel arriba apunta a la raíz del repo).

Este mecanismo garantiza que:
- La key nunca se bake en la imagen (R5).
- El desarrollador solo tiene que completar `.env` una vez (R6, R7).
- El compose no necesita saber el valor de la key en tiempo de definición (R4).

---

## 4. Servicio lead-trust-copilot en docker-compose.yml

El servicio se añade al `docker/docker-compose.yml` existente del arnés
(que ya define los servicios `harness`, `app` y `test`).

Propiedades clave:

| Propiedad | Valor | Justificación |
|-----------|-------|---------------|
| `build.context` | `..` | El contexto de build debe ser la raíz del repo para que el Dockerfile acceda a `pages/`, `product/`, etc. |
| `build.dockerfile` | `docker/Dockerfile` | Ruta relativa al contexto (raíz). |
| `ports` | `"3000:3000"` | Puerto estándar de Next.js; sin colisión con `app` (8080) ni `harness` (sin puerto). |
| `env_file` | `../.env` | Inyección segura de la API key (R4). |
| `environment.NODE_ENV` | `production` | Asegura modo producción incluso si `.env` lo omite. |
| `restart` | `unless-stopped` | El servicio se reinicia automáticamente ante fallos durante la demo. |

El servicio NO se añade al perfil `product` para diferenciarlo de los servicios
del arnés y poder levantarlo independientemente con:
```bash
docker-compose -f docker/docker-compose.yml up lead-trust-copilot
```

---

## 5. .env.example

El archivo vive en la raíz del repo (no en `docker/`) para que sea el punto
único de referencia de variables de entorno del proyecto, coherente con el
archivo `.env` real que también vive en la raíz.

Variables documentadas:

| Variable | Descripción |
|----------|-------------|
| `GITHUB_EXPECTED_USER` | Login de GitHub esperado (usado por `init.sh`). Opcional. |
| `ANTHROPIC_API_KEY` | Clave para la Claude API. Requerida para el pipeline de IA. |
| `APP_PORT` | Puerto host del servicio `app` del arnés (perfil `product`). |

---

## 6. Alternativas descartadas

### A — Imagen single-stage

Usar una sola etapa `FROM node:20-alpine` con `npm install && npm run build &&
npm start` en la misma imagen.

**Razón del descarte:** la imagen resultante incluiría el código fuente, las
devDependencies y la caché de compilación, produciendo imágenes 3-5x más
grandes. En un entorno de demo donde la imagen se transfiere o se construye
en una máquina limpia, el tamaño importa. El multi-stage es la práctica
estándar de Next.js en producción.

### B — Variables de entorno como ARG de build

Pasar `ANTHROPIC_API_KEY` como `--build-arg` de Docker para que esté disponible
durante `npm run build`.

**Razón del descarte:** los `ARG` de Docker quedan registrados en el historial
de capas (`docker history`), exponiendo la key a cualquiera que inspeccione la
imagen. Además, Next.js no necesita la key en tiempo de build (solo en runtime
cuando las API routes reciben peticiones), por lo que no hay ninguna razón
funcional para inyectarla antes de `npm start`.

### C — Archivo .env dentro de docker/

Mantener `.env.example` dentro de `docker/` junto al Dockerfile y el compose.

**Razón del descarte:** la convención del arnés especifica en
`docs/conventions.md` que las variables viven en `.env` en la raíz del repo.
Colocar `.env.example` en `docker/` crearía confusión sobre dónde crear el
`.env` real, y obligaría a ajustar el path `env_file` en el compose.
