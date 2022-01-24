// import type { ServerMiddleware } from '@nuxt/types';
// import { useBcmsMost } from './module';
// import { createBcmsNuxtPlugin } from './plugin-config';
// import type { BCMSNuxtPlugin, BCMSNuxtServerMiddlewareHandler } from './types';

// export function createBcmsNuxtServerMiddlewareHandler<
//   Result = void,
//   Body = unknown,
// >(
//   handler: BCMSNuxtServerMiddlewareHandler<Result, Body>,
// ): BCMSNuxtServerMiddlewareHandler<Result, Body> {
//   return handler;
// }

// export function createBcmsNuxtServerMiddleware(routes: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [name: string]: BCMSNuxtServerMiddlewareHandler<any, any>;
// }): ServerMiddleware {
//   let bcms: BCMSNuxtPlugin;
//   return async (req, res, next) => {
//     if (!bcms) {
//       bcms = createBcmsNuxtPlugin(useBcmsMost());
//     }
//     const pathParts = req.url
//       ? req.url
//           .split('?')[0]
//           .split('/')
//           .filter((e) => e)
//       : [];
//     if (pathParts.length > 0) {
//       for (const route in routes) {
//         const routeHandler = routes[route];
//         const routeParts = route.split('/').filter((e) => e);
//         const params: {
//           [name: string]: string;
//         } = {};
//         const query: {
//           [name: string]: string;
//         } = {};
//         if (routeParts.length === pathParts.length) {
//           let match = true;
//           for (let i = 0; i < routeParts.length; i++) {
//             const routePart = routeParts[i];
//             const pathPart = pathParts[i];
//             if (routePart.startsWith(':')) {
//               params[routePart.substring(1)] = pathPart;
//             } else {
//               if (routePart !== pathPart) {
//                 match = false;
//                 break;
//               }
//             }
//           }
//           if (match) {
//             const queryString = req.url ? req.url.split('?')[1] : '';
//             if (queryString) {
//               const queryParts = queryString.split('&');
//               for (let i = 0; i < queryParts.length; i++) {
//                 const queryPart = queryParts[i];
//                 const qp = queryPart.split('=');
//                 query[qp[0]] = decodeURIComponent(qp[1]);
//               }
//             }
//             const result = await routeHandler({
//               bcms,
//               next,
//               req,
//               res,
//               params,
//               query,
//               body: {},
//             });
//             if (typeof result === 'object') {
//               res.statusCode = 200;
//               res.setHeader('Content-Type', 'application/json');
//               res.write(JSON.stringify(result));
//               res.end();
//             } else {
//               res.statusCode = 404;
//               res.setHeader('Content-Type', 'application/json');
//               res.write(
//                 JSON.stringify({ message: `No data provided for ${req.url}` }),
//               );
//               res.end();
//             }
//             return;
//           }
//         }
//       }
//     }
//     next();
//   };
// }
