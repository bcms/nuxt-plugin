import { BCMSEntry } from './entry';

export type BCMSNuxtPluginQueryFunction<T> = (
  variables: {
    [key: string]: unknown;
  },
  item: BCMSEntry,
  cache: unknown,
) => Promise<T>;
export type BCMSNuxtQueryFilterFunction<T> = (
  item: T,
  index: number,
) => boolean;
export type BCMSNuxtQuerySortFunction<T> = (a: T, b: T) => number;

export interface BCMSNuxtQuerySlice {
  start: number;
  end?: number;
}

export interface BCMSNuxtQueryConfig<QueryResult> {
  variables?: {
    [key: string]: unknown;
  };
  filter?: BCMSNuxtQueryFilterFunction<BCMSEntry>;
  sort?: BCMSNuxtQuerySortFunction<BCMSEntry>;
  slice?: BCMSNuxtQuerySlice;
  query: BCMSNuxtPluginQueryFunction<QueryResult>;
}

export interface BCMSNuxtPlugin {
  findOne<QueryResult>(
    template: string,
    config: BCMSNuxtQueryConfig<QueryResult>,
  ): Promise<QueryResult>;
  find<QueryResult>(
    template: string,
    config: BCMSNuxtQueryConfig<QueryResult[]>,
  ): Promise<QueryResult[]>;
  functionData<T>(name: string): Promise<T>;
}
