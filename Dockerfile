# entrypoint for local development
FROM node:18 AS local
WORKDIR /app
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start:dev"]

# entrypoint for the app builder
FROM node:18 AS builder
WORKDIR /app

ENV PORT 3000
EXPOSE ${PORT}

COPY package*.json ./
COPY tsconfig*.json ./
COPY shims.d.ts ./
COPY src/ ./src/
COPY src/config.yml ./dist/config.yml

RUN npm ci --ignore-scripts --loglevel=error

# entrypoint for dev-stage
FROM builder AS dev
WORKDIR /app
RUN npm run build
USER node
ENTRYPOINT ["npm", "run", "start"]

# entrypoint for prepare-prod
FROM builder AS prepare_prod
WORKDIR /app
RUN npm run build:prod

# entrypoint for prod-stage
FROM node:18-alpine AS prod
WORKDIR /app

ENV PORT 3000
EXPOSE ${PORT}

COPY --from=prepare_prod ./app/dist ./dist
COPY --from=prepare_prod ./app/package*.json ./

RUN npm ci --ignore-scripts --loglevel=error --omit=dev

USER node
ENTRYPOINT ["npm", "run", "start:prod"]