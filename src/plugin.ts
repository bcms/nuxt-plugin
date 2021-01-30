import { Plugin } from '@nuxt/types';
import {
  BCMSMostCacheContentItem,
  BCMSMostCacheContent,
} from '@becomes/cms-most/types';
import { BCMS } from '../types';

const nuxtPlugin: Plugin = (context, inject) => {
  const content: BCMSMostCacheContent = context.$config.cacheContent;

  const bcms: BCMS = {
    findOne(entry, entryId) {
      if (!content[entry]) {
        throw Error(`Content with entry "${entry}" does not exist`);
      }

      const foundEntry: BCMSMostCacheContentItem = content[entry].find(
        (item) => item._id === entryId
      );

      if (!foundEntry) {
        throw Error(`Entry with id "${entryId}" does not exist`);
      }

      return foundEntry;
    },
    find(entry) {
      if (!content[entry]) {
        throw Error(`Content with entry "${entry}" does not exist`);
      }

      return content[entry];
    },
  };

  inject('bcms', bcms);
};

export default nuxtPlugin;
