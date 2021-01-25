import { Module } from '@nuxt/types';
import { BCMSMostConfig, BCMSMostCacheContent } from '@becomes/cms-most/types';
import { BCMSMost } from '@becomes/cms-most';
import { BCMSMostCacheHandler } from '@becomes/cms-most/handlers/cache';

const nuxtModule: Module<BCMSMostConfig> = function(moduleOptions) {
  const options: BCMSMostConfig = {
    ...this.options.bcms,
    ...moduleOptions,
  };

  const config: BCMSMostConfig = {
    cms: options.cms,
    entries: options.entries ? options.entries : [],
    functions: options.functions ? options.functions : [],
    media: options.media
      ? options.media
      : {
          output: 'static/media',
          sizeMap: [
            {
              width: 350,
            },
            {
              width: 600,
            },
            {
              width: 900,
            },
            {
              width: 1200,
            },
            {
              width: 1400,
            },
            {
              width: 1920,
            },
          ],
        },
  };

  const bcmsMost = BCMSMost(config);

  BCMSMostCacheHandler();

  this.nuxt.hook('ready', async () => {
    await bcmsMost.pipe
      .initialize(3001, async () => {
        // Live reload on data entry
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });

    const content: BCMSMostCacheContent = await bcmsMost.cache.get.content();

    console.log(content);
  });

  this.nuxt.hook('generate:done', () => {
    console.log('On post build');
    console.log('options', options);
  });
};

export default nuxtModule;

// REQUIRED if publishing the module as npm package
// export const meta = require('./package.json')
