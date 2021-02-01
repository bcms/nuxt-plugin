import { Plugin, Context } from "@nuxt/types";
import {
  BCMSMostCacheContentItem,
  BCMSMostCacheContent,
} from "@becomes/cms-most/types";
import { BCMS } from "../types";
import * as http from "http";

const nuxtPlugin: Plugin = (context, inject) => {
  // const content: BCMSMostCacheContent = context.$config.cacheContent;

  const bcms: BCMS = {
    findOne: async (base, template, query) => {
      // if (process.env.NUXT_BCMS_LOCAL) {
      return await new Promise((resolve, reject) => {
        const data = JSON.stringify({
          type: "findOne",
          key: template,
          query: query.toString(),
        });
        let rawBody = "";
        const req = http.request(
          {
            hostname: 'localhost',
            port: 3002,
            path: `${base}/bcms-data.json`.replace(/\/\//g, '/'),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": data.length,
            },
          },
          (res) => {
            res.on("data", (chunk) => {
              rawBody += chunk;
            });
            res.on("end", () => {
              const body =JSON.parse(rawBody);
              if (body.message) {
                reject(body.message);
              } else {
                resolve(body);
              }
            });
          }
        );
        req.on("error", (error) => {
          reject(error);
        });
        req.write(data);
        req.end();
      });
      // }
      // const result = await fetch()
      // return {} as any;
      // if (!content[entry]) {
      //   throw Error(`Content with entry "${entry}" does not exist`);
      // }

      // const foundEntry: BCMSMostCacheContentItem = content[entry].find(
      //   (item) => item._id === entryId
      // );

      // if (!foundEntry) {
      //   throw Error(`Entry with id "${entryId}" does not exist`);
      // }

      // return foundEntry;
    },
    // find(entry) {
    //   // if (!content[entry]) {
    //   //   throw Error(`Content with entry "${entry}" does not exist`);
    //   // }

    //   // return content[entry];
    // },
  };

  inject("bcms", bcms);
};

export default nuxtPlugin;
