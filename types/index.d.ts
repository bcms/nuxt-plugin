import { Vue } from 'vue/types/vue';
import { Module, Context } from '@nuxt/types';
import { Commit } from 'vuex/types/index';
import { BCMSMostCacheContent, BCMSMostCacheContentItem } from '@becomes/cms-most/types';

export interface BCMS {
  findOne<T>(base: string, template: string, query: (item: any, cache: any[]) => Promise<T>): Promise<T>;
  // find(template: string): BCMSMostCacheContentItem[];
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $bcms: BCMS;
  }
  interface Context {
    $bcms: BCMS;
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $bcms: BCMS;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $bcms: BCMS;
  }
}
