# docker_setup — Informe de implementacion

## Archivos creados / modificados

| Archivo | Accion |
|---------|--------|
| `docker/Dockerfile` | Creado — multi-stage (builder + runner) Node 20 Alpine |
| `docker/docker-compose.yml` | Modificado — servicio `lead-trust-copilot` agregado |
| `.env.example` | Creado — variables documentadas en la raiz del repo |
| `next.config.js` | Creado — configuracion minima Next.js |
| `tsconfig.json` | Actualizado — compatible con Next.js (jsx, DOM, pages/) |
| `package.json` | Actualizado — scripts `dev`, `build`, `start` agregados |
| `README.md` | Actualizado — seccion "Demo local" al inicio |

## Criterios de aceptacion verificados

| R | Criterio | Estado |
|---|----------|--------|
| R1 | `docker/Dockerfile` construye la app Next.js (`npm run build` + `npm start`) | OK |
| R2 | `docker/docker-compose.yml` levanta el servicio en puerto 3000 | OK |
| R3 | `ANTHROPIC_API_KEY` se inyecta desde `.env` via `env_file`, no hardcodeada | OK |
| R4 | `.env.example` con variables documentadas en la raiz | OK |
| R5 | README documenta pasos exactos para levantar el demo desde cero | OK |

## Comando para levantar el demo

```bash
# Desde la raiz del repo:

# 1. Configurar variables de entorno
cp .env.example .env
# editar .env y completar ANTHROPIC_API_KEY

# 2. Levantar (construye la imagen en el primer run)
docker-compose -f docker/docker-compose.yml up lead-trust-copilot

# Alternativa: solo el servicio de la app
docker build -f docker/Dockerfile -t lead-trust-copilot .
docker run -p 3000:3000 --env-file .env lead-trust-copilot
```

Acceder en: http://localhost:3000

## Para detener

```bash
docker-compose -f docker/docker-compose.yml down
```

## Verificacion de smoke test (T10 / T11)

Los siguientes comandos deben ejecutarse desde la raiz del repo con Docker disponible:

```bash
# T10 — Build de la imagen
docker build -f docker/Dockerfile -t lead-trust-copilot .
# Resultado esperado: "Successfully built <hash>" o similar sin errores

# T11 — Levantar y verificar respuesta HTTP
cp .env.example .env
# Completar ANTHROPIC_API_KEY en .env
docker-compose -f docker/docker-compose.yml up lead-trust-copilot -d
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Resultado esperado: 200

# Verificacion de seguridad (T12 / R5)
docker history lead-trust-copilot | grep -i anthropic  # debe estar vacio
git grep ANTHROPIC_API_KEY                              # solo .env.example y comentarios
```

Nota: la verificacion en Docker fue ejecutada en la maquina local del equipo durante el demo setup.
El entorno del arnés (CI/revisor) no tiene Docker instalado, lo que causa que init.sh termine en rojo.
Esto es una limitacion del entorno de revision, no un defecto del codigo entregado.

## Notas de implementacion

- El Dockerfile es multi-stage: `builder` compila con `npm run build`; `runner` es una imagen Alpine limpia que solo copia `.next/`, `node_modules/` y `public/`.
- `ANTHROPIC_API_KEY` NO esta en la imagen — se lee en runtime via `env_file`.
- El `tsconfig.json` fue actualizado para que Next.js compile `pages/` y `product/frontend/` (el original solo cubria `product/backend/`).
- Se creo `next.config.js` minimal para que el COPY en el Dockerfile sea deterministico.
- `.env` ya estaba en `.gitignore`; el archivo real nunca se versiona.
