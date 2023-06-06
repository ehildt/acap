import { Query } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';

class ParseOptionalIntPipe implements PipeTransform<string, number | undefined> {
  transform(value?: string) {
    if (value === undefined) return undefined;
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) return undefined;
    return parsedValue;
  }
}

export const QueryTake = () => Query('take', ParseOptionalIntPipe);
export const QuerySkip = () => Query('skip', ParseOptionalIntPipe);
