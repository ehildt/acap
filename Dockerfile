# entrypoint for local development
FROM node:20-slim AS local
WORKDIR /app
EXPOSE 3001
ENTRYPOINT [ "npm", "run", "start:dev"]

# entrypoint for the app builder
FROM node:20-slim AS builder
WORKDIR /app

ENV PORT=3001
EXPOSE ${PORT}

COPY package*.json ./
COPY tsconfig*.json ./
COPY shims.d.ts ./
COPY src/ ./src/
COPY src/configs/config-yml/config.yml ./dist/configs/config-yml/config.yml

RUN npm ci --ignore-scripts --loglevel=error

# entrypoint for dev-stage
FROM builder AS development
WORKDIR /app
RUN npm run build
USER node
ENTRYPOINT ["npm", "run", "start"]

# entrypoint for prepare-prod
FROM builder AS temporary
WORKDIR /app
RUN npm run build:prod

# entrypoint for prod-stage
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=128"
ENV NODE_ENV="production"
ENV PRINT_ENV="false"
ENV START_SWAGGER="false"
ENV PORT=3001
EXPOSE ${PORT}

COPY --from=temporary ./app/dist ./dist
COPY --from=temporary ./app/package*.json ./

RUN npm ci --ignore-scripts --loglevel=error --omit=dev

USER node
ENTRYPOINT ["npm", "run", "start:prod"]