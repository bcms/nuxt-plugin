import { Plugin } from '@nuxt/types';

declare module '@nuxt/types' {
  interface Context {
    $bcms: any;
  }
}

const nuxtPlugin: Plugin = (context, inject) => {
  const content = context.$config.cacheContent;

  inject('bcms', content);
};

export default nuxtPlugin;
