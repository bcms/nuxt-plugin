import type { BCMSMost } from '@becomes/cms-most/types';
import {
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit';
import type { BCMSNuxtPluginConfig } from './types';
import { createBcmsMost } from '@becomes/cms-most';
import { createBcmsNuxtClient } from './client';
import { fileURLToPath } from 'url';
import { createFS } from '@banez/fs';

let bcmsMost: BCMSMost;

export function useBcmsMost(): BCMSMost {
  return bcmsMost;
}

export function createBcmsNuxtConfig(
  config: BCMSNuxtPluginConfig,
): BCMSNuxtPluginConfig {
  return config;
}

export default defineNuxtModule<BCMSNuxtPluginConfig>({
  meta: {
    name: 'bcms',
    configKey: 'bcms',
  },
  async setup(options, nuxt) {
    const componentsVersion = 'v1';
    const fs = createFS({
      base: process.cwd(),
    });
    let saveComponents = false;
    if (await fs.exist(['components', 'bcms', '__v'], true)) {
      const v = await fs.readString(['components', 'bcms', '__v']);
      if (v !== componentsVersion) {
        saveComponents = true;
      }
    } else {
      saveComponents = true;
    }
    if (saveComponents) {
      await fs.copy([__dirname, '_components'], ['components', 'bcms']);
      await fs.save(['components', 'bcms', '__v'], componentsVersion);
    }
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);
    const config = createBcmsNuxtConfig(options);
    if (!config.media) {
      config.media = {
        output: 'public/bcms-media',
      };
    } else if (!config.media.output) {
      config.media.output = 'public/bcms-media';
    }
    if (!bcmsMost) {
      bcmsMost = createBcmsMost({ config });
      await bcmsMost.content.pull();
      await bcmsMost.media.pull();
      await bcmsMost.typeConverter.pull();
      await bcmsMost.socketConnect();
      createBcmsNuxtClient(bcmsMost.client);
    }
    addPlugin(resolve(runtimeDir, 'plugin'));
    addServerHandler({
      route: '/api/bcms',
      method: 'get',
      middleware: true,
      handler: resolve(runtimeDir, 'middleware', 'content'),
    });
    addServerHandler({
      route: `/${bcmsMost.media.output.slice(1).join('/')}`,
      method: 'get',
      middleware: true,
      handler: resolve(runtimeDir, 'middleware', 'image'),
    });

    async function done() {
      try {
        if (config.postProcessImages) {
          await bcmsMost.imageProcessor.postBuild({
            buildOutput: ['dist'],
          });
        }
        await bcmsMost.server.stop();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }

    async function setupServer() {
      await bcmsMost.server.stop();
      await bcmsMost.server.start(
        config.server && config.server.routes ? config.server.routes : {},
      );
    }

    nuxt.hook('ready', async () => {
      await setupServer();
    });
    nuxt.hook('generate:done' as any, async () => {
      console.log('TEST');
      done();
    });
  },
});
