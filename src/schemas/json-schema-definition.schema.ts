import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JsonSchemaDocument = JsonSchemaDefinition & Document;

@Schema({ timestamps: true })
export class JsonSchemaDefinition {
  @Prop({ required: true })
  realm: string;
}

export const JsonSchema = SchemaFactory.createForClass(JsonSchemaDefinition).index({ realm: 1 }, { unique: true });
