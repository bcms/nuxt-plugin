import * as fs from 'fs';
import type { ServerMiddleware } from '@nuxt/types';
import { useBcmsMost } from '../module';

export function createBcmsNuxtImageMiddleware(): ServerMiddleware {
  return async (req, res) => {
    const most = useBcmsMost();
    const result = await most.imageProcessor.middlewareHelper(
      req.url as string,
    );
    if (result.exist) {
      res.statusCode = 200;
      res.setHeader('Content-Type', result.mimetype as string);
      const readStream = fs.createReadStream(result.path as string);
      readStream.pipe(res, {
        end: true,
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  };
}

export default createBcmsNuxtImageMiddleware();
