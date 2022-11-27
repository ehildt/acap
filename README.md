# Getting Started

Let's assume your docker-compose.yml looks like this:

```yml
version: '3.9'
services:
  config-manager:
    container_name: config-manager
    build:
      context: .
      dockerfile: Dockerfile
      target: local
    volumes:
      - ./:/app
    depends_on:
      - mongo
      - redis
    env_file:
      - env/defaults.env
    ports:
      - '3001:3001'

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
      - '27017:27017'

  redis:
    image: redis
    container_name: redis
    ports:
      - '6379:6379'
    command: redis-server --loglevel "warning"

volumes:
  mongo_data:

networks:
  default:
    name: CONFIG_MANAGER_NETWORK
```

And let's suppose your `env/defaults.env` got the following config:

PORT=3001
PRINT_ENV=true
START_SWAGGER=true

CONFIG_MANAGER_TTL=300
CONFIG_MANAGER_NAMESPACE_POSTFIX='ConfigManager'

REDIS_PUBLISHER_PORT=6379
REDIS_PUBLISHER_HOST='redis'

MONGO_USER='mongo'
MONGO_PASS='mongo'
MONGO_DB_NAME='configs'
MONGO_URI='mongodb://mongo:27017'
MONGO_SSL=false
MONGO_SSL_VALIDATE=false

\# REDIS_PASS=''
REDIS_HOST='redis'
REDIS_PORT=6379
REDIS_TTL=600
REDIS_MAX_RESPONSES=100
REDIS_DB_INDEX=0

Then you should be able to start the application via `docker compose up`.
Alternatively or in conjunction with the `env/defaults` the `src/config.yml` can be used.

## Whats in the box?

..to be continue

## Caching Insights

Every config object is represented by it's namespace and is stored for 300 seconds by default. To change this behavior simply update the `CACHE_MANAGER_TTL`. Setting it to 0 disables the expiration (ttl) for that particular namespace. Whenever the config object is altered, the ttl is being reset to 300 seconds (fallback) or whatever you have provided in the `CACHE_MANAGER_TTL`. There is a caveat though. Redis cache is a simple in-memory key-value storage. This means there is no such thing as a namespace ales custom implemented. The postfix is such a custom implementation of a namespace. Let's say your namespace is MY_TEST_CONFIG, then the postfix will be appended and your namespace turns into MY_TEST_CONFIG_\<postfix>\. If the namespace-postfix combination is not unique, then all the services which use the same redis in-memory cache will alienate to use the same config object aka namespace. In other words, the same redis cache can be used in multiple services and it does not care for any namespaces nor does it provide any solution for handling nested objects. All it does is plainly save key-value pairs. This config-manager tries to address the namespace issue and implements a naive way to handle the key-value pairs inside namespace-postfix combination.
