declare module 'nuxt-plugin-bcms/components/image.vue' {
  import { BCMSMediaParsed } from '@becomes/cms-client/types';
  import type {
    BCMSImageHandler,
    BCMSMostImageProcessorProcessOptions,
  } from '@becomes/cms-most/types';
  import type { ExtendedVue, Vue } from 'vue/types/vue';
  type BCMSImage = ExtendedVue<
    Vue,
    { image: BCMSImageHandler; s1: string; s2: string },
    unknown,
    unknown,
    {
      basePath?: string;
      media: BCMSMediaParsed;
      options?: BCMSMostImageProcessorProcessOptions;
    }
  >;
  const component: BCMSImage;
  export default component;
}
