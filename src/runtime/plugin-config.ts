import type { BCMSClient } from '@becomes/cms-client/types';
import axios from 'axios';
import type { BCMSNuxtPlugin } from '../types';

let bcmsNuxtPlugin: BCMSNuxtPlugin;

export function useBcmsNuxtPlugin(): BCMSNuxtPlugin {
  return bcmsNuxtPlugin;
}

export function createBcmsNuxtPlugin(
  client: BCMSClient,
  env: any,
): BCMSNuxtPlugin {
  if (!bcmsNuxtPlugin) {
    let schema = 'http';
    let domain = 'localhost';
    let port = '3001';
    if (env.public.bcmsMostServerPort) {
      port = '' + env.public.bcmsMostServerPort;
      if (port === '443') {
        schema = 'https';
      }
    }
    if (env.public.bcmsMostServerDomain) {
      domain = `${env.public.bcmsMostServerDomain}`
        .replace('https://', '')
        .replace('http://', '')
        .split(':')[0];
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
        const basePath = `${schema}://${domain}:${port}`;
        const res = await axios({
          url: `${typeof window === 'undefined' ? basePath : ''}/api/bcms${
            config.url
          }${queryString}`,
          method: config.method,
          headers: config.headers,
          data: config.data,
        });
        return res.data;
      },
    };
  }
  return bcmsNuxtPlugin;
}
