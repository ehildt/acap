# Getting Started

Let's assume your docker-compose.yml looks like this:

```yml
version: '3.9'
services:
  config-manager:
    container_name: config-manager
    image: @cultify/config-manager
    environment:
      - PORT=3000
      - START_SWAGGER=true
      - PRINT_ENV=true
      - CONFIG_MANAGER_TTL=300
      - CONFIG_MANAGER_NAMESPACE_PREFIX=''
      - MONGO_USER=mongo
      - MONGO_PASS=mongo
      - MONGO_DB_NAME=configs
      - MONGO_URI=mongodb://mongo:27017
      - REDIS_PASS=''
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_TTL=600
      - REDIS_MAX_RESPONSES=100
      - REDIS_DB_INDEX=0
    ports:
      - '3000:3000'

  mongo:
    image: mongo
    container_name: mongo
    command: mongod --wiredTigerCacheSizeGB 1.5 --logpath /dev/null
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

## App Settings

- PORT `sets the port`
- START_SWAGGER `toggles the open-api`
- PRINT_ENV `logs the envs`

- CONFIG_MANAGER_TTL `config object ttl`
- CONFIG_MANAGER_NAMESPACE_PREFIX `the prefix for the serviceId; autogenerates if empty`

- REDIS_PASS `the redis password`
- REDIS_HOST `the redis host aka localhost`
- REDIS_PORT `the redis port`
- REDIS_TTL `the time how long redis keeps a response in cache; default 5 seconds`
- REDIS_MAX_RESPONSES `maximum number of responses to store in the cache; default 100`
- REDIS_DB_INDEX `the redis database index; range 1-12`

- MONGO_USER `the mondo user`
- MONGO_PASS `the mongo password`
- MONGO_DB_NAME `the mongo database name`
- MONGO_URI `the mongo uri`

## Caching Insights

Every config object is represented by it's serviceId and is stored for 300 seconds by default. To change this behavior simply update the `CACHE_MANAGER_TTL`. Setting it to 0 disables the expiration (ttl) for that particular serviceId. Whenever the config object is altered, the ttl is reset to 300 seconds (fallback) or whatever has been provided in the `CACHE_MANAGER_TTL`. There is a caveat though. Any in-memory solution implements a simple key-value storage. This means there is no such thing as a namespace or context ales custom implemented. The prefix is such a custom implementation of a namespace/context. Let's say your key (serviceId) is test1234, then the prefix will be appended and your serviceId turns into \<prefix>\_test1234. If the prefix-serviceId combination is not unique, then all applications which use the same in-memory cache will alienate the config object.
