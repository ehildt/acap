
# Adaptive Content Aggregation Proxy (ACAP)

ACAP is a cutting-edge system designed to revolutionize content distribution and engagement. With its dynamic and adaptable features, it ensures that your clients and services receive the right content at the right time. ACAP responds in real-time to changing needs and preferences, guaranteeing a seamless and personalized experience. Its automated processes make content distribution effortless, allowing you to focus on what matters most. Moreover, ACAP empowers you to enhance user engagement by delivering timely, relevant, and diverse content through its platform or channels. This means increased customer satisfaction and loyalty, leading to business growth. Say goodbye to static and cumbersome content management and hello to ACAP's game-changing capabilities. 

- **Dynamic and Adaptable Content Distribution:** ACAP ensures that other services receive the right content at the right time. By dynamically adapting to changing needs and preferences, ACAP enhances content distribution for other services.

- **Real-time Responsiveness:** ACAP responds in real-time to changing needs and preferences, guaranteeing a seamless and personalized experience for other services. This real-time responsiveness enhances user engagement and satisfaction.

- **Effortless Content Distribution:** ACAP automates content distribution processes, making it effortless for other services. This automation allows other services to focus on their core functionality while ACAP handles the efficient distribution of content.

- **Enhanced User Engagement:** ACAP empowers other services to deliver timely, relevant, and diverse content. By leveraging ACAP's platform or channels, other services can increase user engagement and satisfaction.

- **Increased Customer Satisfaction and Loyalty:** By delivering personalized and relevant content, ACAP helps other services improve customer satisfaction and loyalty. This, in turn, can lead to business growth for those services.

`The ideal time to grow a business was yesterday, but the next best time to invest in one is now.`

## Example Use Cases

One example use case for ACAP could be serving base64-encoded images to web clients. This setup allows for dynamic switching of content on the fly, similar to how it is commonly done in a content management system (CMS). Of course, this capability is not limited solely to images. 

Another use case could involve inter-service communication, enabling a centralized configuration as a single source of truth. This can be achieved by leveraging technologies such as **bullMQ**, **MQTT** and **RedisPubSub** which facilitate real-time provision and distribution of these configurations.

There are instances where utilizing ACAP as a proxy can be advantageous. By creating content that references external sources holding the required datasets, you can leverage the capabilities of ACAP without the need for directly handling large datasets. This approach greatly enhances the efficiency of data retrieval and management.

In certain scenarios, there may be a need to describe and validate content. ACAP accomplishes this by utilizing JSON schema with the help of **avj**. In IDEs like **Visual Studio Code** and similar environments, you have the ability to link the  **$schema** , which enables highlighting and validation. Alternatively, you can fetch the schema on the client side and perform data validation in real time during runtime.

## Whats in the box?

Postman, Insomnia and Swagger OpenApi were yesterday! ACAP delivers a sleek, modern, and intuitive user interface, designed to effortlessly manage and organize your content. With crisp content management and immediate processing, your experience is seamless and efficient. ACAP simplifies the process for developers to enable or disable optional features like Redis Publish Subscribe, MQTT, and BullMQ as per their requirements.

### K-Own Your Content

When creating and managing content, you can freely choose between a strict or lenient approach to describe its structure. Validation of your content involves checking if a JSON schema matches the content. ACAP knows which content belongs to which schema by simply referencing the realm identifier. In simpler terms, if you create content with a realm value of **MY_REALM** and a schema that also has a realm value of **MY_REALM**, your content will be validated against that schema. The content itself is not bound to any particular structure or value. It even has the capability to fetch system variables when enabled, as long as the content identifier matches the specified system variable key. By default, this feature is disabled to ensure security. For a more comprehensive understanding of content and schema declarations, please refer to the [wiki]().

`This powerful feature provides industry-leading flexibility in managing content structure, empowering companies to customize and validate their content with ease and efficiency. Experience unparalleled control and adaptability in content management, unlocking new possibilities for your business's success.`

### Redis

Under the hood, ACAP utilizes [Redis](https://redis.io/docs/) for optimization. It efficiently updates the cache whenever the content is modified, except during the initial creation. If existing content is updated, the cache is also updated as long as the content is currently cached. When fetching the content, and if it already exists in the cache, the time-to-live (TTL) is reset. This approach minimizes unnecessary database I/O operations. Otherwise the content is fetched from the database and populated in the cache. 

`The Redis cache is a highly efficient in-memory key-value storage system. ACAP further enhances its capabilities by introducing a dynamic content management system, adding flexibility and versatility to its functionality.`

### Redis Publish Subscribe

ACAP supports [Redis Publish Subscribe](https://redis.io/docs/interact/pubsub/). When this feature is enabled, ACAP automatically publishes content using the realm as the channel, which can be subscribed to by other clients and services. The **fire-and-forget** strategy for **Redis Publish Subscribe** ensures non-blocking transmission, allowing for a seamless content distribution without any interruptions.

### MQTT

MQTT plays a crucial role in enhancing ACAP by addressing key communication challenges in the IoT ecosystem. With MQTT, ACAP benefits from the following features:                                                    

- **Lightweight and Efficient:** MQTT's lightweight nature ensures minimal bandwidth usage and a small footprint, allowing ACAP to optimize resource utilization while maintaining efficient communication between devices.

- **Reliable Message Delivery:** ACAP leverages MQTT's message queuing capabilities, enabling devices to reliably publish messages to specific topics. This ensures that important data is delivered without loss or duplication, guaranteeing the integrity of the information exchanged.                                                            
- **Scalability:** MQTT's scalable nature allows ACAP to accommodate a growing number of devices within the IoT ecosystem. As your service expands, MQTT ensures seamless and efficient communication, enabling ACAP to handle a large volume of messages without sacrificing performance.                                                           
- **Real-time Data Exchange:** MQTT's ability to handle unreliable networks makes it an ideal choice for ACAP. It ensures that real-time data exchange between devices occurs smoothly, even in challenging network conditions, enhancing the overall reliability and responsiveness of your service. By utilizing MQTT, ACAP leverages the power of this open-standard protocol to overcome communication hurdles, optimize resource usage, ensure reliable message delivery, and provide a scalable solution for real-time data exchange in IoT deployments.

### BullMQ

BullMQ, a powerful job and message queue library, brings several benefits to ACAP, enhancing its capabilities and performance. Here's how BullMQ benefits ACAP:                                                                       

- **Job Management:** BullMQ enables ACAP to efficiently manage and prioritize jobs within the system. It provides features such as job scheduling, retries, and prioritization, ensuring that tasks are executed in a controlled and organized manner.

- **Scalability and Performance:** BullMQ is designed to handle high volumes of jobs and messages, making it an ideal solution for scaling ACAP. It optimizes resource utilization, allowing ACAP to process tasks efficiently and maintain high performance even under heavy workloads.

- **Distributed Processing:** BullMQ supports distributed processing, allowing ACAP to distribute jobs across multiple workers or nodes. This enables parallel processing, improves overall system throughput, and enhances the speed of task execution.

- **Fault Tolerance:** BullMQ incorporates fault-tolerant mechanisms, ensuring that ACAP can recover from failures gracefully It provides features like job persistence and automatic retries, minimizing the impact of failures on the system's overall performance and reliability.

- **Monitoring and Analytics:** BullMQ offers monitoring and analytics capabilities, providing insights into job execution latency, and throughput. This allows ACAP to track performance metrics, identify bottlenecks, and optimize its job processing workflow for better efficiency.                                                         

By leveraging BullMQ, ACAP gains robust job management, scalability, fault tolerance, and monitoring capabilities, enabling it to handle large workloads, provide efficient task execution, and deliver a reliable and high-performance service to its users.

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
