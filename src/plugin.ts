import * as http from 'http';
import { Context } from '@nuxt/types';
import {
  BCMSNuxtPlugin, BCMSNuxtQueryConfig,
} from './types';
import * as SocketIO from 'socket.io-client';

const bcmsNuxtPluginInitializer = (
  context: Context,
  inject: (name: string, plugin: any) => void,
) => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const io = SocketIO(
      'ws://localhost:3002',
      {
        path: '/bcms/content/socket/',
      },
    );
    io.on(
      'reload',
      () => {
        window.location.reload();
      },
    );
  }

  function fixFunctionString(input: string): string {
    if (input.startsWith('function (')) {
      return input
        .replace(
          'function ',
          '',
        )
        .replace(
          ') {',
          ' => {',
        );
    }
    return input;
  }

  async function send<T, K>(
    type: 'find' | 'findOne',
    key: string,
    config: BCMSNuxtQueryConfig<T, K>,
  ): Promise<K> {
    return await new Promise<K>((resolve, reject) => {
      let queryString = fixFunctionString(config.query.toString());
      let filterString = config.filter
                         ? fixFunctionString(config.filter.toString())
                         : undefined;
      let sortString = config.sort
                       ? fixFunctionString(config.sort.toString())
                       : undefined;
      let sliceString = config.slice ? config.slice : undefined;

      const data = JSON.stringify({
        type,
        key,
        variables: config.variables ? config.variables : {},
        filter: filterString,
        sort: sortString,
        slice: sliceString,
        query: queryString,
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
    async findOne(template, config) {
      return await send(
        'findOne',
        template,
        config,
      );
    },
    async find(template, config) {
      return await send(
        'find',
        template,
        config,
      );
    },
  };

  inject(
    'bcms',
    bcmsNuxtPlugin,
  );
};

export default bcmsNuxtPluginInitializer;
