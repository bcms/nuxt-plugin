# BCMS - Nuxt Plugin

This is a NuxtJS plugin for the BCMS.

## Getting started

Best way would be to create a new project using [BCMS CLI](https://github.com/becomesco/cms-cli) by running `bcms --website create`, but if you want to add the plugin to an existing project, you will need to follow next steps.

- Install the plugin and its dependencies by running: `npm i -D nuxt-plugin-bcms @becomes/cms-client @becomes/cms-most`,
- In `nuxt.config.js` add the module and configure it:

> nuxt.config.js

```js
import { createBcmsNuxtConfig } from 'nuxt-plugin-bcms/module';

export default {
  // ... other config

  modules: [
    // ... other modules

    /**
     * ---------------
     * ---- START ----
     */
    [
      'nuxt-plugin-bcms',
      createBcmsNuxtConfig({
        cms: {
          origin:
            process.env.BCMS_API_ORIGIN ||
            'https://becomes-starter-projects.yourbcms.com',
          key: {
            id: process.env.BCMS_API_KEY || '629dcd4dbcf5017354af6fe8',
            secret:
              process.env.BCMS_API_SECRET ||
              '7a3c5899f211c2d988770f7561330ed8b0a4b2b5481acc2855bb720729367896',
          },
        },
        websiteDomain: process.env.ORIGIN || 'http://localhost:3000',
        media: {
          download: false,
        },
      }),
    ],
    // ---- END ----
    // -------------
  ],
};
```

- If you do not add environment variables for your BCMS, as you can see, publicly available BCMS will be used.

## Getting the BCMS data

There are 2 main ways in which you can get data in Nuxt page. First is by using [BCMS Client methods](https://github.com/becomesco/cms-client) (which is provided to the Nuxt context with name `$bcms`) and the other is by making API calls to Nuxt middleware connected with `bcms.routes.ts` file (this is done using `$bcms.request( ... )`).

### Getting data using BCMS Client

This approach is very simple and easy to understand. For example, if in the BCMS we have an entry with slug _home_, located in _pages_ template, we can get data for this entry like shown in the code snippet bellow:

```ts
async asyncData(ctx) {
  const entry = await ctx.$bcms.entry.get({
    template: 'pages',
    entry: 'home',
  });
  return { entry }
}
```

### Getting data using Nuxt middleware API

- First you will need to create a file called `bcms.routes.ts` in the root of the project (you can also call the file `bcms.routes.js`). Inside of the file, we will create a simple configuration and an endpoint which will return list of all templates.

```ts
import {
  createBcmsMostServerRoutes,
  createBcmsMostServerRoute,
} from '@becomes/cms-most';

export default createBcmsMostServerRoutes({
  '/template-list.json': createBcmsMostServerRoute({
    method: 'get',
    async handler({ bcms }) {
      await bcms.template.pull();
      const result = await bcms.template.find(async () => true);
      return result.map((temp) => {
        return {
          title: temp.label,
          slug: '/' + temp.name,
        };
      });
    },
  }),
});
```

- After creating the file, we can call this endpoint inside of the **asyncData** as shown bellow:

```ts
async asyncData(ctx) {
  return {
    templateList: await ctx.$bcms.request({
      url: '/template-list.json',
    }),
  };
},
```

## Development

- Install dependencies: `npm i`,
- Bundle the code: `npm run bundle`,
- Link dist: `cd dist && npm i && npm link && cd ..`,
- To update dist code, run: `npm run build`,
