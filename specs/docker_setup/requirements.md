# Requirements — docker_setup

Feature: Docker Compose para Demo Local
Proyecto: lead-trust-copilot
ID: F6

---

## R1

El sistema DEBE contener el archivo `docker/Dockerfile` que ejecuta
`npm run build` en la etapa de construcción y `npm start` como comando
de arranque del contenedor.

**Verificable mediante:** inspección de `docker/Dockerfile` — presencia de
`RUN npm run build` en la etapa `builder` y `CMD ["npm", "start"]` en la
etapa `runner`.

---

## R2

El sistema DEBE construir la imagen con una estrategia multi-stage que separe
la etapa de compilación (`builder`) de la imagen de producción (`runner`),
usando `node:20-alpine` como imagen base en ambas etapas.

**Verificable mediante:** `docker build -f docker/Dockerfile -t lead-trust-copilot .`
debe completar sin errores produciendo una imagen con solo los artefactos
necesarios para `next start`.

---

## R3

El sistema DEBE contener el archivo `docker/docker-compose.yml` con un
servicio `lead-trust-copilot` que, al ejecutar `docker-compose up`, exponga
el puerto `3000` del contenedor en el puerto `3000` del host.

**Verificable mediante:** `docker-compose -f docker/docker-compose.yml up lead-trust-copilot`
seguido de `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` debe
retornar un código HTTP en el rango 200-399 o la página de la aplicación.

---

## R4

El sistema DEBE inyectar `ANTHROPIC_API_KEY` en el contenedor en tiempo de
ejecución usando la directiva `env_file` del compose, apuntando al archivo
`.env` en la raíz del repositorio.

**Verificable mediante:** `docker/docker-compose.yml` contiene `env_file: - ../.env`
para el servicio `lead-trust-copilot`; el `docker/Dockerfile` NO debe contener
la cadena `ANTHROPIC_API_KEY` en ningún `ENV` estático.

---

## R5

El sistema NO DEBE incluir el valor real de `ANTHROPIC_API_KEY` en ninguna
capa de la imagen Docker ni en ningún archivo versionado en el repositorio.

**Verificable mediante:** `docker history lead-trust-copilot` y `git grep
ANTHROPIC_API_KEY` no deben revelar ningún valor concreto de la clave (solo
el nombre de la variable en comentarios o `.env.example`).

---

## R6

El sistema DEBE contener el archivo `.env.example` en la raíz del repositorio
con todas las variables de entorno requeridas documentadas y con valores vacíos
o de ejemplo.

**Verificable mediante:** `cat .env.example` debe mostrar al menos la variable
`ANTHROPIC_API_KEY=` con una línea de comentario explicativa.

---

## R7

CUANDO un desarrollador clone el repositorio en una máquina limpia, el
`README.md` DEBE documentar los pasos exactos para levantar el demo,
incluyendo: copiar `.env.example` a `.env`, completar `ANTHROPIC_API_KEY`
y ejecutar el comando `docker-compose` correspondiente.

**Verificable mediante:** el `README.md` contiene una sección de demo local
con los tres pasos mencionados (cp, edición de `.env`, `docker-compose up`).

---

## R8

El sistema DEBE crear el directorio `public/` dentro del contexto de
construcción si no existe, para que el paso `COPY --from=builder /app/public`
no falle cuando la carpeta esté ausente en el repositorio.

**Verificable mediante:** `docker build -f docker/Dockerfile -t lead-trust-copilot .`
completa sin errores en un repositorio donde `public/` no existe previamente.
