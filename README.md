# BCMS - Nuxt Plugin

This is a NuxtJS plugin for the BCMS.

[![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/nuxt-plugin-bcms.svg
[npm-url]: https://npmjs.org/package/nuxt-plugin-bcms

## Getting started

You can initialize Nuxt project by using the [BCMS CLI](https://github.com/becomesco/cms-cli). You should install the CLI globally by running `npm i -g @becomes/cms-cli` and after that you can create the Nuxt project by running: `bcms --website create`.

## Getting the BCMS data

There are 2 main ways in which you can get data in Nuxt page. First is by using [BCMS Client methods](https://github.com/becomesco/cms-client) (which is provided to the Nuxt context with name `$bcms`) and the other is by making API calls to Nuxt middleware connected with `bcms.routes.ts` file (this is done using `$bcms.request( ... )`).

### Getting data using BCMS Client

This approach is very simple and easy to understand. For example, if in the BCMS we have an entry with slug _home_, located in _pages_ template, we can get data for this entry like shown in the code snippet bellow:

```ts
const { data } = useAsyncData(async (ctx) => {
  return (await ctx?.$bcms.entry.get({
    template: 'pages',
    entry: 'home',
  })) as HomeEntry[];
});
```

### Getting data using Nuxt middleware API

Inside of the `bcms.routes.ts` file, we will create a simple configuration and an endpoint which will return list of all templates.

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

After that, we can call this endpoint inside of the **asyncData** as shown bellow:

```ts
const { data } = useAsyncData(async (ctx) => {
  const result = await ctx?.$bcms.request<
    Array<{ title: string; slug: string }>
  >({
    url: '/template-list.json',
  });
  return result;
});
```

## Development

- Install dependencies: `npm i`,
- Bundle the code: `npm run bundle`,
- Link dist: `cd dist && npm i && npm link && cd ..`,
- To update dist code, run: `npm run build`,
