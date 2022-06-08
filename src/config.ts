import type { BCMSNuxtPluginConfig } from './types';

let bcmsConfig: BCMSNuxtPluginConfig;

export function createBcmsNuxtConfig(config: BCMSNuxtPluginConfig): void {
  bcmsConfig = config;
}

export function useBcmsNuxtConfig(): BCMSNuxtPluginConfig {
  return bcmsConfig;
}
