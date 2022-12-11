import type { BCMSNuxtPluginConfig } from './types';

let bcmsConfig: BCMSNuxtPluginConfig;

export function createBcmsNuxtConfig(
  config: BCMSNuxtPluginConfig,
): BCMSNuxtPluginConfig {
  bcmsConfig = config;
  return config;
}

export function useBcmsNuxtConfig(): BCMSNuxtPluginConfig {
  return bcmsConfig;
}
