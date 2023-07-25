import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Ajv, { ValidateFunction } from 'ajv';

@Injectable()
export class AvjService {
  constructor(@Inject('AVJ_TOKEN') private readonly avj: Ajv) {}

  validate(config: any, schemaFunction?: ValidateFunction) {
    if (!schemaFunction) return;
    const isValid = schemaFunction(config);
    if (!isValid) throw schemaFunction.errors;
  }

  compile(schema: any) {
    try {
      return this.avj.compile(schema);
    } catch (error) {
      throw new BadRequestException('schema must be a boolean or object');
    }
  }
}
