# Target: local (entrypoint for local development)
FROM node:20:latest AS local
WORKDIR /app
EXPOSE 3001
ENTRYPOINT ["npm", "run", "start:dev"]

# Target: builder (shared build stage)
FROM node:20-slim AS builder
WORKDIR /app

ENV PORT=3001

COPY package*.json tsconfig*.json shims.d.ts ./
COPY src/ ./src/
RUN npm ci --ignore-scripts --loglevel=error
COPY src/configs/config-yml/config.yml ./dist/configs/config-yml/config.yml

# Target: temporary (entrypoint for prepare-dev)
FROM builder AS builddev
WORKDIR /app
RUN npm run build

# Target: temporary (entrypoint for prepare-prod)
FROM builder AS buildprod
WORKDIR /app
RUN npm run build:prod

# Target: development (entrypoint for dev-stage)
FROM node:20-slim AS development
WORKDIR /app

# Single block for the environment variables
ENV NODE_OPTIONS="--max-old-space-size=256" \
  NODE_ENV="development" \
  PRINT_ENV="false" \
  START_SWAGGER="false"

EXPOSE ${PORT}

COPY --chown=node:node --from=builddev /app/dist ./dist
COPY --chown=node:node --from=builddev /app/package*.json ./
COPY --chown=node:node --from=builddev /app/node_modules ./node_modules

RUN ln -s /app/dist/configs/config-yml/config.yml /app/config.yml

USER node
ENTRYPOINT ["npm", "run", "start:node"]

# Target: production (entrypoint for prod-stage)
FROM node:20-slim AS production
WORKDIR /app

# Single block for the environment variables
ENV NODE_OPTIONS="--max-old-space-size=256" \
  NODE_ENV="production" \
  PRINT_ENV="false" \
  START_SWAGGER="false"

EXPOSE ${PORT}

COPY --chown=node:node --from=buildprod /app/dist ./dist
COPY --chown=node:node --from=buildprod /app/package*.json ./
COPY --chown=node:node --from=buildprod /app/node_modules ./node_modules

RUN ln -s /app/dist/configs/config-yml/config.yml /app/config.yml

USER node
ENTRYPOINT ["npm", "run", "start:node"]