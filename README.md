# BCMS - Nuxt Plugin

Server side Nuxt plugin for the BCMS.

## How to install

First install dependencies by running: `npm i -D nuxt-plugin-bcms@1.0.9 && @becomes/cms-most@1.0.29`

In your `nuxt.config.js` add BCMS module configuration.

```js
import { BCMSMostConfigBuilder } from '@becomes/cms-most';

export default {
  // ... other nuxt configuration ...
  modules: [
    // ... your other modules ...
    [
      'nuxt-plugin-bcms',
      BCMSMostConfigBuilder({
        cms: {
          /**
           * Origin of the BCMS, ex: https://cms.example.com
           */
          origin: process.env.BCMS_API_ORIGIN,
          /**
           * API key information accessible in Key Manager
           * section of the BCMS.
           */
          key: {
            id: process.env.BCMS_API_KEY,
            secret: process.env.BCMS_API_SECRET,
          },
        },
      }),
    ],
  ],
};
```

## How to use

Example for getting blog entries:

```ts
async asyncData({ $bcms }) {
  const lng = 'en';
  try {
    const blogs = await $bcms.find('blogs', {
      vars: {
        lng
      },
      query: (vars, item) => {
        return {
          meta: item.meta[vars.lng],
          content: item.content[vars.lng],
        };
      },
    });
    return { blogs }
  } catch (err) {
    // Handle error
    console.error(err);
  }
},
```

Have in mind that for this example to work, you will need to have Blogs template in your BCMS. Also, API key that you are using must have GET access to entries in Blogs template.

## Development

- Install dependencies: `npm i`,
- Bundle the code: `npm run bundle`,
- Link dist: `cd dist && npm i && npm link && cd ..`,
- To update dist code, run: `npm run build`,
