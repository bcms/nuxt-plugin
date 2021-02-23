import 'vue/types/vue';
import '@nuxt/types';
import 'vuex/types/index';

export * from './plugin';
export * from './server';

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

declare module 'vuex/types/index' {
  interface Store<S> {
    $bcms: BCMSNuxtPlugin;
  }
}
