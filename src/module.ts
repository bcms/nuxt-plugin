import { Module } from '@nuxt/types';
import { BCMSMostConfig } from '@becomes/cms-most/types';

const nuxtModule: Module<BCMSMostConfig> = function(moduleOptions) {
  const options: BCMSMostConfig = {
    ...this.options.bcms,
    ...moduleOptions,
  };

  this.nuxt.hook('ready', () => {
    console.log('On pre init');
    console.log('options', options);
  });

  this.nuxt.hook('generate:done', () => {
    console.log('On post build');
    console.log('options', options);
  });
};

export default nuxtModule;

// REQUIRED if publishing the module as npm package
// export const meta = require('./package.json')
