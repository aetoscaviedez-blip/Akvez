# AKVEZ — imagen de despliegue para Google Cloud Run.
#
# No altera el comportamiento de la aplicación: reproduce exactamente el
# contrato de arranque que ya existe en el repositorio.
#
#   `npm run build`  →  dist/index.html + dist/assets/ (Vite) + dist/server.cjs (esbuild)
#   `npm start`      →  node dist/server.cjs
#
# El servidor lee el puerto del entorno a través de `server/shared/config/env.ts`
# (T-14 · ADR-04 §11), por lo que el PORT que inyecta Cloud Run se respeta sin
# tocar código, y sirve `dist/` como estático únicamente cuando
# NODE_ENV === "production" (`startServer.ts:23`).

# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Etapa 1 — build
#
# Necesita las devDependencies completas: `vite build` compila el frontend y
# `esbuild` empaqueta el backend. Nada de esta etapa llega a la imagen final.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Se copian primero los manifiestos para que la capa de dependencias se
# reutilice mientras el lockfile no cambie.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 2 — dependencias de ejecución
#
# `dist/server.cjs` se empaqueta con `--packages=external`: el bundle NO
# contiene sus dependencias, las exige en tiempo de ejecución. Los tres
# paquetes que requiere son `express`, `@google/genai` y `vite`.
#
# ⚠️ `vite` es requisito de ARRANQUE, no solo de build: `startServer.ts:3` lo
# importa de forma estática, así que el módulo se resuelve al cargar el proceso
# aunque en producción nunca se invoque. Se instala porque está declarado en
# `dependencies`; moverlo a `devDependencies` rompería el contenedor al arrancar.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS production-deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------------------------------------------------------------------------
# Etapa 3 — runtime
#
# Solo el artefacto compilado y sus dependencias de producción. Sin código
# fuente, sin toolchain de build, sin tests.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime

# `startServer.ts` sirve `dist/` como estático solo en producción declarada.
# Sin esta variable el contenedor arrancaría Vite en modo middleware.
ENV NODE_ENV=production

# Paridad con el puerto por defecto de Cloud Run, que además lo inyecta
# explícitamente en cada revisión. Permite `docker run -p 8080:8080` sin
# configuración adicional.
ENV PORT=8080

WORKDIR /app

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# El servidor resuelve los estáticos contra `process.cwd()`
# (`startServer.ts:30`), por lo que el directorio de trabajo debe ser el que
# contiene `dist/`. `package.json` se incluye por trazabilidad de la imagen.
COPY package.json ./

# Usuario sin privilegios provisto por la imagen base.
USER node

EXPOSE 8080

CMD ["node", "dist/server.cjs"]
