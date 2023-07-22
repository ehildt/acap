import { ConsoleLogger, DynamicModule, Inject, Injectable, Module } from '@nestjs/common';
import mqtt from 'mqtt';

export const MQTT_CLIENT = 'MQTT_CLIENT';
export type { MqttClient };

const MQTT_CLIENT_OPTIONS = 'MQTT_CLIENT_OPTIONS';
const DEFAULT = 'DEFAULT';

type Handler = (payload: string, topic?: string) => void;

type MqttClientModuleOptions = {
  imports?: Array<any>;
  inject?: Array<any>;
  providers?: Array<any>;
  isGlobal?: boolean;
  useFactory: (...deps: any) => mqtt.IClientOptions;
};

@Injectable()
class MqttClient {
  private client: mqtt.MqttClient;
  private topics = new Map<string, Map<string, Handler>>();
  constructor(
    private readonly logger: ConsoleLogger,
    @Inject(MQTT_CLIENT_OPTIONS) private readonly options: mqtt.IClientOptions,
  ) {
    this.client = mqtt
      .connect(options)
      .on('connect', () => this.logger.log(`${this.options.hostname} (connected)`, MQTT_CLIENT))
      .on('reconnect', () => this.logger.log(`reconnecting to ${this.options.hostname} ..`, MQTT_CLIENT))
      .on('disconnect', () => this.logger.log(`${this.options.hostname} (disconnected)`, MQTT_CLIENT))
      .on('error', (error) => this.logger.log(error, MQTT_CLIENT))
      .on('message', (topic: string, payload: Buffer) => {
        this.topics.get(topic)?.forEach((handler) => handler?.(payload.toString(), topic));
      });
  }

  public publish(topic: string, payload: string | Buffer | Record<any, any>, callback?: mqtt.PacketCallback) {
    if (payload instanceof Buffer || typeof payload === 'string') this.client.publish(topic, payload, callback);
    else this.client.publish(topic, JSON.stringify(payload), callback);
  }

  public subscribe(topic: string, handler: Handler, descriptor?: string) {
    const handlerName = descriptor?.length ? descriptor : handler.name.length ? handler.name : DEFAULT;
    if (!this.topics.has(topic)) {
      this.topics.set(topic, new Map().set(handlerName, handler));
      this.client.subscribe(topic, (error) => {
        if (error) this.logger.error(error);
        else this.logger.log(`${topic} ${handlerName} subscribed`, MQTT_CLIENT);
      });
    } else {
      const handlerMap = this.topics.get(topic);
      if (!handlerMap.has(handlerName)) {
        handlerMap.set(handlerName, handler);
        this.logger.log(`${topic} ${handlerName} subscribed`, MQTT_CLIENT);
      } else this.logger.warn(`${topic} ${handlerName} skipping, already subscribed`, MQTT_CLIENT);
    }
  }

  public resubscribe(topic: string, handler: Handler, descriptor?: string) {
    const handlerName = descriptor?.length ? descriptor : handler.name.length ? handler.name : DEFAULT;
    this.topics.get(topic)?.set(handlerName, handler);
  }

  public ejectHandler(topic: string, handler?: Handler, descriptor?: string) {
    const handlerName = descriptor?.length ? descriptor : handler.name.length ? handler.name : DEFAULT;
    this.topics.get(topic)?.delete(handlerName);
  }

  public unsubscribe(topic: string, options?: Record<string, any>) {
    this.client.unsubscribe(topic, options, () => {
      this.topics.delete(topic) && this.logger.log(`${topic} unsubscribed`);
    });
  }
}

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
