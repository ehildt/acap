import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as yaml from 'js-yaml';
import { Observable } from 'rxjs';

@Injectable()
export class ParseYmlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    try {
      if (request.headers['content-type'] === 'application/x-yaml') {
        const ymlString = request.body.toString();
        request.body = yaml.load(ymlString, { json: true });
      }
    } catch (err) {
      throw new BadRequestException('Invalid YAML');
    }

    return next.handle();
  }
}
