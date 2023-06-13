import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RealmsDocument = RealmsSchemaDefinition & Document;

@Schema({ timestamps: true, autoIndex: true })
export class RealmsSchemaDefinition {
  @Prop({ required: true, uppercase: true })
  realm: string;
}

export const RealmsSchema = SchemaFactory.createForClass(RealmsSchemaDefinition);

RealmsSchema.index({ realm: 1 }, { unique: true });
