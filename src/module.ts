import * as path from 'path';
import * as http from 'http';
import { Module } from '@nuxt/types';
import {
  BCMSMostCacheContent,
  BCMSMostCacheContentItem,
  BCMSMostConfig,
} from '@becomes/cms-most/types';
import { BCMSMost, BCMSMostPrototype } from '@becomes/cms-most';

let bcmsMost: BCMSMostPrototype;

const contentServer = http.createServer(async (req, res) => {
  console.log(req.url);
  let rawBody = '';
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
      } catch(error) {
        res.statusCode = 400;
        res.write(JSON.stringify({message: error.message}))
      }
      if (body) {
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
      res.end();
    },
  );
});

/* 
  Initializing BCMS
*/

async function initBcmsMost(): Promise<void> {
  try {
    await bcmsMost.pipe.initialize(
      3001,
      async () => {
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

/* 
  Main module
*/

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
  await attachToRuntime(
    this.addPlugin,
  );

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
export const meta = require('./package.json')
