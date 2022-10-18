<template>
  <div>
    <div v-if="item.name && item.type === BCMSEntryContentNodeType.widget">
      <component :is="item.name.replace(/_/g, '-')" />
    </div>
    <div v-else>
      <div
        :class="`content-primitive content--${item.type}`"
        v-html="nodeParser ? nodeParser(item) : item.value"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';
import {
  BCMSEntryContentNodeType,
  BCMSEntryContentParsedItem,
} from '@becomes/cms-client/types';

interface BCMSWidgetComponents {
  [name: string]: any;
}

export default Vue.extend({
  name: 'BCMSContentItem',
  props: {
    item: {
      type: Object as PropType<BCMSEntryContentParsedItem>,
      required: true,
    },
    nodeParser: Function as PropType<
      (item: BCMSEntryContentParsedItem) => string
    >,
  },
  data() {
    return {
      BCMSEntryContentNodeType,
    };
  },
});
</script>
