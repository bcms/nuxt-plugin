import * as http from 'http';
import { Context } from '@nuxt/types';
import { BCMSNuxtPlugin, BCMSNuxtPluginQueryFunction } from './types';

const bcmsNuxtPluginInitializer = (
  context: Context,
  inject: (name: string, plugin: any) => void,
) => {
  async function send<T>(
    type: 'find' | 'findOne',
    key: string,
    query: BCMSNuxtPluginQueryFunction<T>,
  ): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      const data = JSON.stringify({
        type,
        key,
        query: query.toString(),
      });
      let rawBody = '';
      const req = http.request(
        {
          hostname: 'localhost',
          port: 3002,
          path: `/`.replace(
            /\/\//g,
            '/',
          ),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        },
        (res) => {
          res.on(
            'data',
            (chunk) => {
              rawBody += chunk;
            },
          );
          res.on(
            'end',
            () => {
              const body = JSON.parse(rawBody);
              if (res.statusCode !== 200) {
                reject(body.message);
              } else {
                resolve(body);
              }
            },
          );
        },
      );
      req.on(
        'error',
        (error) => {
          reject(error);
        },
      );
      req.write(data);
      req.end();
    });
  }

  const bcmsNuxtPlugin: BCMSNuxtPlugin = {
    async findOne(template, query) {
      return await send('findOne', template, query);
    },
    async find(template, query) {
      throw Error('Not implemented.');
    }
  };

  inject('bcms', bcmsNuxtPlugin);
}

export default bcmsNuxtPluginInitializer;