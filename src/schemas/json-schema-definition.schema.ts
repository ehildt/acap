import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JsonSchemaDocument = JsonSchemaDefinition & Document;

@Schema({ timestamps: true, autoIndex: true })
export class JsonSchemaDefinition {
  @Prop({ required: true, uppercase: true })
  realm: string;
}

export const JsonSchema = SchemaFactory.createForClass(JsonSchemaDefinition);

JsonSchema.index({ realm: 1 }, { unique: true });
