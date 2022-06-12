import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CONFIG_SOURCE } from '../constants/config-source.enum';

export type ConfigManagerDocument = ConfigManager & Document;

@Schema({ timestamps: true, autoIndex: true })
export class ConfigManager {
  @Prop({ required: true, uppercase: true })
  namespace: string;

  @Prop({ required: true, uppercase: true, unique: true })
  configId: string;

  @Prop({ required: true, enum: CONFIG_SOURCE })
  source: CONFIG_SOURCE;

  @Prop({ required: true })
  value: string;
}

export const ConfigManagerSchema = SchemaFactory.createForClass(ConfigManager);
