import { Inject, Injectable } from '@nestjs/common';
import Ajv from 'ajv';

@Injectable()
export class AvjService {
  constructor(@Inject('AVJ_TOKEN') private readonly avj: Ajv) {}

  validate(schema: Record<any, any>, config: any) {
    const validate = this.avj.compile(schema);
    const isValid = validate(config);
    if (!isValid) throw validate.errors;
  }
}
