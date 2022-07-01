# Getting Started

By default the Config-Manager starts with the following setup:

```bash
ENV PORT=3000
ENV START_SWAGGER='false'

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
      - START_SWAGGER=true
      - PRINT_ENV=true
      - AUTH_MANAGER_USERNAME=superadmin
      - AUTH_MANAGER_PASSWORD=superadmin
      - AUTH_MANAGER_EMAIL=super@admin.com
      - AUTH_MANAGER_ACCESS_TOKEN_TTL=900
      - AUTH_MANAGER_REFRESH_TOKEN_TTL=604800
      - AUTH_MANAGER_TOKEN_SECRET=d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0
      - CACHE_MANAGER_TTL=300
      - CACHE_MANAGER_NAMESPACE_PREFIX=''
      - CONFIG_MANAGER_TTL=300
      - CONFIG_MANAGER_NAMESPACE_PREFIX=''
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
    command: mongod --wiredTigerCacheSizeGB 1.5 --logpath /dev/null
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
config-manager  | [Nest] 37  - 07/01/2022, 3:45:42 PM     LOG [AppConfiguration] {
config-manager  |     "APP_CONFIG": {
config-manager  |         "port": "3000",
config-manager  |         "startSwagger": true
config-manager  |     },
config-manager  |     "AUTH_MANAGER_CONFIG": {
config-manager  |         "username": "superadmin",
config-manager  |         "password": "superadmin",
config-manager  |         "email": "super@admin.com",
config-manager  |         "accessTokenTTL": 900,
config-manager  |         "refreshTokenTTL": 604800,
config-manager  |         "tokenSecret": "d742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0",
config-manager  |         "rejectUnauthorized": false
config-manager  |     },
config-manager  |     "CACHE_MANAGER_CONFIG": {
config-manager  |         "ttl": 300,
config-manager  |         "namespacePrefix": ""
config-manager  |     },
config-manager  |     "CONFIG_MANAGER_CONFIG": {
config-manager  |         "ttl": 300,
config-manager  |         "namespacePrefix": ""
config-manager  |     },
config-manager  |     "MONGO_CONFIG": {
config-manager  |         "uri": "mongodb://mongo:27017",
config-manager  |         "ssl": false,
config-manager  |         "sslValidate": false,
config-manager  |         "dbName": "config-manager",
config-manager  |         "user": "mongo",
config-manager  |         "pass": "mongo"
config-manager  |     },
config-manager  |     "REDIS_CONFIG": {
config-manager  |         "host": "redis",
config-manager  |         "port": 6379,
config-manager  |         "ttl": 600,
config-manager  |         "max": 100,
config-manager  |         "db": 0,
config-manager  |         "password": "myRedisPass"
config-manager  |     }
config-manager  | }
config-manager  | [Nest] 37  - 07/01/2022, 3:45:42 PM     LOG https://localhost:3000/api-docs-json
config-manager  | [Nest] 37  - 07/01/2022, 3:45:42 PM     LOG https://localhost:3000/api-docs
```

## App Settings

No magic involved, keeping it simple :)

- PORT=3000 `sets the port`
- START_SWAGGER=true `enables the open-api`
- PRINT_ENV=true `logs the envs`

On startup, if not exists, the user **superadmin** is created. To change the default credentials you might want to set these envs:

- `AUTH_MANAGER_USERNAME`
- `AUTH_MANAGER_PASSWORD`
- `AUTH_MANAGER_EMAIL`

Otherwise you will need to signin and change those credentials at a later time by using the REST API.

There are four roles with different permissions:

- superadmin `the config-manager god`
- moderator `read/write - cannot elevate users (demigod)`
- consumer `readonly - cannot signin, signout, refresh`
- member `signin, signout, refresh`

> On singup the user gets the **member** role

By default a session expires after 15 minutes: `AUTH_MANAGER_ACCESS_TOKEN_TTL=900` (seconds).
A session can be refreshed for 7 days before expiring: `AUTH_MANAGER_REFRESH_TOKEN_TTL=604800` (seconds).
Once a session expires it cannot be refreshed and the user is forced to re-signin. To refresh a session the refresh token is used,
which generates a new access/refresh token pair. Thus in our example an active user can stay signed in infinitely or is forced to re-signin if the session is not refreshed within 7 days. The config-manager verifies the tokens by signing them with the `AUTH_MANAGER_TOKEN_SECRET`. A common misunderstanding is that a JWT is encrypted. It's not!

A consumer token is used by services, which don't need to authenticate but rather rely on authorization. For example our config-manager is consumed by other microservices. Thus a microservice is not a **user** but a **consumer**! All it's interested in is fetch some configuration data and thus has no need for authentication.

## Databases

The config-manager requires a mongo and redis database to operate. It's a straight forward approach. Simply provide the credentials via the envs as show above in the [Getting Started](#getting-started) example.

## HTTPS (tls/ssl)

The config-manager comes with a self-signed tls/ssl setup, which does not have an expiration date.
It might be enough for you though for security reasons you might want to provide your own tls/ssl.
Do to so replace the `127.0.0.1.crt` and `127.0.0.1.key` in the `ssl` folder. In docker you can map your tls/ssl setup with `-v $(pwd)/ssl:/usr/src/app/ssl`. If you use signed certificates you might also want to set `AUTH_MANAGER_REJECT_UNAUTHORIZED=true`.

## Caching

Every serviceId is stored for 300 seconds by default. To change this behavior set `CACHE_MANAGER_TTL` and `CONFIG_MANAGER_TTL` respectively. Whenever the config is altered, like by adding or removing a configId from it's serviceId (context), the ttl is being reset to 300 seconds (fallback) or whatever has been provided in the envs. There is a caveat though, namely if the envs `CACHE_MANAGER_NAMESPACE_PREFIX` and `CONFIG_MANAGER_NAMESPACE_PREFIX` share the same value. In this case when creating a serviceId using the **cache-manager**, the ttl coming from `CACHE_MANAGER_TTL` is used. However, if you alter this serviceId using the **config-manager**, then the ttl coming from the `CONFIG_MANAGER_TTL` is used. This is due to the fact that both managers share the same serviceId (context). Also, on the **cache-manager** upsert endpoint a custom ttl can be provided. As long as the serviceId (context) is not modified by any of the managers, the custom ttl is preserved. Thus if set to 0 the serviceId (context) never expires.
