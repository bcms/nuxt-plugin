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
}

export type BCMSNuxtPluginQueryFunction<QueryResult> = (
  item: BCMSEntryParsed,
  cache: BCMSMostCacheContent,
) => Promise<QueryResult>;

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
  // entry: {
  //   findOne<QueryResult>(
  //     template: string,
  //     query: BCMSNuxtPluginQueryFunction<QueryResult>,
  //   ): Promise<QueryResult | null>;
  //   find<QueryResult>(
  //     template: string,
  //     query: BCMSNuxtPluginQueryFunction<QueryResult>,
  //   ): Promise<QueryResult[]>;
  // };
  // function: {
  //   /**
  //    * Will return data for specified function call from the cache.
  //    */
  //   data<Data>(functionName: string): Promise<Data | null>;
  // };
}
