import * as http from 'http';
import { Context } from '@nuxt/types';
import { BCMSNuxtPlugin, BCMSNuxtQueryConfig } from './types';
import {io as IO} from 'socket.io-client';

const bcmsNuxtPluginInitializer = (
  context: Context,
  inject: (name: string, plugin: unknown) => void,
) => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const io = IO('ws://localhost:3002', {
      path: '/bcms/content/socket/',
    });
    io.on('reload', () => {
      window.location.reload();
    });
  }

  function fixFunctionString(input: string): string {
    if (input.startsWith('function (')) {
      return input.replace('function ', '').replace(') {', ' => {');
    }
    return input;
  }
  async function send<T, K>(
    type: 'find' | 'findOne',
    key: string,
    config: BCMSNuxtQueryConfig<T, K>,
  ): Promise<K> {
    return await new Promise<K>((resolve, reject) => {
      const queryString = fixFunctionString(config.query.toString());
      const filterString = config.filter
        ? fixFunctionString(config.filter.toString())
        : undefined;
      const sortString = config.sort
        ? fixFunctionString(config.sort.toString())
        : undefined;
      const sliceString = config.slice ? config.slice : undefined;

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
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        },
        (res) => {
          res.on('data', (chunk) => {
            rawBody += chunk;
          });
          res.on('end', () => {
            const body = rawBody ? JSON.parse(rawBody) : undefined;
            if (res.statusCode !== 200) {
              reject(body.message);
            } else {
              resolve(body);
            }
          });
        },
      );
      req.on('error', (error) => {
        reject(error);
      });
      req.write(data);
      req.end();
    });
  }

  const bcmsNuxtPlugin: BCMSNuxtPlugin = {
    async findOne(template, config) {
      return await send('findOne', template, config);
    },
    async find(template, config) {
      return await send('find', template, config);
    },
    async functionData<T>(name) {
      return await new Promise<T>((resolve, reject) => {
        const data = JSON.stringify({
          name,
        });
        let rawBody = '';
        const req = http.request(
          {
            hostname: 'localhost',
            port: 3002,
            path: '/function',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length,
            },
          },
          (res) => {
            res.on('data', (chunk) => {
              rawBody += chunk;
            });
            res.on('end', () => {
              const body = rawBody ? JSON.parse(rawBody) : undefined;
              if (res.statusCode !== 200) {
                reject(Error(body.message));
              } else {
                resolve(body);
              }
            });
          },
        );
        req.on('error', (error) => {
          reject(error);
        });
        req.write(data);
        req.end();
      });
    },
  };

  inject('bcms', bcmsNuxtPlugin);
};

export default bcmsNuxtPluginInitializer;
