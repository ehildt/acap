# Target: local (entrypoint for local development)
FROM node:20-slim AS local
WORKDIR /app
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
EXPOSE 3001
RUN corepack enable pnpm
ENTRYPOINT ["pnpm", "run", "start:dev"]

# Target: builder (shared build stage)
FROM node:20-slim AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"

COPY package.json tsconfig*.json shims.d.ts ./
COPY src/ ./src/
COPY src/configs/config-yml/config.yml ./dist/configs/config-yml/config.yml

RUN corepack enable pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts

# Target: temporary (entrypoint for prepare-dev)
FROM builder AS builddev
WORKDIR /app
RUN pnpm run build

# Target: temporary (entrypoint for prepare-prod)
FROM builder AS buildprod
WORKDIR /app
RUN pnpm run build:prod

# Target: development (entrypoint for dev-stage)
FROM node:20-slim AS development
WORKDIR /app

ENV                                         \
  NODE_OPTIONS="--max-old-space-size=256"   \
  NODE_ENV="development"                    \
  PRINT_ENV="false"                         \
  START_SWAGGER="true"                      \
  PNPM_HOME="/pnpm"                         \
  PATH="$PNPM_HOME:$PATH"

COPY --chown=node:node --from=builddev /app/dist ./dist
COPY --chown=node:node --from=builddev /app/package*.json ./
COPY --chown=node:node --from=builddev /app/node_modules ./node_modules

RUN ln -s /app/dist/configs/config-yml/config.yml /app/config.yml
RUN corepack enable pnpm

EXPOSE 3001
USER node
ENTRYPOINT ["pnpm", "run", "start:node"]

# Target: production (entrypoint for prod-stage)
FROM node:20-slim AS production
WORKDIR /app

ENV                                         \
  NODE_OPTIONS="--max-old-space-size=256"   \
  NODE_ENV="production"                     \
  PRINT_ENV="false"                         \
  START_SWAGGER="false"                     \
  PNPM_HOME="/pnpm"                         \
  PATH="$PNPM_HOME:$PATH"

COPY --chown=node:node --from=buildprod /app/dist ./dist
COPY --chown=node:node --from=buildprod /app/package*.json ./
COPY --chown=node:node --from=buildprod /app/node_modules ./node_modules

RUN ln -s /app/dist/configs/config-yml/config.yml /app/config.yml
RUN corepack enable pnpm

EXPOSE 3001
USER node
ENTRYPOINT ["pnpm", "run", "start:node"]