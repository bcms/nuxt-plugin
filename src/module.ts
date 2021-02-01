import * as path from "path";
import * as http from "http";
import { Module } from "@nuxt/types";
import {
  BCMSMostCacheContent,
  BCMSMostCacheContentItem,
  BCMSMostConfig,
} from "@becomes/cms-most/types";
import { BCMSMost, BCMSMostPrototype } from "@becomes/cms-most";

process.env.NUXT_BCMS_LOCAL = "true";

let bcmsMost: BCMSMostPrototype;
const contentServer = http.createServer(async (req, res) => {
  console.log(req.url);
  let rawBody = "";
  req.on("data", (chunk) => {
    rawBody += chunk;
  });
  req.on("end", async () => {
    const body: {
      type: "find" | "findOne";
      key: string;
      query: string;
    } = JSON.parse(rawBody);
    const query: (
      item: BCMSMostCacheContentItem,
      content: BCMSMostCacheContent
    ) => Promise<any> = eval(body.query);
    const content = JSON.parse(
      JSON.stringify(await bcmsMost.cache.get.content())
    );
    if (!content[body.key]) {
      res.write(
        JSON.stringify({
          message: `Content items for "${body.key}" do not exist.`,
        })
      );
    } else {
      const output: unknown[] = [];
      for (let i = 0; i < content[body.key].length; i++) {
        const result = await query(content[body.key][i], content);
        if (result) {
          output.push(result);
          if (body.type === "findOne") {
            break;
          }
        }
      }
      res.setHeader("Content-Type", "application/json");
      if (body.type === "findOne") {
        res.write(JSON.stringify(output[0]));
      } else {
        res.write(JSON.stringify(output));
      }
    }
    res.end();
  });
});

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
      // const content = await bcmsMost.cache.get.content();

      // nuxt.options.publicRuntimeConfig.cacheContent = content;

      addPlugin({
        src: path.resolve(__dirname, "plugin.js"),
        fileName: "bcms.js",
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

const nuxtModule: Module<BCMSMostConfig> = async function(moduleOptions) {
  const { nuxt, addPlugin } = this;

  // const options: BCMSMostConfig = {
  //   ...this.options.bcms,
  //   ...moduleOptions,
  // };

  const config: BCMSMostConfig = {
    cms: moduleOptions.cms,
    entries: moduleOptions.entries ? moduleOptions.entries : [],
    functions: moduleOptions.functions ? moduleOptions.functions : [],
    media: moduleOptions.media
      ? moduleOptions.media
      : {
          output: "static/media",
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
  await attachToRuntime(nuxt, addPlugin);

  /* 
    On Nuxt init
  */

  // nuxt.hook('ready', async () => {
  //   if (nuxt.options._build) {
  //     await initBcmsMost();
  //   }
  //   await attachToRuntime(nuxt, addPlugin);
  // });

  // /*
  // After Nuxt has finished generating static files
  // */

  nuxt.hook("generate:done", async () => {
    try {
      contentServer.close();
      await bcmsMost.pipe.postBuild("dist");
      bcmsMost = undefined;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
};

export default nuxtModule;

// REQUIRED if publishing the module as npm package
// export const meta = require('./package.json')
