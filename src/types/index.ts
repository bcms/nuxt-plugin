import 'vue/types/vue';
import '@nuxt/types';
import 'vuex/types/index';

export * from './plugin';
export * from './server-middleware';

import type { BCMSNuxtPlugin } from './plugin';

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $bcms: BCMSNuxtPlugin;
  }

  interface Context {
    $bcms: BCMSNuxtPlugin;
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $bcms: BCMSNuxtPlugin;
  }
}
