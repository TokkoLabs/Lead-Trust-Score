# Tasks — docker_setup

Feature: Docker Compose para Demo Local
Proyecto: lead-trust-copilot
ID: F6

Cada tarea está formulada en imperativo para que el reviewer pueda verificar
que el trabajo fue realizado. El implementer marca `[x]` al completar cada una.

---

- [x] T1 — Crear `docker/Dockerfile` con etapa `builder` (`node:20-alpine`) que ejecute `npm ci` y `npm run build`, garantizando que `public/` existe antes del build. Cubre: R1, R2, R8.

- [x] T2 — Añadir etapa `runner` (`node:20-alpine`) en `docker/Dockerfile` que copie solo `package.json`, `node_modules/`, `.next/` y `public/` desde `builder`, exponga el puerto 3000 y defina `CMD ["npm", "start"]`. Cubre: R1, R2.

- [x] T3 — Verificar que `docker/Dockerfile` no contenga ninguna instrucción `ENV ANTHROPIC_API_KEY` con valor concreto ni ningún `ARG` que reciba la key. Cubre: R5.

- [x] T4 — Añadir el servicio `lead-trust-copilot` en `docker/docker-compose.yml` con `build.context: ..`, `build.dockerfile: docker/Dockerfile`, `ports: ["3000:3000"]`, `env_file: [../.env]`, `environment.NODE_ENV: production` y `restart: unless-stopped`. Cubre: R3, R4.

- [x] T5 — Crear `.env.example` en la raíz del repositorio con las variables `GITHUB_EXPECTED_USER`, `ANTHROPIC_API_KEY` y `APP_PORT` documentadas con comentarios explicativos y valores vacíos o por defecto. Cubre: R6.

- [x] T6 — Crear `next.config.js` con la configuración mínima de Next.js (`reactStrictMode: true`) para que el `COPY` del Dockerfile sea determinista y `npm run build` no falle por archivo ausente. Cubre: R1, R2.

- [x] T7 — Actualizar `tsconfig.json` para incluir `pages/` y `product/frontend/` en la compilación de TypeScript, de modo que `npm run build` compile todos los archivos de la aplicación. Cubre: R1.

- [x] T8 — Actualizar `package.json` añadiendo los scripts `dev`, `build` y `start` apuntando a los comandos de Next.js, para que el Dockerfile pueda invocar `npm run build` y `npm start`. Cubre: R1.

- [x] T9 — Actualizar `README.md` con una sección "Demo local" al inicio que documente los tres pasos exactos: (1) `cp .env.example .env`, (2) completar `ANTHROPIC_API_KEY` en `.env`, (3) `docker-compose -f docker/docker-compose.yml up lead-trust-copilot`. Cubre: R7.

- [x] T10 — Verificar que `docker build -f docker/Dockerfile -t lead-trust-copilot .` completa sin errores desde la raíz del repositorio. Cubre: R1, R2, R8.

- [x] T11 — Verificar que `docker-compose -f docker/docker-compose.yml up lead-trust-copilot` levanta el servicio y la aplicación responde en `http://localhost:3000`. Cubre: R3, R4.

- [x] T12 — Verificar que `docker history lead-trust-copilot` y `git grep ANTHROPIC_API_KEY` no revelan ningún valor concreto de la clave. Cubre: R5.

---

## Trazabilidad

| Requirement | Tasks que lo cubren |
|-------------|---------------------|
| R1 | T1, T2, T6, T7, T8, T10 |
| R2 | T1, T2, T10 |
| R3 | T4, T11 |
| R4 | T4, T11 |
| R5 | T3, T12 |
| R6 | T5 |
| R7 | T9 |
| R8 | T1, T10 |
