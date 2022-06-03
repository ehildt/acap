import { ApiProperty } from '@nestjs/swagger';

export const ValueProperty = () =>
  ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'object', title: 'Object' }],
  });
