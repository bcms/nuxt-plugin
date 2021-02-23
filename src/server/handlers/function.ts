import { BCMSNuxtRouteHandler } from '../../types';

interface Body {
  name: string;
}

export const FunctionHandler: BCMSNuxtRouteHandler<Body> = async (
  req,
  res,
  body,
  bcmsMost,
) => {
  if (body) {
    const functionContent = JSON.parse(
      JSON.stringify(await bcmsMost.cache.get.function()),
    );
    if (!functionContent[body.name]) {
      res.write(
        JSON.stringify({
          message: `Content items for "${body.name}" do not exist.`,
        }),
      );
    } else {
      res.write(JSON.stringify(functionContent[body.name]));
    }
  } else {
    res.writeHead(400);
    res.write(JSON.stringify({ message: 'Missing body' }));
  }
};
