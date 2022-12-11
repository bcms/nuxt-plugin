import type { AxiosError, AxiosResponse, Method } from 'axios';
// eslint-disable-next-line no-duplicate-imports
import axios from 'axios';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  let rawBody = '';
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => {
      rawBody += chunk;
    });
    req.on('end', () => {
      resolve();
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
  try {
    const result = await axios({
      url: `http://localhost:3001/api/bcms${req.url}`,
      method: (req.method as Method) || 'GET',
      headers: req.headers as { [name: string]: string },
      data: rawBody,
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(result.data));
    res.end();
  } catch (error) {
    const err = error as AxiosError;
    const rez = err.response as AxiosResponse;
    res.statusCode = rez.status;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(rez.data));
    res.end();
  }
});
