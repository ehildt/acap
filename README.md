
# Adaptive Content Aggregation Proxy (ACAP)

A simple and convenient way to dynamically provide and distribute content to your clients and services ;)

****ACAP**** is a system designed to provide and distribute client- and service-related content in a dynamic, adaptable, responsive and automated manner. It responds to changing needs and preferences in real-time, ensuring a flexible and responsive distribution process. Furthermore, it is also an excellent choice for applications seeking to enhance user engagement by delivering timely, relevant, and diverse content through its platform or channels, providing a CMS-like experience. 

To ensure optimal performance, it is recommended to restrict the use of ****ACAP**** to essential data and avoid handling large datasets such as stringified Buffers (files, documents etc.). Streaming such datasets can consume substantial resources and potentially lead to blocking incoming requests, primarily due to limitations in both RAM and network bandwidth. Instead, we encourage you to utilize ****ACAP**** as a proxy to minimize the need for streaming large datasets.

`ACAP is a lightweight solution, making it an ideal choice for embedding and seamlessly integrating into your ecosystem.`

## Example Use Cases

One example use case for **ACAP** could be serving base64-encoded images to web clients. This setup allows for dynamic switching of content on the fly, similar to how it is commonly done in a content management system (CMS). Of course, this capability is not limited solely to images. 

Another use case could involve inter-service communication, enabling a centralized configuration as a single source of truth. This can be achieved by leveraging technologies such as **bullMQ**, **MQTT** and **RedisPubSub** which facilitate real-time provision and distribution of these configurations.

There are instances where utilizing **ACAP** as a proxy can be advantageous. By creating content that references external sources holding the required datasets, you can leverage the capabilities of **ACAP** without the need for directly handling large datasets. This approach greatly enhances the efficiency of data retrieval and management.

In certain scenarios, there may be a need to describe and validate content. **ACAP** accomplishes this by utilizing JSON schema with the help of **avj**. In IDEs like **Visual Studio Code** and similar environments, you have the ability to link the  **$schema** , which enables highlighting and validation. Alternatively, you can fetch the schema on the client side and perform data validation in real time during runtime.

## Whats in the box?

Postman, Insomnia and Swagger OpenApi were yesterday! **ACAP** delivers a sleek, modern, and intuitive user interface, designed to effortlessly manage and organize your content. With crisp content management and immediate processing, your experience is seamless and efficient.

### Own Your Content

When creating and managing content, you can choose between a strict or lenient approach to describe its structure. Validation of your content using involves checking if a JSON schema matches the content. `ACAP` knows which content belongs to which schema by simply mapping the realm identifier. In simpler terms, if you create content with a realm value of **MY_REALM** and a schema that also has a realm value of **MY_REALM**, your content will be validated against that schema. The content itself is not bound to any particular structure or value. It even has the capability to fetch system variables when enabled, as long as the identified system variable matches the specified key. By default, this feature is disabled to ensure security. For a more comprehensive understanding of content and schema declarations, please refer to the [wiki]().

### Redis

Under the hood, `ACAP` utilizes [Redis](https://redis.io/docs/) for optimization. It efficiently updates the cache whenever the content is modified, except during the initial creation. If existing content is updated, the cache is also updated as long as the content is currently cached. When fetching the content, and if it already exists in the cache, the time-to-live (TTL) is reset. This approach minimizes unnecessary database I/O operations. Otherwise the content is fetched from the database and populated in the cache.

### Redis Publish Subscribe

### MQTT

### BullMQ

## Getting Started

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

And let's suppose the system environment variables in `env/defaults.env` got the following config:

``` ts
PORT=3001
PRINT_ENV=true
START_SWAGGER=true

CONFIG_MANAGER_TTL=300
CONFIG_MANAGER_RESOLVE_ENV=true
CONFIG_MANAGER_NAMESPACE_POSTFIX='Realm'

REDIS_PUBSUB_PORT=6379
REDIS_PUBSUB_HOST='redis'
REDIS_PUBSUB_PUBLISH_EVENTS=true

MONGO_USER='mongo'
MONGO_PASS='mongo'
MONGO_DB_NAME='configs'
MONGO_URI='mongodb://mongo:27017'
MONGO_SSL=false
MONGO_SSL_VALIDATE=false

# REDIS_PASS=''
REDIS_HOST='redis'
REDIS_PORT=6379
REDIS_TTL=600
REDIS_MAX_RESPONSES=100
REDIS_DB_INDEX=0
```

Then you should be able to start the application via `docker compose up`.
Alternatively to setting the environment variables (`env/defaults`) or in conjunction with them,
the `src/config.yml` can be used. The config.yml serves as the fallback.
So whenever an environment variable is missing, the app checks for its fallback in the config.yml file.
An equivalent config.yml example to the `env/defaults` looks like this:

``` yml
appConfig:
  printEnv: true
  startSwagger: true
  port: 3001

managerConfig:
  ttl: 300
  resolveEnv: true
  namespacePostfix: Realm

mongoConfig:
  uri: mongodb://mongo:27017
  ssl: false
  sslValidate: false
  dbName: configs
  user: mongo
  pass: mongo

redisConfig:
  host: redis
  port: 6379
  ttl: 600
  max: 100
  db: 0

redisPUBSUBConfig: 
  publishEvents: true
  options:
    port: 6379
    host: redis
```


## API-Interfaces

All of the api interfaces are well documented in the swagger open-api. There, you will find a description to any of the endpoints. The open-api can be toggled by setting the `START_SWAGGER` environment.

## Caching Insights

1. Every config object is represented by it's **realm**.
   1. A realm is a simple combination of a realm and a postfix.
   2. Sharing the same postfix with other services will leak the realms and thus make the realms available to those services (aka Redis default behaviour). 
2. The realm is cached for 300 seconds by default and stored in the database till it's entirely deleted. 
3. The config objects can be added or deleted at any time. 
4. Adding or deleting a config object will also remove it from the database. 
5. If the last config object is deleted, then the realm is also deleted. 
6. If a realm expires, then it's removed from cache only and re-cached again on the next fetch. 
   1. To change this behavior simply update the `CACHE_MANAGER_TTL`. 
   2. Setting `CACHE_MANAGER_TTL` to 0 disables the expiration (ttl) for that particular **realm**. 
   3. Whenever a config object is altered, the ttl is being reset to 300 seconds (fallback) or whatever you have provided in the `CACHE_MANAGER_TTL` 
 
  The Redis cache is a simple in-memory key-value storage. This means that by default there is no such thing as a realm. Everything is stored per key. The realm-postfix combination is a naive approach which tries to mitigate key-coaliltion when multiple services need to use the same redis cache and therefor need to be distinct.
