import type { BCMSClient, BCMSEntryParsed } from '@becomes/cms-client/types';
import type {
  BCMSMostCacheContent,
  BCMSMostConfig,
  BCMSMostServerRoutes,
} from '@becomes/cms-most/types';

export interface BCMSNuxtPluginConfig extends BCMSMostConfig {
  websiteDomain: string;
  server?: {
    port?: number;
    domain?: string;
    routes?: BCMSMostServerRoutes;
  };
  postProcessImages?: boolean;
}

export type BCMSNuxtPluginQueryFunction<QueryResult> = (
  item: BCMSEntryParsed,
  cache: BCMSMostCacheContent,
) => Promise<QueryResult>;

declare module '#app' {
  interface NuxtApp {
    $bcms: BCMSNuxtPlugin;
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bcms: BCMSNuxtPlugin;
  }
}

export interface BCMSNuxtPlugin extends BCMSClient {
  request<Result>(config: {
    url: string;
    method?: 'get' | 'post' | 'put' | 'delete';
    headers?: {
      [name: string]: string;
    };
    query?: {
      [name: string]: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
  }): Promise<Result>;
}
