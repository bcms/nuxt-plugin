import type { BCMSEntryParsed } from '@becomes/cms-client/types';
import type { BCMSMostCacheContent } from '@becomes/cms-most/types';

export type BCMSNuxtPluginQueryFunction<QueryResult> = (
  item: BCMSEntryParsed,
  cache: BCMSMostCacheContent,
) => Promise<QueryResult>;

export interface BCMSNuxtPlugin {
  entry: {
    findOne<QueryResult>(
      template: string,
      query: BCMSNuxtPluginQueryFunction<QueryResult>,
    ): Promise<QueryResult | null>;
    find<QueryResult>(
      template: string,
      query: BCMSNuxtPluginQueryFunction<QueryResult>,
    ): Promise<QueryResult[]>;
  };
  function: {
    /**
     * Will return data for specified function call from the cache.
     */
    data<Data>(functionName: string): Promise<Data | null>;
  };
}
