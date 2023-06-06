import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JsonSchemaConfigsDocument = JsonSchemaConfigsDefinition & Document;

@Schema({ timestamps: true, autoIndex: true })
export class JsonSchemaConfigsDefinition {
  @Prop({ required: true, uppercase: true })
  realm: string;

  @Prop({ required: true, uppercase: true })
  id: string;

  @Prop({ required: true })
  value: string;
}

export const JsonSchemaConfigsSchema = SchemaFactory.createForClass(JsonSchemaConfigsDefinition);

JsonSchemaConfigsSchema.index({ realm: 1, id: 1 }, { unique: true });
