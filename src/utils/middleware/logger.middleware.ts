import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;

    response.once('finish', () => {
      const { statusCode } = response;

      this.logger.debug(`${method} ${originalUrl} ${statusCode} - ${ip}`);
    });

    next();
  }
}
