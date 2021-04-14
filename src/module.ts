import * as path from 'path';
import type { Module } from '@nuxt/types';
import type { BCMSMostConfig } from '@becomes/cms-most/types';
import { SocketEventName } from '@becomes/cms-client';
import { BCMSMost, BCMSMostPrototype } from '@becomes/cms-most';
import type { Server as HTTPServer } from 'http';
import type { Server as IOServer } from 'socket.io';
import {
  BCMSNuxtCreateServer,
  BCMSNuxtCreateSocketServer,
} from './server/main';

const container: {
  bcmsMost: BCMSMostPrototype;
  contentServer: HTTPServer;
  io: IOServer;
} = {
  bcmsMost: undefined,
  contentServer: undefined,
  io: undefined,
};

const nuxtModule: Module<BCMSMostConfig> = async function (moduleOptions) {
  const config: BCMSMostConfig = {
    cms: moduleOptions.cms,
    entries: moduleOptions.entries ? moduleOptions.entries : [],
    functions: moduleOptions.functions ? moduleOptions.functions : [],
    media: moduleOptions.media
      ? moduleOptions.media
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
  if (!container.bcmsMost) {
    container.bcmsMost = BCMSMost(config);
    container.contentServer = BCMSNuxtCreateServer(container.bcmsMost);
    container.io = BCMSNuxtCreateSocketServer(container.contentServer);
    try {
      await container.bcmsMost.pipe.initialize(3001, async (name, data) => {
        if (name === SocketEventName.ENTRY) {
          if (data.type === 'update') {
            console.log('Entry updated');
            container.io.emit('reload');
          }
        }
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    container.contentServer.listen(3002);
  }
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'bcms.js',
  });
  async function done() {
    try {
      container.contentServer.close((err) => {
        if (err) {
          console.error('IO', err);
          return;
        }
        console.log('Content server closed.');
      });
      await container.bcmsMost.pipe.postBuild('dist', 'dist/media', 3001);
      container.bcmsMost.close();
      delete container.bcmsMost;
      delete container.contentServer;
      delete container.io;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  if (typeof this.nuxt.hook === 'function') {
    this.nuxt.hook('generate:done', async (generator) => {
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
