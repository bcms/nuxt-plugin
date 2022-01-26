import * as fs from 'fs';
import type { ServerMiddleware } from '@nuxt/types';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';

export function createBcmsNuxtImageMiddleware(): ServerMiddleware {
  return async (req, res) => {
    try {
      const result: AxiosResponse<{
        exist: boolean;
        path: string;
        mimetype: string;
        fileName: string;
        fileSize: number;
      }> = await axios({
        url: `http://localhost:3001/api/bcms-images${req.url}`,
        method: (req.method as Method) || 'GET',
        headers: req.headers as { [name: string]: string },
      });
      if (result.data.exist) {
        res.statusCode = 200;
        res.setHeader('Content-Type', result.data.mimetype);
        res.setHeader('Content-Length', result.data.fileSize);
        const readStream = fs.createReadStream(result.data.path);
        readStream.pipe(res, {
          end: true,
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    } catch (error) {
      const err = error as AxiosError;
      const rez = err.response as AxiosResponse;
      res.statusCode = rez.status;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(rez.data));
      res.end();
    }
  };
}

export default createBcmsNuxtImageMiddleware();
