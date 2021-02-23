import * as http from 'http';
import { BCMSNuxtRouteType } from '../types';
import { BCMSMostPrototype } from '@becomes/cms-most';
import { ContentHandler, FunctionHandler } from './handlers';
import * as SocketIO from 'socket.io';

export function BCMSNuxtCreateServer(bcmsMost: BCMSMostPrototype) {
  return http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.end();
    } else {
      let rawBody = '';
      req.on('data', (chunk) => {
        rawBody += chunk;
      });
      req.on('end', async () => {
        let body: unknown;
        try {
          body = JSON.parse(rawBody);
        } catch (error) {
          res.statusCode = 400;
          res.write(JSON.stringify({ message: error.message }));
          res.end();
          return;
        }
        const route = Router.get(req.method, req.url);
        if (!route) {
          res.statusCode = 404;
          res.write(JSON.stringify({ message: 'Endpoint does not exist.' }));
        } else {
          try {
            await route.handler(req, res, body, bcmsMost);
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.write(JSON.stringify({ message: error.message }));
          }
        }
        res.end();
      });
    }
  });
}
export function BCMSNuxtCreateSocketServer(server: http.Server) {
  return new SocketIO.Server(server, {
    path: '/bcms/content/socket',
    serveClient: false,
    cors: {
      allowedHeaders: '*',
      origin: 'http://localhost:3000',
      methods: '*',
      credentials: true,
    },
    allowEIO3: true,
  });
}

const Router: {
  routes: BCMSNuxtRouteType<unknown>[];
  get<T>(method: string, path: string): BCMSNuxtRouteType<T> | undefined;
} = {
  get(method, path) {
    return Router.routes.find((e) => e.method === method && e.path === path);
  },
  routes: [
    {
      method: 'POST',
      path: '/',
      handler: ContentHandler,
    },
    {
      method: 'POST',
      path: '/function',
      handler: FunctionHandler,
    },
  ],
};
