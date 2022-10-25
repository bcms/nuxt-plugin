<template>
  <div class="content">
    <template v-for="(_item, _itemIdx) in items">
      <template v-if="isArray(_item)">
        <template v-for="(item, itemIdx) in _item">
          <BCMSContentItem
            :key="`${_itemIdx}_${itemIdx}`"
            :item="item"
            :node-parser="nodeParser"
          />
        </template>
      </template>
      <template v-else>
        <BCMSContentItem
          :key="_itemIdx"
          :item="_item"
          :node-parser="nodeParser"
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';
import type {
  BCMSEntryContentParsed,
  BCMSPropRichTextDataParsed,
} from '@becomes/cms-client/types';
import BCMSContentItem from './bcms-content-item.vue';

export default Vue.extend({
  components: {
    BCMSContentItem,
  },
  props: {
    items: {
      type: Array as PropType<BCMSPropRichTextDataParsed>,
      required: true,
    },
    nodeParser: Function as PropType<(item: BCMSEntryContentParsed) => string>,
  },
  methods: {
    isArray(item: any): boolean {
      return Array.isArray(item);
    },
  },
});
</script>
