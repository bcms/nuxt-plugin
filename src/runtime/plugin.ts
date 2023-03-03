import { createBcmsNuxtPlugin } from './plugin-config';
import { createBcmsClient } from '@becomes/cms-client';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(async () => {
  const client = createBcmsClient({
    cmsOrigin: `${import.meta.env.VITE_BCMS_API_ORIGIN}`,
    key: {
      id: `${import.meta.env.VITE_BCMS_PUB_API_KEY}`,
      secret: `${import.meta.env.VITE_BCMS_PUB_API_SECRET}`,
    },
    enableCache: import.meta.env.VITE_BCMS_ENABLE_CLIENT_CACHE === 'true',
    debug: import.meta.env.VITE_BCMS_CLIENT_DEBUG === 'true',
    entries: {
      allowStatuses: import.meta.env.VITE_BCMS_ENTRY_STATUSES
        ? (import.meta.env.VITE_BCMS_ENTRY_STATUSES as string).split(',')
        : undefined,
    },
  });
  const bcmsNuxtPlugin = createBcmsNuxtPlugin(client);
  return {
    provide: { bcms: bcmsNuxtPlugin },
  };
});
