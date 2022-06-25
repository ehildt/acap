# Config-Manager

A simple and convenient way to config your apps ;)

## Getting Started

By default the config-manager starts with the following envs:

```bash
PORT='3000'
HOST='localhost'
START_SWAGGER='true'
PRINT_ENV='true'

MONGO_USER='mongo'
MONGO_PASS='mongo'
MONGO_DB_NAME='configs'
MONGO_URI='mongodb://mongo:27017'
```

It's pretty neat to kickoff some quick development aka with docker compose.  
Your docker-compose.yml might look like this:

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
    env_file:
      - env/defaults.env
    ports:
      - '3000:3000'

  mongo:
    command: mongod --logpath /dev/null
    image: mongo
    container_name: mongo
    env_file:
      - env/docker.env
    volumes:
      - mongo_data:/data/db
    ports:
      - '27017:27017'

  redis:
    image: redis
    container_name: redis
    env_file:
      - env/docker.env
    ports:
      - '6379:6379'
    command: redis-server --requirepass myRedisPass --loglevel warning

volumes:
  mongo_data:

networks:
  default:
    name: CONFIG_MANAGER_NETWORK
```

Running `docker compose up` should log:

```bash
config-manager  | [Nest] 79  - 06/12/2022, 7:31:58 PM     LOG [Config-Manager] Object:
config-manager  | {
config-manager  |   "MONGO_CONFIG": {
config-manager  |     "uri": "mongodb://mongo:27017",
config-manager  |     "ssl": false,
config-manager  |     "sslValidate": false,
config-manager  |     "dbName": "configs",
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
config-manager  | [Nest] 79  - 06/12/2022, 7:31:58 PM     LOG [App] Object:
config-manager  | {
config-manager  |   "APP_CONFIG": {
config-manager  |     "nodeEnv": "docker:local",
config-manager  |     "port": "3000",
config-manager  |     "host": "localhost",
config-manager  |     "startSwagger": true,
config-manager  |     "httpProtocol": "http"
config-manager  |   }
config-manager  | }
config-manager  | 
config-manager  | [Nest] 79  - 06/12/2022, 7:31:58 PM     LOG [Swagger] (docker:local) => http://localhost:3000/api-docs-json
config-manager  | [Nest] 79  - 06/12/2022, 7:31:58 PM     LOG [Swagger] (docker:local) => http://localhost:3000/api-docs
config-manager  | [Nest] 79  - 06/12/2022, 7:31:58 PM     LOG [NestApplication] Nest application successfully started +1ms
```
