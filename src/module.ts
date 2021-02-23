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

let bcmsMost: BCMSMostPrototype;
let contentServer: HTTPServer;
let io: IOServer;

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
  if (!bcmsMost) {
    bcmsMost = BCMSMost(config);
    contentServer = BCMSNuxtCreateServer(bcmsMost);
    io = BCMSNuxtCreateSocketServer(contentServer);
    try {
      await bcmsMost.pipe.initialize(3001, async (name, data) => {
        if (name === SocketEventName.ENTRY) {
          if (data.type === 'update') {
            console.log('Entry updated');
            io.emit('reload');
          }
        }
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    contentServer.listen(3002);
  }
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'bcms.js',
  });

  this.nuxt.hook['generate:done'] = async () => {
    try {
      contentServer.close();
      io.close();
      await bcmsMost.pipe.postBuild('dist');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
};

export default nuxtModule;

// REQUIRED if publishing the module as npm package
export const meta = require('./package.json');
