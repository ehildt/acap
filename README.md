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
    image: cultify/config-manager
    container_name: config-manager
    depends_on:
      - mongo

  mongo:
    image: mongo
    container_name: mongo
    command: mongod --logpath /dev/null
    volumes:
      - mongo_data:/data/db
    ports:
      - '27017:27017'
    environment:
      - MONGO_INITDB_ROOT_USERNAME='mongo'
      - MONGO_INITDB_ROOT_PASSWORD='mongo'
      - MONGO_INITDB_DATABASE='configs'

volumes:
  mongo_data:

networks:
  default:
    name: CONFIG_MANAGER_NETWORK
```

Running `docker compose up` should log:

```bash
config-manager  | [Nest] 59  - 06/07/2022, 6:59:50 PM     LOG [Config-Manager] Object:
config-manager  | {
config-manager  |   "APP_CONFIG": {
config-manager  |     "nodeEnv": "docker:local",
config-manager  |     "port": "3000",
config-manager  |     "host": "localhost",
config-manager  |     "startSwagger": true,
config-manager  |     "httpProtocol": "http",
config-manager  |     "printEnv": true
config-manager  |   },
config-manager  |   "MONGO_CONFIG": {
config-manager  |     "uri": "mongodb://mongo:27017",
config-manager  |     "ssl": false,
config-manager  |     "sslValidate": false,
config-manager  |     "dbName": "configs",
config-manager  |     "user": "mongo",
config-manager  |     "pass": "mongo"
config-manager  |   }
config-manager  | }
config-manager  | 
config-manager  | [Nest] 59  - 06/07/2022, 6:59:50 PM     LOG [Swagger] (docker:local) => http://localhost:3000/api-docs-json
config-manager  | [Nest] 59  - 06/07/2022, 6:59:50 PM     LOG [Swagger] (docker:local) => http://localhost:3000/api-docs
config-manager  | [Nest] 59  - 06/07/2022, 6:59:50 PM     LOG [NestApplication] Nest application successfully started +1ms
```
