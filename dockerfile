# entrypoint for local development
FROM node:18-alpine as local
WORKDIR /app
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start:dev"]

# entrypoint for the app builder
FROM node:18-alpine AS builder
WORKDIR /app

ENV PORT='3000'
ENV HOST='localhost'
ENV HTTP_PROTOCOL='http'
ENV START_SWAGGER='false'
ENV NODE_ENV='docker:prod'
ENV PRINT_ENV='true'

ENV MONGO_USER='mongo'
ENV MONGO_PASS='mongo'
ENV MONGO_DB_NAME='configs'
ENV MONGO_URL='mongodb://localhost:27017'

EXPOSE ${PORT}

COPY package*.json ./
COPY tsconfig*.json ./
COPY shims.d.ts ./
COPY src ./src/

RUN npm ci --ignore-scripts --loglevel=error 

# entrypoint for dev-stage
FROM builder AS dev
WORKDIR /app
RUN npm run build
USER node
ENTRYPOINT ["npm", "--silent", "run", "start:node"]

# entrypoint for prepare-prod
FROM builder AS prepare_prod
WORKDIR /app
RUN npm run build:prod

# entrypoint for prod-stage
FROM node:18-alpine AS prod
WORKDIR /app

ENV PORT='3000'
ENV HOST='localhost'
ENV HTTP_PROTOCOL='http'
ENV START_SWAGGER='false'
ENV NODE_ENV='docker:prod'
ENV PRINT_ENV='false'

ENV MONGO_USER='mongo'
ENV MONGO_PASS='mongo'
ENV MONGO_DB_NAME='configs'
ENV MONGO_URL='mongodb://localhost:27017'

EXPOSE ${PORT}

COPY --from=PREPARE_PROD ./app/dist ./dist
COPY --from=PREPARE_PROD ./app/package*.json ./

RUN npm ci --ignore-scripts --loglevel=error --omit=dev

USER node
ENTRYPOINT ["npm", "--silent", "run", "start:node"]