import { Test, TestingModule } from '@nestjs/testing';

import { GlobalAvJModule } from '@/modules/global-ajv.module';

import { AvjService } from './avj.service';

describe('AvjService', () => {
  let service: AvjService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [GlobalAvJModule],
    }).compile();

    service = moduleRef.get<AvjService>(AvjService);
  });

  describe('validate', () => {
    test('should throw an error when schema validation fails', () => {
      const schemaFunction = service.compile({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number', minimum: 18 },
          email: { type: 'string', format: 'email' },
        },
        required: ['name', 'age'],
      });
      const invalidConfig = {
        name: 'John',
        age: 15,
        email: 'invalidemail',
      };

      expect(() => service.validate(invalidConfig, schemaFunction)).toThrow();
    });

    test('should not throw an error when schema validation passes', () => {
      const schemaFunction = service.compile({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number', minimum: 18 },
          email: { type: 'string', format: 'email' },
        },
        required: ['name', 'age'],
      });
      const validConfig = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
      };

      expect(() => service.validate(validConfig, schemaFunction)).not.toThrow();
    });

    test('should not throw an error when called without a schemaFunction', () => {
      const config = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
      };

      expect(() => service.validate(config)).not.toThrow();
    });
  });

  describe('compile', () => {
    test('should return a compiled schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number', minimum: 18 },
          email: { type: 'string', format: 'email' },
        },
        required: ['name', 'age'],
      };

      const compiledSchema = service.compile(schema);
      expect(compiledSchema).toEqual(expect.any(Function));
    });

    test('should return undefined when called without a schema', () => {
      const compiledSchema = service.compile(undefined);
      expect(compiledSchema).toBeUndefined();
    });
  });
});
