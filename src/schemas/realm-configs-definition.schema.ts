import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RealmConfigsDocument = RealmConfigsSchemaDefinition & Document;

@Schema({ timestamps: true, autoIndex: true })
export class RealmConfigsSchemaDefinition {
  @Prop({ required: true, uppercase: true })
  realm: string;

  @Prop({ required: true, uppercase: true })
  id: string;

  @Prop({ required: true })
  value: string;
}

export const RealmConfigsSchema = SchemaFactory.createForClass(RealmConfigsSchemaDefinition);

RealmConfigsSchema.index({ realm: 1, id: 1 }, { unique: true });
