/**
 * @typedef {import('./_config').BCMSImageConfigType} BCMSImageConfig
 */

const proc = typeof process !== 'undefined' ? process : null;

/**
 * @type BCMSImageConfig
 */
exports.BCMSImageConfig = {
  localImageProcessing: false,
  cmsOrigin:
    proc && process.env.NUXT_ENV_BCMS_ORIGIN
      ? process.env.NUXT_ENV_BCMS_ORIGIN
      : '',
  publicApiKeyId:
    proc && process.env.NUXT_ENV_BCMS_PUBLIC_KEY_ID
      ? process.env.NUXT_ENV_BCMS_PUBLIC_KEY_ID
      : '',
};
