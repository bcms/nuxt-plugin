import type { IncomingMessage, ServerResponse } from 'http';
import type { BCMSMostPrototype } from '@becomes/cms-most';

export interface BCMSNuxtRouteType<T> {
  method: string;
  path: string;
  handler: BCMSNuxtRouteHandler<T>;
}

export type BCMSNuxtRouteHandler<T> = (
  req: IncomingMessage,
  res: ServerResponse,
  body: T,
  bcmsMost: BCMSMostPrototype,
) => Promise<void>;
