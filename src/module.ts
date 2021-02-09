import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as http from 'http';
import * as mimeTypes from 'mime-types';
import { Module } from '@nuxt/types';
import {
  BCMSMostCacheContent,
  BCMSMostCacheContentItem,
  BCMSMostConfig,
} from '@becomes/cms-most/types';
import { SocketEventName } from '@becomes/cms-client';
import { BCMSMost, BCMSMostPrototype } from '@becomes/cms-most';
import * as SocketIO from 'socket.io';

let bcmsMost: BCMSMostPrototype;

const contentServer = http.createServer(async (req, res) => {
  let rawBody = '';
  res.setHeader(
    'Access-Control-Request-Method',
    '*',
  );
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    '*',
  );
  if (req.method === 'OPTIONS') {
    res.end();
  } else if (req.method === 'POST') {
    req.on(
      'data',
      (chunk) => {
        rawBody += chunk;
      },
    );
    req.on(
      'end',
      async () => {
        res.setHeader(
          'Content-Type',
          'application/json',
        );
        let body: {
          type: 'find' | 'findOne';
          key: string;
          query: string;
        };
        try {
          body = JSON.parse(rawBody);
        } catch (error) {
          res.statusCode = 400;
          res.write(JSON.stringify({ message: error.message }));
        }
        if (body) {
          if (!body.query) {
            res.writeHead(400);
            res.write(JSON.stringify({ message: 'Missing query' }));
          } else {
            // console.log('query', body.query);
            const query: (
              item: BCMSMostCacheContentItem,
              content: BCMSMostCacheContent,
            ) => Promise<any> = eval(body.query);
            const content = JSON.parse(
              JSON.stringify(await bcmsMost.cache.get.content()),
            );
            if (!content[body.key]) {
              res.write(
                JSON.stringify({
                  message: `Content items for "${body.key}" do not exist.`,
                }),
              );
            } else {
              const output: unknown[] = [];
              for (let i = 0; i < content[body.key].length; i++) {
                try {
                  const result = await query(
                    content[body.key][i],
                    content,
                  );
                  if (result) {
                    output.push(result);
                    if (body.type === 'findOne') {
                      break;
                    }
                  }
                } catch (error) {
                  console.error(error);
                  res.statusCode = 500;
                  res.write(JSON.stringify({ message: error.message }));
                  res.end();
                  return;
                }
              }
              if (body.type === 'findOne') {
                res.write(JSON.stringify(output[0]));
              } else {
                res.write(JSON.stringify(output));
              }
            }
          }
        }
        res.end();
      },
    );
  } else {
    const filePath = path.join(
      process.cwd(),
      req.url.replace(
        /../g,
        '',
      ).replace(
        /\/\//g,
        '/',
      ),
    );
    const stat = await util.promisify(fs.stat)(
      filePath);
    res.writeHead(
      200,
      {
        'Content-Type': mimeTypes.lookup(filePath) as string,
        'Content-Length': stat.size,
      },
    );
    fs.createReadStream(filePath).pipe(res);
  }
});
const io = new SocketIO.Server(
  contentServer,
  {
    path: '/bcms/content/socket',
    serveClient: false,
    cors: {
      allowedHeaders: '*',
      origin: 'http://localhost:3000',
      methods: '*',
      credentials: true,
    },
    allowEIO3: true,
  },
);

async function initBcmsMost(): Promise<void> {
  try {
    await bcmsMost.pipe.initialize(
      3001,
      async (name, data) => {
        if (name === SocketEventName.ENTRY) {
          if (data.type === 'update') {
            console.log('Entry updated');
            io.emit('reload');
          }
        }
      },
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function attachToRuntime(addPlugin): Promise<void> {
  try {
    await addPlugin({
      src: path.resolve(
        __dirname,
        'plugin.js',
      ),
      fileName: 'bcms.js',
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const nuxtModule: Module<BCMSMostConfig> = async function(moduleOptions) {
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
    await initBcmsMost();
    contentServer.listen(3002);
  }
  await attachToRuntime(this.addPlugin);

  this.nuxt.hook['generate:done'] = async () => {
    try {
      contentServer.close();
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
