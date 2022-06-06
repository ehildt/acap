# Config-Manager

A simple and convenient way to config your apps ;)

## Getting Started

By default the config-manager starts with the following envs:

```bash
PORT='3000'
HOST='localhost'
HTTP_PROTOCOL='http'
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
    command: todo add command!
    image: mongo
    container_name: mongo
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

Running `docker compose up` should console log:
