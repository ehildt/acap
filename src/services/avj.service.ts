import { Inject, Injectable } from '@nestjs/common';
import Ajv from 'ajv';

@Injectable()
export class AvjService {
  constructor(@Inject('AVJ_TOKEN') private readonly avj: Ajv) {}

  validate(config: any, schema?: Record<any, any>) {
    if (!schema) return;
    const validate = this.avj.compile(schema);
    const isValid = validate(config);
    if (!isValid) throw validate.errors;
  }
}
