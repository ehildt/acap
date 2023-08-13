import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JsonSchemaContentsDocument = JsonSchemaContentsDefinition & Document;

@Schema({ timestamps: true, autoIndex: true })
export class JsonSchemaContentsDefinition {
  @Prop({ required: true, uppercase: true })
  realm: string;

  @Prop({ required: true, uppercase: true })
  id: string;

  @Prop({ required: true })
  value: string;
}

export const JsonSchemaContentSchema = SchemaFactory.createForClass(JsonSchemaContentsDefinition);

JsonSchemaContentSchema.index({ realm: 1, id: 1 }, { unique: true });
