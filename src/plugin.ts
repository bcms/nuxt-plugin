import type { Context } from '@nuxt/types';
import type { BCMSNuxtPlugin } from './types';
import { useBcmsMost } from './module';

let bcmsNuxtPlugin: BCMSNuxtPlugin;

export function useBcmsNuxtPlugin(): BCMSNuxtPlugin {
  return bcmsNuxtPlugin;
}

const bcmsNuxtPluginInitializer = (
  _context: Context,
  inject: (name: string, plugin: unknown) => void,
): void => {
  const bcmsMost = useBcmsMost();

  bcmsNuxtPlugin = {
    entry: {
      async find(template, query) {
        const cache = await bcmsMost.cache.content.get();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const output: any[] = [];
        if (cache[template]) {
          for (let i = 0; i < cache[template].length; i++) {
            const item = cache[template][i];
            const queryResult = await query(item, cache);
            if (queryResult) {
              output.push(queryResult);
            }
          }
        } else {
          console.warn(`Template "${template}" does not exist.`);
        }

        return output;
      },
      async findOne(template, query) {
        const cache = await bcmsMost.cache.content.get();
        if (cache[template]) {
          for (let i = 0; i < cache[template].length; i++) {
            const item = cache[template][i];
            const queryResult = await query(item, cache);
            if (queryResult) {
              return queryResult;
            }
          }
        } else {
          console.warn(`Template "${template}" does not exist.`);
        }

        return null;
      },
    },
    function: {
      async data(fName) {
        return await bcmsMost.cache.function.findOne(
          ({ name }) => name === fName,
        );
      },
    },
  };

  inject('bcms', bcmsNuxtPlugin);
};

export default bcmsNuxtPluginInitializer;
