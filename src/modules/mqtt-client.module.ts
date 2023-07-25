import { ConsoleLogger, DynamicModule, Inject, Injectable, Module } from '@nestjs/common';
import mqtt, { connect, IClientSubscribeOptions } from 'mqtt';

@Module({})
export class MqttClientModule {
  static registerAsync(options: MqttClientModuleOptions): DynamicModule {
    return {
      module: MqttClientModule,
      imports: options.imports ?? [],
      global: options.isGlobal,
      exports: [MQTT_CLIENT],
      providers: [
        ConsoleLogger,
        MqttClient,
        ...(options.providers ?? []),
        {
          provide: MQTT_CLIENT_OPTIONS,
          inject: options.inject ?? [],
          useFactory: options.useFactory,
        },
        {
          provide: MQTT_CLIENT,
          useExisting: MqttClient,
        },
      ],
    };
  }
}

export const MQTT_CLIENT = 'MQTT_CLIENT';
export type { MqttClient };

const MQTT_CLIENT_OPTIONS = 'MQTT_CLIENT_OPTIONS';
const ANONYMOUS_HANDLER = 'ANONYMOUS_HANDLER';

type Handler = (payload: string, topic?: string) => void;

type MqttClientModuleOptions = {
  imports?: Array<any>;
  inject?: Array<any>;
  providers?: Array<any>;
  isGlobal?: boolean;
  useFactory: (...deps: any) => MqttClientProps;
};

export type MqttClientProps = {
  brokerUrl?: string;
  options?: mqtt.IClientOptions;
};

@Injectable()
class MqttClient {
  private client: mqtt.MqttClient;
  private topics = new Map<string, Map<string, Handler>>();
  private topic: string;
  constructor(
    private readonly logger: ConsoleLogger,
    @Inject(MQTT_CLIENT_OPTIONS) private readonly props: MqttClientProps,
  ) {
    this.client = (props.brokerUrl ? connect(this.props.brokerUrl, this.props.options) : connect(this.props.options))
      .on('reconnect', () => this.logger.log(`reconnecting..`, MQTT_CLIENT))
      .on('disconnect', () => this.logger.log(`disconnected..`, MQTT_CLIENT))
      .on('error', (error) => this.logger.error(JSON.stringify(error, null, 4), MQTT_CLIENT))
      .on('message', (topic: string, payload: Buffer) => {
        this.topics.get(topic)?.forEach((handler) => handler?.(payload.toString(), topic));
      });
  }

  /**
   * publishes the payload to the `topic`
   * @param topic - as in the subscribed channel
   * @param payload - as in the data to be published
   * @param callback `(error) => void` is always called when provided
   */
  public publish(topic: string, payload: string | Buffer | Record<any, any>, callback?: mqtt.PacketCallback) {
    if (payload instanceof Buffer || typeof payload === 'string') this.client.publish(topic, payload, callback);
    else this.client.publish(topic, JSON.stringify(payload), callback);
  }

  /**
   * - subscribes to a topic
   * - skips duplicate subscriptions
   * - to register a handler call `subscribe('topic').use((payload) => {})`
   * @param topic - as in the channel to subscribe to
   * @returns
   */
  public subscribe(topic: string) {
    if (!this.topics.has(topic)) {
      this.topic = topic;
      this.topics.set(topic, new Map());
      this.client.subscribe(topic, (error) =>
        error ? this.logger.error(error) : this.logger.log(`SUBSCRIBED: ${topic}`, MQTT_CLIENT),
      );
    } else this.logger.warn(`SUBSCRIPTION_SKIPPED: ${topic} - already subscribed`, MQTT_CLIENT);
    return this;
  }

  /**
   * - inserts if not exists, otherwise updates a handler
   * - if chained, reuses the `topic` which is used on subscribe
   * @param handler - the handler to be upserted
   * @param descriptor - an optional identifier for handlers: `() => {}`
   * @param topic - as in the subscribed channel
   */
  public use(handler: Handler, descriptor?: string, topic?: string) {
    const handlerName = descriptor?.length ? descriptor : handler.name.length ? handler.name : ANONYMOUS_HANDLER;
    this.topics.get(topic ?? this.topic)?.set(handlerName, handler);
    return this;
  }

  /**
   * - removes a `handler` from a subscribed `topic`
   * - if chained, reuses the previous subscribed `topic`
   * @param handler - the handler to be removed
   * @param descriptor - an alternative identifier for the handler
   * @param topic - as in the subscribed channel
   */
  public eject(handler?: Handler, descriptor?: string, topic?: string) {
    const handlerName = descriptor?.length ? descriptor : handler.name.length ? handler.name : ANONYMOUS_HANDLER;
    this.topics.get(topic ?? this.topic)?.delete(handlerName);
    return this;
  }

  /**
   * - unsubscribes from a `topic`
   * - removes all handlers associated with that `topic`
   * @param topic - as in the subscribed channel
   * @param options - options of unsubscribe
   */
  public unsubscribe(topic: string, options?: IClientSubscribeOptions) {
    this.client.unsubscribe(topic, options, () => {
      this.topics.delete(topic) && this.logger.log(`${topic} unsubscribed`);
    });
    return this;
  }
}
