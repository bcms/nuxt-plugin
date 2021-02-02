export type BCMSNuxtPluginQueryFunction<T> = (item: any, cache: any) => Promise<T>

export interface BCMSNuxtPlugin {
  findOne<T>(template: string, query: BCMSNuxtPluginQueryFunction<T>): Promise<T>;
  find<T>(template: string, query: BCMSNuxtPluginQueryFunction<T>): Promise<T[]>;
}