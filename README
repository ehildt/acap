
# Getting Started

By default the Config-Manager starts with the following setup:

```bash
ENV PORT=3000
ENV HOST='localhost'
ENV HTTP_PROTOCOL='http'
ENV START_SWAGGER='false'
ENV NODE_ENV='docker:prod'
ENV PRINT_ENV='true'

ENV AUTH_MANAGER_USERNAME='superadmin' 
ENV AUTH_MANAGER_PASSWORD='superadmin' 
ENV AUTH_MANAGER_EMAIL='super@admin.com'
ENV AUTH_MANAGER_ACCESS_TOKEN_TTL=900                                                            
ENV AUTH_MANAGER_REFRESH_TOKEN_TTL=604800                                                        
ENV AUTH_MANAGER_TOKEN_SECRET='d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0' 
ENV AUTH_MANAGER_PROVIDER_CONFIG_MANAGER_BASE_URL='http://localhost:3000'
ENV AUTH_MANAGER_PROVIDER_CONFIG_MANAGER_TOKEN='some.jwt.token' 

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
```

While this is pretty neat to kickoff some quick development aka with docker compose, you definitely want to update those envs for production! Your docker-compose.yml might look something like this:

```yml
version: '3.9'
services:
  config-manager:
    container_name: config-manager
    build: 
      context: .
      dockerfile: dockerfile
      target: local
    volumes:
      - ./:/app
    depends_on:
      - mongo
      - redis
    environment:
      - PORT=3001
      - HOST=localhost
      - HTTP_PROTOCOL=http
      - START_SWAGGER=true
      - NODE_ENV=docker:local
      - PRINT_ENV=true
      - AUTH_MANAGER_USERNAME=superadmin 
      - AUTH_MANAGER_PASSWORD=superadmin 
      - AUTH_MANAGER_EMAIL=super@admin.com
      - AUTH_MANAGER_ACCESS_TOKEN_TTL=900                                                            
      - AUTH_MANAGER_REFRESH_TOKEN_TTL=604800                                                        
      - AUTH_MANAGER_TOKEN_SECRET=d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0 
      - AUTH_MANAGER_PROVIDER_CONFIG_MANAGER_BASE_URL=http://localhost:3000
      - AUTH_MANAGER_PROVIDER_CONFIG_MANAGER_TOKEN=some.jwt.token
      - MONGO_USER=mongo
      - MONGO_PASS=mongo
      - MONGO_DB_NAME=config-manager
      - MONGO_URI=mongodb://mongo:27017
      - REDIS_PASS=myRedisPass
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_TTL=600
      - REDIS_MAX_RESPONSES=100
      - REDIS_DB_INDEX=0
    ports:
      - 3000:3001

  mongo:
    command: mongod --logpath /dev/null
    image: mongo
    container_name: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=mongo
      - MONGO_INITDB_DATABASE=configs
    volumes:
      - mongo_data:/data/db
    ports:
      - 27017:27017

  redis:
    image: redis
    container_name: redis
    ports:
      - 6379:6379
    command: redis-server --requirepass myRedisPass --loglevel warning

volumes:
  mongo_data:

networks:
  default:
    name: CONFIG_MANAGER_NETWORK
```

Running `docker compose up` should log:

```bash
config-manager  | [Nest] 36  - 06/27/2022, 10:29:47 AM     LOG [App-Configs] Object:
config-manager  | {
config-manager  |   "APP_CONFIG": {
config-manager  |     "nodeEnv": "docker:local",
config-manager  |     "port": "3000",
config-manager  |     "host": "localhost",
config-manager  |     "startSwagger": true,
config-manager  |     "httpProtocol": "http"
config-manager  |   },
config-manager  |   "AUTH_CONFIG": {
config-manager  |     "username": "superadmin",
config-manager  |     "password": "superadmin",
config-manager  |     "email": "super@admin.com",
config-manager  |     "accessTokenTTL": 900,
config-manager  |     "refreshTokenTTL": 604800,
config-manager  |     "tokenSecret": "d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0",
config-manager  |     "configManagerBaseUrl": "http://localhost:3000",
config-manager  |     "consumerToken": "some.jwt.token"
config-manager  |   },
config-manager  |   "MONGO_CONFIG": {
config-manager  |     "uri": "mongodb://mongo:27017",
config-manager  |     "ssl": false,
config-manager  |     "sslValidate": false,
config-manager  |     "dbName": "config-manager",
config-manager  |     "user": "mongo",
config-manager  |     "pass": "mongo"
config-manager  |   },
config-manager  |   "REDIS_CONFIG": {
config-manager  |     "host": "redis",
config-manager  |     "port": 6379,
config-manager  |     "ttl": 600,
config-manager  |     "max": 100,
config-manager  |     "db": 0,
config-manager  |     "password": "myRedisPass"
config-manager  |   }
config-manager  | }
config-manager  | 
config-manager  | [Nest] 36  - 06/27/2022, 10:29:47 AM     LOG (docker:local) => http://localhost:3000/api-docs-json
config-manager  | [Nest] 36  - 06/27/2022, 10:29:47 AM     LOG (docker:local) => http://localhost:3000/api-docs
```

# How To Use

..wip
