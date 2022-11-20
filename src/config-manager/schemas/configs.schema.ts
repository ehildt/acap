import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConfigManagerConfigsDocument = ConfigManagerConfigs & Document;

@Schema({ timestamps: true, autoIndex: true })
export class ConfigManagerConfigs {
  @Prop({ required: true, uppercase: true })
  namespace: string;

  @Prop({ required: true, uppercase: true })
  configId: string;

  @Prop({ required: true })
  value: string;
}

export const ConfigManagerConfigsSchema = SchemaFactory.createForClass(ConfigManagerConfigs);

ConfigManagerConfigsSchema.index({ namespace: 1, configId: 1 }, { unique: true });
