
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

[MQTT](https://mqtt.org/) plays a crucial role in enhancing ACAP by addressing key communication challenges in the IoT ecosystem. With MQTT, ACAP benefits from the following features:                                                    

- **Lightweight and Efficient:** MQTT's lightweight nature ensures minimal bandwidth usage and a small footprint, allowing ACAP to optimize resource utilization while maintaining efficient communication between devices.

- **Reliable Message Delivery:** ACAP leverages MQTT's message queuing capabilities, enabling devices to reliably publish messages to specific topics. This ensures that important data is delivered without loss or duplication, guaranteeing the integrity of the information exchanged.                                                            
- **Scalability:** MQTT's scalable nature allows ACAP to accommodate a growing number of devices within the IoT ecosystem. As your service expands, MQTT ensures seamless and efficient communication, enabling ACAP to handle a large volume of messages without sacrificing performance.                                                           
- **Real-time Data Exchange:** MQTT's ability to handle unreliable networks makes it an ideal choice for ACAP. It ensures that real-time data exchange between devices occurs smoothly, even in challenging network conditions, enhancing the overall reliability and responsiveness of your service. By utilizing MQTT, ACAP leverages the power of this open-standard protocol to overcome communication hurdles, optimize resource usage, ensure reliable message delivery, and provide a scalable solution for real-time data exchange in IoT deployments.

### BullMQ

[BullMQ](https://docs.bullmq.io/), a powerful job and message queue library, brings several benefits to ACAP, enhancing its capabilities and performance. Here's how BullMQ benefits ACAP:                                                                       

- **Job Management:** BullMQ enables ACAP to efficiently manage and prioritize jobs within the system. It provides features such as job scheduling, retries, and prioritization, ensuring that tasks are executed in a controlled and organized manner.

- **Scalability and Performance:** BullMQ is designed to handle high volumes of jobs and messages, making it an ideal solution for scaling ACAP. It optimizes resource utilization, allowing ACAP to process tasks efficiently and maintain high performance even under heavy workloads.

- **Distributed Processing:** BullMQ supports distributed processing, allowing ACAP to distribute jobs across multiple workers or nodes. This enables parallel processing, improves overall system throughput, and enhances the speed of task execution.

- **Fault Tolerance:** BullMQ incorporates fault-tolerant mechanisms, ensuring that ACAP can recover from failures gracefully It provides features like job persistence and automatic retries, minimizing the impact of failures on the system's overall performance and reliability.

- **Monitoring and Analytics:** BullMQ offers monitoring and analytics capabilities, providing insights into job execution latency, and throughput. This allows ACAP to track performance metrics, identify bottlenecks, and optimize its job processing workflow for better efficiency.                                                         

By leveraging BullMQ, ACAP gains robust job management, scalability, fault tolerance, and monitoring capabilities, enabling it to handle large workloads, provide efficient task execution, and deliver a reliable and high-performance service to its users.

## Getting Started

**ACAP** offers a ready-to-use setup for easy initialization. It utilizes a config.yml file instead of relying solely on system variables, while still allowing you to set them if necessary. When using ACAP in Docker or K8S, you can easily map the config.yml file through the volumes. In the container, the config.yml file is located at `/app/dist/config/config-yml/config.yml` and for simplicity has been aliased as `/app/config.yml`.