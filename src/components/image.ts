import type { BCMSMediaParsed } from '@becomes/cms-client/types';
import type {
  BCMSImageHandler,
  BCMSMostImageProcessorProcessOptions,
} from '@becomes/cms-most/types';
import * as vue from 'vue';
import { BCMSImageConfig } from './_config';
import { createBcmsImageHandler } from '@becomes/cms-most/frontend/image';
import { output } from '@becomes/cms-most/frontend/_output-path';

type VueType = typeof vue.default;
const Vue = vue as any as VueType;

function createResizeHandler(
  el: HTMLElement,
  handler: BCMSImageHandler,
  self: any,
) {
  return () => {
    self.srcSet = handler.getSrcSet({ width: el.offsetWidth });
  };
}

export default Vue.extend<
  {
    handler: BCMSImageHandler;
    srcSet: [string, string, number, number, number];
    resizeHandler: () => void;
    mediaId: string;
    BCMSImageConfig: BCMSImageConfig;
    output: string;
  },
  unknown,
  unknown,
  {
    media: BCMSMediaParsed;
    options?: BCMSMostImageProcessorProcessOptions;
  }
>({
  template: `
  <div
    ref="container"
    class="bcmsImage"
    :data-bcms-img-w="srcSet[2]"
    :data-bcms-img-h="srcSet[3]"
    :data-bcms-img-src="media.src"
    :data-bcms-img-ops="handler.optionString"
    :data-bcms-img-idx="srcSet[4]"
  >
    <div v-if="BCMSImageConfig.localImageProcessing">
      <div v-if="handler.parsable">
        <picture>
          <source :srcset="srcSet[0]" />
          <source :srcset="srcSet[1]" />
          <img
            :data-bcms-image="handler.optionString + ';' + media.src"
            :src="output + media.src"
            :alt="media.alt_text"
            :width="srcSet[2]"
            :height="srcSet[3]"
          />
        </picture>
      </div>
      <div v-else>
        <img :src="s1" :alt="media.alt_text" />
      </div>
    </div>
    <div v-else>
      <picture>
        <source
          :srcset="\`\${BCMSImageConfig.cmsOrigin}/api/media/\${media._id}/bin/\${BCMSImageConfig.publicApiKeyId}?ops=\${handler.optionString}&idx=\${srcSet[4]}&webp=true\`"
        />
        <source
          :srcSet="\`\${BCMSImageConfig.cmsOrigin}/api/media/\${media._id}/bin/\${BCMSImageConfig.publicApiKeyId}?ops=\${handler.optionString}&idx=\${srcSet[4]}\`"
        />
        <img
          :data-bcms-image="handler.optionString + ';' + media.src"
          :src="\`\${BCMSImageConfig.cmsOrigin}/api/media/\${media._id}/bin/\${BCMSImageConfig.publicApiKeyId}?ops=\${handler.optionString}&idx=\${srcSet[4]}\`"
          :alt="media.alt_text"
          :width="srcSet[2]"
          :height="srcSet[3]"
        />
      </picture>
    </div>
  </div>
  `,
  props: {
    media: {},
    options: {},
  },
  data() {
    const handler = createBcmsImageHandler(this.media, this.options, output);
    return {
      handler,
      srcSet: handler.getSrcSet({
        width: 0,
      }),
      resizeHandler: () => {
        // Do nothing
      },
      mediaId: this.media._id,
      BCMSImageConfig,
      output,
    };
  },
  mounted() {
    const el = this.$refs.container as HTMLElement;
    if (!el) {
      return;
    }
    this.resizeHandler = createResizeHandler(el, this.handler, this);
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  },
  updated() {
    if (this.mediaId !== this.media._id) {
      this.mediaId = this.media._id;
      window.removeEventListener('resize', this.resizeHandler);
      this.handler = createBcmsImageHandler(this.media, this.options, output);
      const el = this.$refs.container as HTMLElement;
      if (!el) {
        return;
      }
      this.resizeHandler = createResizeHandler(el, this.handler, this);
      window.addEventListener('resize', this.resizeHandler);
      this.resizeHandler();
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
});
