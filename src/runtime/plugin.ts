import { createBcmsNuxtPlugin } from './plugin-config';
import { createBcmsClient } from '@becomes/cms-client';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(async (config) => {
  const meta = {
    env: config.$config as any,
  };
  const client = createBcmsClient({
    cmsOrigin: `${meta.env.pubBcmsApiOrigin}`,
    key: {
      id: `${meta.env.pubBcmsApiKeyId}`,
      secret: `${meta.env.pubBcmsApiKeySecret}`,
    },
    enableCache: meta.env.bcmsEnableClientCache === 'true',
    debug: meta.env.bcmsClientDebug === 'true',
    entries: {
      allowStatuses: meta.env.bcmsEntryStatuses
        ? meta.env.bcmsEntryStatuses.split(',')
        : undefined,
    },
  });
  const bcmsNuxtPlugin = createBcmsNuxtPlugin(client, meta.env);
  return {
    provide: { bcms: bcmsNuxtPlugin },
  };
});
