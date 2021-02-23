export type BCMSNuxtPluginQueryFunction<T> = (
  variables: {
    [key: string]: unknown;
  },
  item: unknown,
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

export interface BCMSNuxtQueryConfig<T, K> {
  variables?: {
    [key: string]: unknown;
  };
  filter?: BCMSNuxtQueryFilterFunction<T>;
  sort?: BCMSNuxtQuerySortFunction<T>;
  slice?: BCMSNuxtQuerySlice;
  query: BCMSNuxtPluginQueryFunction<K>;
}

export interface BCMSNuxtPlugin {
  findOne<T>(template: string, config: BCMSNuxtQueryConfig<T, T>): Promise<T>;
  find<T>(template: string, config: BCMSNuxtQueryConfig<T, T[]>): Promise<T[]>;
  functionData<T>(name: string): Promise<T>;
}
