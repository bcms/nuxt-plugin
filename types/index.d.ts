import { Vue } from 'vue/types/vue';
import { Module } from '@nuxt/types';
import { Commit } from 'vuex/types/index';

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $bcms: Object;
  }
  interface Context {
    $bcms: Object;
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $bcms: Object;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $bcms: Object;
  }
}
