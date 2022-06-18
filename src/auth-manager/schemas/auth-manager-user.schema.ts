import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthManagerUserDocument = AuthManagerUser & Document;

@Schema({ timestamps: true })
export class AuthManagerUser {
  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}

export const AuthManagerUserSchema =
  SchemaFactory.createForClass(AuthManagerUser);
