import type { Context } from '@nuxt/types';
import { createBcmsNuxtPlugin } from 'nuxt-plugin-bcms/plugin-config';
import { createBcmsClient } from '@becomes/cms-client';

const bcmsNuxtPluginInitializer = (
  ctx: Context,
  inject: (name: string, plugin: unknown) => void,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const options = require('nuxt-plugin-bcms/_config.js');
  const client = createBcmsClient({
    cmsOrigin: options.cms.origin,
    key: options.cms.key,
  });
  const bcmsNuxtPlugin = createBcmsNuxtPlugin(client, options);
  ctx.$bcms = bcmsNuxtPlugin;
  inject('bcms', bcmsNuxtPlugin);
};

export default bcmsNuxtPluginInitializer;
