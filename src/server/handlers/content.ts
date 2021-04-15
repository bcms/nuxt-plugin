import { BCMSNuxtRouteHandler } from '../../types';
import { BCMSNuxtQuerySlice } from '../../types';
import {
  BCMSNuxtPluginQueryFunction,
  BCMSNuxtQueryFilterFunction,
  BCMSNuxtQuerySortFunction,
} from '../../types';
import { GeneralUtil } from '../../util';

interface Body {
  type: 'find' | 'findOne';
  key: string;
  variables: {
    [key: string]: unknown;
  };
  filter?: string;
  sort?: string;
  slice?: BCMSNuxtQuerySlice;
  query: string;
}

export const ContentHandler: BCMSNuxtRouteHandler<Body> = async (
  req,
  res,
  body,
  bcmsMost,
) => {
  if (body) {
    if (!body.query) {
      res.writeHead(400);
      res.write(JSON.stringify({ message: 'Missing query' }));
    } else {
      let filterFunction: BCMSNuxtQueryFilterFunction<unknown>;
      let sortFunction: BCMSNuxtQuerySortFunction<unknown>;
      if (body.filter) {
        filterFunction = eval(GeneralUtil.fixFunctionString(body.filter));
      }
      if (body.sort) {
        sortFunction = eval(GeneralUtil.fixFunctionString(body.sort));
      }
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
        let output: unknown[] = [];
        const query: BCMSNuxtPluginQueryFunction<unknown> = eval(
          GeneralUtil.fixFunctionString(body.query),
        );
        for (let i = 0; i < content[body.key].length; i++) {
          try {
            const result = await query(
              body.variables,
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
            return;
          }
        }
        if (body.type === 'findOne') {
          if (output[0]) {
            res.write(JSON.stringify(output[0]));
          }
        } else {
          if (filterFunction) {
            output = output.filter((e, i) => filterFunction(e, i));
          }
          if (sortFunction) {
            output.sort((a, b) => sortFunction(a, b));
          }
          if (body.slice) {
            output = output.slice(body.slice.start, body.slice.end);
          }
          res.write(JSON.stringify(output));
        }
      }
    }
  } else {
    res.writeHead(400);
    res.write(JSON.stringify({ message: 'Missing body' }));
  }
};
