import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConfigManagerNamespacesDocument = ConfigManagerNamespaces & Document;

@Schema({ timestamps: true, autoIndex: true })
export class ConfigManagerNamespaces {
  @Prop({ required: true, uppercase: true })
  namespace: string;
}

export const ConfigManagerNamespacesSchema = SchemaFactory.createForClass(ConfigManagerNamespaces);

ConfigManagerNamespacesSchema.index({ namespace: 1 }, { unique: true });
