# entrypoint for local development
FROM node:18 AS local
WORKDIR /usr/src/app/
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start:dev"]

# entrypoint for the app builder
FROM node:18-slim AS builder
WORKDIR /usr/src/app/

ENV PORT=3000
ENV START_SWAGGER='true'
ENV PRINT_ENV='true'

ENV AUTH_MANAGER_USERNAME='superadmin' 
ENV AUTH_MANAGER_PASSWORD='superadmin' 
ENV AUTH_MANAGER_EMAIL='super@admin.com'
ENV AUTH_MANAGER_ACCESS_TOKEN_TTL=900                                                            
ENV AUTH_MANAGER_REFRESH_TOKEN_TTL=604800                                                        
ENV AUTH_MANAGER_TOKEN_SECRET='d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0'  

ENV CACHE_MANAGER_TTL=300
ENV CACHE_MANAGER_NAMESPACE_PREFIX=''

ENV CONFIG_MANAGER_TTL=300
ENV CONFIG_MANAGER_NAMESPACE_PREFIX=''

ENV REDIS_PASS='myRedisPass'
ENV REDIS_HOST='redis'
ENV REDIS_PORT=6379
ENV REDIS_TTL=600
ENV REDIS_MAX_RESPONSES=100
ENV REDIS_DB_INDEX=0

ENV MONGO_USER='mongo'
ENV MONGO_PASS='mongo'
ENV MONGO_DB_NAME='configs'
ENV MONGO_URL='mongodb://localhost:27017'

EXPOSE ${PORT}

COPY package*.json ./
COPY tsconfig*.json ./
COPY shims.d.ts ./
COPY src ./src
COPY ssl ./ssl

RUN npm ci --ignore-scripts --loglevel=error 

# entrypoint for dev-stage
FROM builder AS dev
WORKDIR /usr/src/app/
RUN npm run build
USER node
ENTRYPOINT ["npm", "run", "start"]

# entrypoint for prepare-prod
FROM builder AS prepare_prod
WORKDIR /usr/src/app/
RUN npm run build:prod

# entrypoint for prod-stage
FROM node:18-slim AS prod
WORKDIR /usr/src/app/

ENV PORT=3000
ENV START_SWAGGER='false'
ENV PRINT_ENV='true'

ENV AUTH_MANAGER_USERNAME='superadmin' 
ENV AUTH_MANAGER_PASSWORD='superadmin' 
ENV AUTH_MANAGER_EMAIL='super@admin.com'
ENV AUTH_MANAGER_ACCESS_TOKEN_TTL=900                                                            
ENV AUTH_MANAGER_REFRESH_TOKEN_TTL=604800                                                        
ENV AUTH_MANAGER_TOKEN_SECRET='d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0'  

ENV CACHE_MANAGER_TTL=300
ENV CACHE_MANAGER_NAMESPACE_PREFIX=''

ENV CONFIG_MANAGER_TTL=300
ENV CONFIG_MANAGER_NAMESPACE_PREFIX=''

ENV REDIS_PASS='myRedisPass'
ENV REDIS_HOST='redis'
ENV REDIS_PORT=6379
ENV REDIS_TTL=600
ENV REDIS_MAX_RESPONSES=100
ENV REDIS_DB_INDEX=0

ENV MONGO_USER='mongo'
ENV MONGO_PASS='mongo'
ENV MONGO_DB_NAME='configs'
ENV MONGO_URL='mongodb://localhost:27017'

EXPOSE ${PORT}

COPY --from=prepare_prod ./usr/src/app/dist ./dist
COPY --from=prepare_prod ./usr/src/app/package*.json ./
COPY --from=prepare_prod ./usr/src/app/ssl ./ssl

RUN npm ci --ignore-scripts --loglevel=error --omit=dev

USER node
ENTRYPOINT ["npm", "run", "start:prod", "--silent"]