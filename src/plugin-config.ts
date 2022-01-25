import type { BCMSClient } from '@becomes/cms-client/types';
import axios from 'axios';
import type { BCMSNuxtPlugin, BCMSNuxtPluginConfig } from './types';

let bcmsNuxtPlugin: BCMSNuxtPlugin;

export function useBcmsNuxtPlugin(): BCMSNuxtPlugin {
  return bcmsNuxtPlugin;
}

export function createBcmsNuxtPlugin(
  client: BCMSClient,
  bcmsConfig: BCMSNuxtPluginConfig,
): BCMSNuxtPlugin {
  if (!bcmsNuxtPlugin) {
    let schema = 'http';
    let domain = 'localhost';
    let port = '3001';
    if (bcmsConfig.server) {
      if (bcmsConfig.server.port) {
        port = '' + bcmsConfig.server.port;
        if (port === '443') {
          schema = 'https';
        }
      }
      if (bcmsConfig.server.domain) {
        domain = bcmsConfig.server.domain
          .replace('https://', '')
          .replace('http://', '')
          .split(':')[0];
      }
    }

    bcmsNuxtPlugin = {
      ...client,
      async request(config) {
        let queryString = '';
        if (config.query) {
          const queries: string[] = [];
          for (const key in config.query) {
            queries.push(`${key}=${config.query[key]}`);
          }
          queryString = '?' + queries.join('&');
        }
        const res = await axios({
          url: `${schema}://${domain}:${port}/bcms/api${config.url}${queryString}`,
          method: config.method,
          headers: config.headers,
          data: config.data,
        });
        return res.data;
      },
      // entry: {
      //   async find(template, query) {
      //     const cache = await bcmsMost.cache.content.get();
      //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //     const output: any[] = [];
      //     if (cache[template]) {
      //       for (let i = 0; i < cache[template].length; i++) {
      //         const item = cache[template][i];
      //         const queryResult = await query(item, cache);
      //         if (queryResult) {
      //           output.push(queryResult);
      //         }
      //       }
      //     } else {
      //       console.warn(`Template "${template}" does not exist.`);
      //     }

      //     return output;
      //   },
      //   async findOne(template, query) {
      //     const cache = await bcmsMost.cache.content.get();
      //     if (cache[template]) {
      //       for (let i = 0; i < cache[template].length; i++) {
      //         const item = cache[template][i];
      //         const queryResult = await query(item, cache);
      //         if (queryResult) {
      //           return queryResult;
      //         }
      //       }
      //     } else {
      //       console.warn(`Template "${template}" does not exist.`);
      //     }

      //     return null;
      //   },
      // },
      // function: {
      //   async data(fName) {
      //     return await bcmsMost.cache.function.findOne(
      //       ({ name }) => name === fName,
      //     );
      //   },
      // },
    };
  }
  return bcmsNuxtPlugin;
}
