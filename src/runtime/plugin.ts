import { createBcmsNuxtPlugin } from './plugin-config';
import { createBcmsClient } from '@becomes/cms-client';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(async (config) => {
  const meta = {
    env: config.$config as {
      public: any;
    },
  };
  const client = createBcmsClient({
    cmsOrigin: `${meta.env.public.bcmsApiOrigin}`,
    key: {
      id: `${meta.env.public.bcmsApiKeyId}`,
      secret: `${meta.env.public.bcmsApiKeySecret}`,
    },
    enableCache: meta.env.public.bcmsEnableClientCache === 'true',
    debug: meta.env.public.bcmsClientDebug === 'true',
    entries: {
      allowStatuses: meta.env.public.bcmsEntryStatuses
        ? meta.env.public.bcmsEntryStatuses.split(',')
        : undefined,
    },
  });
  const bcmsNuxtPlugin = createBcmsNuxtPlugin(client, meta.env);
  return {
    provide: { bcms: bcmsNuxtPlugin },
  };
});
