import * as path from 'path';
import type { Module } from '@nuxt/types';
import type { BCMSMost, BCMSMostConfig } from '@becomes/cms-most/types';
import { createBcmsMost } from '@becomes/cms-most';

let bcmsMost: BCMSMost;

export function useBcmsMost(): BCMSMost {
  return bcmsMost;
}

const nuxtModule: Module<BCMSMostConfig> = async function (moduleOptions) {
  if (!bcmsMost) {
    bcmsMost = createBcmsMost({ config: moduleOptions });
    await bcmsMost.content.pull();
    await bcmsMost.media.pull();
    await bcmsMost.typeConverter.pull();
    await bcmsMost.socketConnect();
  }
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'bcms.js',
    mode: 'server',
  });
  async function done() {
    try {
      // TODO: Implement post generate
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  if (typeof this.nuxt.hook === 'function') {
    this.nuxt.hook('generate:done', async () => {
      await done();
    });
  } else {
    this.nuxt.hook['generate:done'] = async () => {
      await done();
    };
  }
};

export default nuxtModule;

// REQUIRED if publishing the module as npm package
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const meta = require('./package.json');
