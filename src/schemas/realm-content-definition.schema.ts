import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RealmContentsDocument = RealmContentsSchemaDefinition & Document;

@Schema({ timestamps: true, autoIndex: true })
export class RealmContentsSchemaDefinition {
  @Prop({ required: true, uppercase: true })
  realm: string;

  @Prop({ required: true, uppercase: true })
  id: string;

  @Prop({ required: true })
  value: string;
}

export const RealmContentsSchema = SchemaFactory.createForClass(RealmContentsSchemaDefinition);

RealmContentsSchema.index({ realm: 1, id: 1 }, { unique: true });
