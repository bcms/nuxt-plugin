import type { IncomingMessage, ServerResponse } from 'http';
import type { BCMSNuxtPlugin } from './plugin';

export interface BCMSNuxtServerMiddlewareHandler<
  Result = void,
  Body = unknown,
> {
  (data: {
    bcms: BCMSNuxtPlugin;
    req: IncomingMessage;
    res: ServerResponse;
    next(err?: unknown): void;
    params: {
      [name: string]: string;
    };
    query: {
      [name: string]: string;
    };
    body: Body;
  }): Promise<Result>;
}
