import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthManagerUserDocument = AuthManagerUser & Document;

@Schema({ timestamps: true })
export class AuthManagerUser {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hash: string;
}

export const AuthManagerUserSchema =
  SchemaFactory.createForClass(AuthManagerUser);
