import { Plugin } from '@nuxt/types';

declare module '@nuxt/types' {
  interface Context {
    $bcms: any;
  }
}

const nuxtPlugin: Plugin = (context) => {
  const content = context.$config.cacheContent;

  context.$bcms = content;
};

export default nuxtPlugin;
