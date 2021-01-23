import { Module } from '@nuxt/types';
import { BCMSMostConfig } from '@becomes/cms-most/types';

const bcmsModule: Module<BCMSMostConfig> = function (moduleOptions) {
  const options: BCMSMostConfig = {
    ...this.options.bcms,
    ...moduleOptions,
  };

  console.log(options);

  // Use this, this.options, this.nuxt
  // Use moduleOptions
};

export default bcmsModule;

// REQUIRED if publishing the module as npm package
// export const meta = require('./package.json')
