import * as path from 'path';
import { Module } from '@nuxt/types';
import { BCMSMostConfig } from '@becomes/cms-most/types';
import { BCMSMost, BCMSMostPrototype } from '@becomes/cms-most';

let bcmsMost: BCMSMostPrototype;

/* 
  Initializing BCMS
*/

function initBcmsMost(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await bcmsMost.pipe.initialize(3001, async () => {});

      return resolve();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

function attachToRuntime(nuxt, addPlugin): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const content = await bcmsMost.cache.get.content();

      nuxt.options.publicRuntimeConfig.cacheContent = content;

      addPlugin({
        src: path.resolve(__dirname, 'plugin.js'),
        fileName: 'bcms.js',
      });

      return resolve();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

/* 
  Main module
*/

const nuxtModule: Module<BCMSMostConfig> = function(moduleOptions) {
  const { nuxt, addPlugin } = this;

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

  bcmsMost = BCMSMost(config);

  /* 
    On Nuxt init
  */

  nuxt.hook('ready', async () => {
    if (nuxt.options._build) {
      await initBcmsMost();
    }

    await attachToRuntime(nuxt, addPlugin);
  });

  /* 
  After Nuxt has finished generating static files
  */

  nuxt.hook('generate:done', async () => {
    try {
      await bcmsMost.pipe.postBuild('dist');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
};

export default nuxtModule;

// REQUIRED if publishing the module as npm package
// export const meta = require('./package.json')
