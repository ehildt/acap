import { ParseIntPipe, Query } from '@nestjs/common';

export const QueryTake = () => Query('take', ParseIntPipe);
export const QuerySkip = () => Query('skip', ParseIntPipe);
