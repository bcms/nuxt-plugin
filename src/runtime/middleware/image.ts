import * as fs from 'fs';
import { defineEventHandler } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  try {
    const response = await axios({
      url: `http://localhost:3001/api/bcms-images/${req.url}`,
      method: 'GET',
    });
    const result: {
      exist: boolean;
      path?: string | undefined;
      mimetype?: string | undefined;
      fileName?: string | undefined;
      fileSize?: number | undefined;
    } = response.data;
    if (result.exist) {
      res.statusCode = 200;
      res.setHeader('Content-Type', result.mimetype as string);
      const readStream = fs.createReadStream(result.path as string);
      readStream.pipe(res, {
        end: true,
      });
      return;
    } else {
      res.statusCode = 404;
      res.end();
      return;
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 404;
    res.end();
  }
});
