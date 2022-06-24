import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../constants/role.enum';

export type AuthManagerUserDocument = AuthManagerUser & Document;

@Schema({ timestamps: true })
export class AuthManagerUser {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ required: true })
  claims: string[];
}

export const AuthManagerUserSchema =
  SchemaFactory.createForClass(AuthManagerUser);
