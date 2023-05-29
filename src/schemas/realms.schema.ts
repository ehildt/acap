import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigManagerRealmsDocument = ConfigManagerRealms & Document;

@Schema({ timestamps: true, autoIndex: true })
export class ConfigManagerRealms {
  @Prop({ required: true, uppercase: true })
  realm: string;
}

export const ConfigManagerRealmsSchema = SchemaFactory.createForClass(ConfigManagerRealms);

ConfigManagerRealmsSchema.index({ realm: 1 }, { unique: true });
