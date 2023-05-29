import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RealmsDocument = Realms & Document;

@Schema({ timestamps: true, autoIndex: true })
export class Realms {
  @Prop({ required: true, uppercase: true })
  realm: string;
}

export const RealmsSchema = SchemaFactory.createForClass(Realms);

RealmsSchema.index({ realm: 1 }, { unique: true });
