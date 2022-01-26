<template>
  <div class="container" ref="test">
    <template v-if="image.parsable">
      <picture>
        <source :srcset="s1" />
        <source :srcset="s2" />
        <img
          :data-bcms-image="image.optionString + ';' + media.src"
          :src="media.src"
          :alt="media.alt_text"
        />
      </picture>
    </template>
    <template v-else>
      <img :src="media.src" :alt="media.alt_text" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { createBcmsImageHandler } from '@becomes/cms-most/frontend';
import type {
  BCMSImageHandler,
  BCMSMostImageProcessorProcessOptions,
} from '@becomes/cms-most/types';
import type { BCMSMediaParsed } from '@becomes/cms-client/types';

export default Vue.extend<
  {
    image: BCMSImageHandler;
    s1: string;
    s2: string;
  },
  unknown,
  unknown,
  {
    basePath?: string;
    media: BCMSMediaParsed;
    options?: BCMSMostImageProcessorProcessOptions;
  }
>({
  props: {
    media: {},
    options: {},
  },
  data() {
    const image = createBcmsImageHandler(
      this.basePath || '/bcms-media',
      this.media,
      this.options,
    );
    const ss = image.getSrcSet();
    return {
      image,
      s1: ss[0],
      s2: ss[1],
    };
  },
  mounted() {
    const el = this.$refs.test as HTMLDivElement;
    if (!el) {
      return;
    }
    const ss = this.image.getSrcSet({
      width: el.offsetWidth,
    });
    this.s1 = ss[0];
    this.s2 = ss[1];
  },
});
</script>
