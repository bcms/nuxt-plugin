declare module 'nuxt-plugin-bcms/components/image.vue' {
  import { BCMSMediaParsed } from '@becomes/cms-client/types';
  import type {
    BCMSImageHandler,
    BCMSMostImageProcessorProcessOptions,
  } from '@becomes/cms-most/types';
  import type { ExtendedVue, Vue } from 'vue/types/vue';
  type BCMSImage = ExtendedVue<
    Vue,
    {
      srcSet: [string, string, number, number, number];
      handler: BCMSImageHandler;
      resizeHandler: () => void;
      mediaId: string;
      BCMSImageConfig: BCMSImageConfigType;
      output: string;
    },
    unknown,
    unknown,
    {
      media: BCMSMediaParsed;
      options?: BCMSMostImageProcessorProcessOptions;
    }
  >;
  const component: BCMSImage;
  export default component;
}
