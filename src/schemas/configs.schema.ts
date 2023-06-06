import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RealmConfigsDocument = RealmConfigs & Document;

@Schema({ timestamps: true, autoIndex: true })
export class RealmConfigs {
  @Prop({ required: true, uppercase: true })
  realm: string;

  @Prop({ required: true, uppercase: true })
  configId: string;

  @Prop({ required: true })
  value: string;
}

export const RealmConfigsSchema = SchemaFactory.createForClass(RealmConfigs);

RealmConfigsSchema.index({ realm: 1, configId: 1 }, { unique: true });
