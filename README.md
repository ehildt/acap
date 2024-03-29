<h1 align="center">
Adaptive Content Aggregation Proxy (ACAP)
</h1>

<div align="center">

`The ideal time to grow a business was yesterday, but the next best time to invest in one is now.`

ACAP is a cutting-edge system designed to revolutionize content distribution and engagement. With its dynamic and adaptable features, it ensures that your clients and services receive the right content at the right time. ACAP responds in real-time to changing needs and preferences, guaranteeing a seamless and personalized experience. Its automated processes make content distribution effortless, allowing you to focus on what matters most. Moreover, ACAP empowers you to enhance user engagement by delivering timely, relevant, and diverse content through its platform or channels. This means increased customer satisfaction and loyalty, leading to business growth. Say goodbye to static and cumbersome content management and hello to ACAP's game-changing capabilities.

</div>

<div align="center">
<details>
<summary>Expand to read where it delivers!</summary>
</br>

${\color{gold}Dynamic \space and \space Adaptable \space Content \space Distribution}$  
ACAP ensures that other services receive the right content at the right time by dynamically adapting to their changing needs and preferences. This enhances content distribution for other services, providing them with a flexible and adaptable solution.

${\color{gold}Real-time \space Responsiveness}$  
ACAP responds in real-time to the evolving needs and preferences of other services, ensuring a seamless and personalized experience. Its real-time responsiveness guarantees enhanced user engagement and satisfaction, as content is delivered promptly to meet their demands.

${\color{gold}Effortless \space Content \space Distribution}$  
ACAP automates content distribution processes, relieving other services from the burden of manual distribution tasks. With ACAP handling the efficient distribution of content, other services can focus on their core functionality, minimizing effort and maximizing productivity.

${\color{gold}Enhanced \space User \space Engagement}$  
ACAP empowers other services to deliver timely, relevant, and diverse content, enhancing user engagement. By leveraging ACAP's platform and channels, other services can optimize their content delivery strategies, resulting in increased user interaction and satisfaction.

${\color{gold}Increased \space Customer \space Satisfaction \space and \space Loyalty}$  
By delivering personalized and relevant content, ACAP helps other services improve customer satisfaction and foster loyalty. This, in turn, can lead to business growth and customer retention, driving long-term success for those services.

</details>
</div>
</br>
<div align="center">

![Name](https://img.shields.io/badge/open_source-ACAP-gold)
![License](https://img.shields.io/github/license/ehildt/acap?style=flat&color=brown)
![semantic-release](https://img.shields.io/badge/semantic-release-e10079?logo=semantic-release)
![DockerPulls](https://img.shields.io/docker/pulls/ehildt/acap?color=darkgreen&label=docker%20pulls&logo=docker)  
![Branch](https://img.shields.io/badge/branch-main-blue?style=flat&logo=git&logoColor=white)
![Version](https://img.shields.io/github/package-json/v/ehildt/acap?style=flat&color=orange)
![Node](https://img.shields.io/badge/node-LTS-purple?style=flat&logo=node.js&logoColor=white)
![BuildStatus](https://img.shields.io/badge/build-passing-darkgreen?style=flat&logo=github&logoColor=white)
![codecov](https://codecov.io/gh/ehildt/acap/graph/badge.svg?token=MCL18OCNV7)

</div>

  <div align="center">

powered by

![NestJs](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/bullmq-%233C5280?style=for-the-badge&logo=redis&logoColor=white)
![PubSub](https://img.shields.io/badge/pubsub-aC5cce?style=for-the-badge&logo=redis&logoColor=white)  
![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)  
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Lerna Version](https://img.shields.io/badge/Lerna-9333EA.svg?style=for-the-badge&logo=Lerna&logoColor=white)
![Nx Version](https://img.shields.io/badge/Nx-143055.svg?style=for-the-badge&logo=Nx&logoColor=white)

  </div>
</div>
</br>

<div align="center">
<h1>
Table of Contents
</h1>

[Getting Started](#Getting-Started)  
[Example Use Cases](#Example-Use-Cases)  
[Whats in the box?](#Whats-in-the-box)  
[Content Validation](#Content-Validation)  
[Content Encryption](#Content-Encryption)  
[Redis](#Redis)  
[Redis Publish Subscribe](#Redis-Publish-Subscribe)  
[MQTT](#MQTT)  
[BullMQ](#BullMQ)  
[Outbreak API](#Outbreak-API)

</div>
</br>

<h1 align="center">
Getting Started
</h1>
</br>

Install Lerna & Nx by running the command `npm i -g lerna nx pnpm`. In the project root run `pnpm install`, then `docker compose up backend`. The frontend is still WIP. You can run it with `lerna run dev --scope frontend`. You can run Storybook with `lerna run storybook --scope ui`. In case you would like to take a look at some stable react components, we recommend the Scrollbar, Slider, PageMenu and the SelectBox components.

**ACAP** simplifies the initialization process by providing a convenient ready-to-use setup. It leverages a `config.yml` file, reducing dependence on system environment variables, while still allowing flexibility to set them when required.

When utilizing ACAP in Docker or Kubernetes (K8S), configuring the service is effortless. By binding the `/app/config.yml` to a volume, you can easily adjust the service settings. The `config.yml` file contains default presets, which, when combined with Docker Compose, enable a speedy setup for local development. This approach facilitates a seamless spin-up process for your projects.

<details align="center">
<summary>Expand to see the sample config.yml file</summary>
</br>
<div align="left">

```yml
appConfig:
  port: 3001
  address: 0.0.0.0
  printEnv: true
  startSwagger: true
  nodeEnv: "local"
  crypto:
    secret: null
  realm:
    ttl: 300
    resolveEnv: false
    namespacePostfix: ACAP
    gzipThreshold: 20
  brokers:
    useRedisPubSub: false
    useBullMQ: false
    useMQTT: false

mongoConfig:
  uri: mongodb://mongo:27017
  ssl: false
  tlsAllowInvalidCertificates: true
  dbName: ACAP
  user: mongo
  pass: mongo

redisConfig:
  host: redis
  port: 6379
  ttl: 600
  max: 100
  db: 0
  password: redis
  username: default

redisPubSubConfig:
  options:
    port: 6379
    host: redis
    password: redis
    username: default

bullMQConfig:
  connection:
    port: 6379
    host: redis
    password: redis
    username: default

mqttClientConfig:
  brokerUrl: null
  options:
    port: 1883
    keepalive: 5000
    connectTimeout: 5000
    reconnectPeriod: 1000
    resubscribe: true
    protocol: "mqtt"
    hostname: mosquitto
    username: null
    password: null
```

</div>
</details>

<details align="center">
<summary>Expand to see the sample docker compose file</summary>
</br>
<div align="left">

```yml
version: "3.9"
brokers:
  acap:
    container_name: acap
    build:
      context: https://github.com/ehildt/ACAP.git
      target: production
    depends_on:
      - mongo
      - redis
      - mosquitto
    volumes:
      - ./config.yml:/app/config.yml
    ports:
      - 3001:3001

  mongo:
    command: mongod --wiredTigerCacheSizeGB 1.5 --logpath /dev/null
    image: mongo
    container_name: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=mongo
      - MONGO_INITDB_DATABASE=ACAP
    volumes:
      - mongo_acap_data:/data/db
    ports:
      - 27017:27017

  redis:
    image: redis
    container_name: redis
    ports:
      - 6379:6379
    command: redis-server --requirepass "redis" --loglevel "warning"

  # We use Mosquitto for demonstration purposes.
  # You are free to choose any MQTT service you prefer.
  mosquitto:
    image: eclipse-mosquitto
    container_name: mosquitto
    ports:
      - 1883:1883
      - 9001:9001
    volumes:
      - mosquitto_data:/mosquitto/data
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
      - mosquitto_log:/mosquitto/log

volumes:
  mongo_acap_data:
  mosquitto_data:
  mosquitto_config:
  mosquitto_log:

networks:
  default:
    name: ACAP_NETWORK
```

</div>
</details>

As mentioned earlier, you can still utilize system environment variables either in conjunction with the config.yml file. System environment variables, if set, take precedence over the values specified in the config.yml file. Here are the system environment variables that are available for utilization.

<details align="center">
<summary>Expand to see the sample .env file</summary>
</br>
<div align="left">

```sh
PORT=3001
ADDRESS='0.0.0.0'
NODE_ENV='local'
REALM_TTL=300
REALM_NAMESPACE_POSTFIX='ACAP'  # Optional
REALM_GZIP_THRESHOLD=20         # Kilobyte
PRINT_ENV=false                 # Default
START_SWAGGER=false             # Default
REALM_RESOLVE_ENV=false         # Default
USE_REDIS_PUBSUB=false          # Default
USE_BULLMQ=false                # Default
USE_MQTT=false                  # Default
SYMMETRIC_KEY=''                # Optional - 16, 24, 32 byte of key length

REDIS_PUBSUB_PORT=6379
REDIS_PUBSUB_USER='default'
REDIS_PUBSUB_PASS='redis'
REDIS_PUBSUB_HOST='redis'

BULLMQ_REDIS_PORT=6379
BULLMQ_REDIS_USER='default'
BULLMQ_REDIS_PASS='redis'
BULLMQ_REDIS_HOST='redis'

MQTT_KEEPALIVE=5000             # Milliseconds
MQTT_CONNECTION_TIMEOUT=5000    # Milliseconds
MQTT_RECONNECT_PERIOD=1000      # Milliseconds
MQTT_PORT=1883                  # Default
MQTT_PROTOCOL='mqtt'            # Default
MQTT_RESUBSCRIBE=true           # Default
MQTT_BROKER_URL=''              # Optional
MQTT_HOSTNAME=''                # Optional
MQTT_USERNAME=''                # Optional
MQTT_PASSWORD=''                # Optional

MONGO_USER='mongo'
MONGO_PASS='mongo'
MONGO_DB_NAME='ACAP'
MONGO_URI='mongodb://mongo:27017'
MONGO_SSL=false
MONGO_TLS_ALLOW_INVALID_CERTIFICATES=true

REDIS_USER='default'
REDIS_PASS='redis'
REDIS_HOST='redis'
REDIS_PORT=6379
REDIS_TTL=600
REDIS_MAX_RESPONSES=100
REDIS_DB_INDEX=0
```

</div>
</details>

With this, you have everything you need to make the ACAP your own and harness its full potential to power your applications and drive business growth.

</br>

## Example Use Cases

One example use case for ACAP could be serving base64-encoded images to web clients. This setup allows for dynamic switching of content on the fly, similar to how it is commonly done in a content management system (CMS). Of course, this capability is not limited solely to images.

Another use case could involve inter-service communication, enabling a centralized configuration as a single source of truth. This can be achieved by leveraging technologies such as **bullMQ**, **MQTT** and **RedisPubSub** which facilitate real-time provision and distribution of these configurations.

There are instances where utilizing ACAP as a proxy can be advantageous. By creating content that references external sources holding the required datasets, you can leverage the capabilities of ACAP without the need for directly handling large datasets. This approach greatly enhances the efficiency of data retrieval and management.

In certain scenarios, there may be a need to describe and validate content. ACAP accomplishes this by utilizing JSON schema with the help of **avj**. In IDEs like **Visual Studio Code** and similar environments, you have the ability to link the **$schema** , which enables highlighting and validation. Alternatively, you can fetch the schema on the client side and perform data validation in real time during runtime.

</br>

## Whats in the box?

Postman, Insomnia and Swagger OpenApi were yesterday! ACAP delivers a sleek, modern, and intuitive user interface, designed to effortlessly manage and organize your content (**WIP**). With crisp content management and immediate processing, your experience is seamless and efficient. ACAP simplifies the process for developers to enable or disable optional features like Redis Publish Subscribe, MQTT, and BullMQ as per their requirements.

</br>

### Content Validation

When creating and managing content, you can freely choose between a strict or lenient approach to describe its structure. Validation of your content involves checking if a JSON schema matches the content. ACAP knows which content belongs to which schema by simply referencing the realm identifier. In simpler terms, if you create content with a realm value of **MY_REALM** and a schema that also has a realm value of **MY_REALM**, your content will be validated against that schema. The content itself is not bound to any particular structure or value. It even has the capability to fetch system variables when enabled, as long as the content identifier matches the specified system variable key. By default, this feature is disabled to ensure security. For a more comprehensive understanding of content and schema declarations, please refer to the [Wiki](https://github.com/ehildt/ACAP/wiki/ACAP).

`This powerful feature provides industry-leading flexibility in managing content structure, empowering companies to customize and validate their content with ease and efficiency. Experience unparalleled control and adaptability in content management, unlocking new possibilities for your business's success.`

</br>

### Content Encryption

In ACAP, we prioritize your freedom of choice, including your security preferences. By default, ACAP conducts content upserts without encryption, suitable for most scenarios. However, recognizing the paramount importance of data security, we empower you to strengthen defenses by encrypting content before it's stored.

Within ACAP, we leverage the globally recognized Advanced Encryption Standard (AES). You have access to multiple block cipher modes: AES-256-CBC, AES-192-CBC, and AES-128-CBC, with respective key lengths of 32, 24, and 16 bytes.

In essence, these AES-CBC modes form a robust security foundation. Your choice depends on specific security and performance needs. Opt for AES-256-CBC for peak security, accepting a slight performance trade-off. Or choose AES-128-CBC, delivering strong security without performance compromise. For a balanced blend, consider AES-192-CBC.

With ACAP, it's your data, your choice, fortified by our robust security options. Elevate your data protection standards while retaining the flexibility to apply encryption as you see fit. Your security, your way, with ACAP's formidable security toolkit.

<div align="center">
<details>
<summary>Expand to get more insight into AES</summary>
</br>

${\color{pink}AES-256-CBC}$

Security: AES-256-CBC uses a 256-bit key, which provides a very high level of security. As of 2021, it is considered highly secure and resistant to brute force attacks. The key length is so long that it would require an astronomical amount of computational power and time to break the encryption by trying all possible keys. Drawbacks: The main drawback of AES-256-CBC is its computational overhead. Encrypting and decrypting data with a longer key can be slower compared to AES-128-CBC or AES-192-CBC. This difference may not be noticeable for small amounts of data but could become significant for large datasets or high-throughput applications.

${\color{pink}AES-192-CBC}$

Security: AES-192-CBC uses a 192-bit key, which is also considered very secure. It strikes a balance between the strong security of AES-256-CBC and the computational efficiency of AES-128-CBC. Drawbacks: Like AES-256-CBC, the main drawback is the computational overhead, although it's generally slightly faster than AES-256-CBC. It may be a good choice when you need strong security but want slightly better performance than AES-256-CBC.

${\color{pink}AES-128-CBC}$

Security: AES-128-CBC uses a 128-bit key, which is still considered secure but is theoretically more susceptible to brute force attacks compared to AES-192-CBC and AES-256-CBC. However, in practice, it offers a high level of security for most applications. Drawbacks: The primary advantage of AES-128-CBC is its speed and lower computational overhead. It's generally faster than AES-192-CBC and AES-256-CBC. The drawback is that, in rare cases of highly motivated attackers with immense computational resources, it might be less secure compared to the longer key lengths.

</details>
</div>
</br>

### Redis

Under the hood, ACAP utilizes [Redis](https://redis.io/docs/) for optimization. It efficiently updates the cache whenever the content is modified, except during the initial creation. If existing content is updated, the cache is also updated as long as the content is currently cached. When fetching the content, and if it already exists in the cache, the time-to-live (TTL) is reset. This approach minimizes unnecessary database I/O operations. Otherwise the content is fetched from the database and populated in the cache.

`The Redis cache is a highly efficient in-memory key-value storage system. ACAP further enhances its capabilities by introducing a dynamic content management system, adding flexibility and versatility to its functionality.`

</br>

### Redis Publish Subscribe

ACAP supports [Redis Publish Subscribe](https://redis.io/docs/interact/pubsub/). When this feature is enabled, ACAP automatically publishes content using the realm as the channel, which can be subscribed to by other clients and services. The **fire-and-forget** strategy for **Redis Publish Subscribe** ensures non-blocking transmission, allowing for a seamless content distribution without any interruptions.

</br>

### MQTT

[MQTT](https://mqtt.org/) plays a crucial role in enhancing ACAP by addressing key communication challenges in the IoT ecosystem. With MQTT, ACAP benefits from the following features:

- **Lightweight and Efficient:** MQTT's lightweight nature ensures minimal bandwidth usage and a small footprint, allowing ACAP to optimize resource utilization while maintaining efficient communication between devices.

- **Reliable Message Delivery:** ACAP leverages MQTT's message queuing capabilities, enabling devices to reliably publish messages to specific topics. This ensures that important data is delivered without loss or duplication, guaranteeing the integrity of the information exchanged.
- **Scalability:** MQTT's scalable nature allows ACAP to accommodate a growing number of devices within the IoT ecosystem. As your service expands, MQTT ensures seamless and efficient communication, enabling ACAP to handle a large volume of messages without sacrificing performance.
- **Real-time Data Exchange:** MQTT's ability to handle unreliable networks makes it an ideal choice for ACAP. It ensures that real-time data exchange between devices occurs smoothly, even in challenging network conditions, enhancing the overall reliability and responsiveness of your service. By utilizing MQTT, ACAP leverages the power of this open-standard protocol to overcome communication hurdles, optimize resource usage, ensure reliable message delivery, and provide a scalable solution for real-time data exchange in IoT deployments.

</br>

### BullMQ

[BullMQ](https://docs.bullmq.io/), a powerful job and message queue library, brings several benefits to ACAP, enhancing its capabilities and performance. Here's how BullMQ benefits ACAP:

- **Job Management:** BullMQ enables ACAP to efficiently manage and prioritize jobs within the system. It provides features such as job scheduling, retries, and prioritization, ensuring that tasks are executed in a controlled and organized manner.

- **Scalability and Performance:** BullMQ is designed to handle high volumes of jobs and messages, making it an ideal solution for scaling ACAP. It optimizes resource utilization, allowing ACAP to process tasks efficiently and maintain high performance even under heavy workloads.

- **Distributed Processing:** BullMQ supports distributed processing, allowing ACAP to distribute jobs across multiple workers or nodes. This enables parallel processing, improves overall system throughput, and enhances the speed of task execution.

- **Fault Tolerance:** BullMQ incorporates fault-tolerant mechanisms, ensuring that ACAP can recover from failures gracefully It provides features like job persistence and automatic retries, minimizing the impact of failures on the system's overall performance and reliability.

- **Monitoring and Analytics:** BullMQ offers monitoring and analytics capabilities, providing insights into job execution latency, and throughput. This allows ACAP to track performance metrics, identify bottlenecks, and optimize its job processing workflow for better efficiency.

By leveraging BullMQ, ACAP gains robust job management, scalability, fault tolerance, and monitoring capabilities, enabling it to handle large workloads, provide efficient task execution, and deliver a reliable and high-performance service to its users.

## Outbreak API

ACAP offers a convenient way to bypass its internal mechanisms that handle content persistence in the database and cache algorithm. Instead, you can effortlessly delegate the content directly to Redis Publish Subscribe, bullMQ, and MQTT. This functionality effectively covers edge cases where developers need to trigger events without relying on ACAP's underlying mechanisms. By utilizing these services, developers gain greater flexibility in managing content and achieving specific requirements within ACAP.

**CAVEAT -** It is important to understand that due to certain technical constraints, modifying the channel for the bullMQ through which the content is sent is not possible. Therefore, all data must still be routed through the predefined channel known as `ACAP_BULLMQ_REALM_QUEUE`. This limitation restricts the flexibility in selecting alternative channels for specific data. However, when it comes to Redis Publish Subscribe and MQTT, the channel corresponds to the respective REALM to which the content is sent. Nonetheless, ACAP's integration with Redis Publish Subscribe, bullMQ, and MQTT empowers developers to leverage their functionalities, thereby enabling enhanced event triggering and management capabilities.

---

`Get in touch with us if you're eager to contribute to ACAP and show your support, or show some love by treating us to a beer or coffee. We appreciate any form of collaboration and generosity!`
