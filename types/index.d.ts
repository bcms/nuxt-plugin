import { Vue } from 'vue/types/vue';
import { Module } from '@nuxt/types';
import { Commit } from 'vuex/types/index';
import { BCMSMostCacheContentItem } from '@becomes/cms-most/types';

export interface BCMS {
  findOne(entry: string, entryId: string): BCMSMostCacheContentItem;
  find(entry: string): BCMSMostCacheContentItem[];
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
