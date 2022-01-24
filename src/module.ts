import * as path from 'path';
import type { Module } from '@nuxt/types';
import type { BCMSMost } from '@becomes/cms-most/types';
import { createBcmsMost } from '@becomes/cms-most';
import type { BCMSNuxtPluginConfig } from './types';
import { createBcmsNuxtClient } from './client';
import { writeFile } from 'fs/promises';

let bcmsMost: BCMSMost;

export function useBcmsMost(): BCMSMost {
  return bcmsMost;
}

export function createBcmsNuxtConfig(
  config: BCMSNuxtPluginConfig,
): BCMSNuxtPluginConfig {
  return config;
}

const nuxtModule: Module<BCMSNuxtPluginConfig> = async function (
  moduleOptions,
) {
  createBcmsNuxtConfig(moduleOptions);
  await writeFile(
    path.join(__dirname, '_config.js'),
    `module.exports = ${JSON.stringify(moduleOptions, null, '  ')}`,
  );
  if (!bcmsMost) {
    bcmsMost = createBcmsMost({ config: moduleOptions });
    await bcmsMost.content.pull();
    await bcmsMost.media.pull();
    await bcmsMost.typeConverter.pull();
    await bcmsMost.socketConnect();
    createBcmsNuxtClient(bcmsMost.client);
  }
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'bcms.js',
    options: moduleOptions,
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
