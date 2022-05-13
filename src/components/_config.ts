const proc = typeof process !== 'undefined' ? process : null;

export class BCMSImageConfig {
  static localImageProcessing = false;
  static cmsOrigin =
    proc && process.env.NUXT_ENV_BCMS_ORIGIN
      ? process.env.NUXT_ENV_BCMS_ORIGIN
      : '';
  static publicApiKeyId =
    proc && process.env.NUXT_ENV_BCMS_PUBLIC_KEY_ID
      ? process.env.NUXT_ENV_BCMS_PUBLIC_KEY_ID
      : '';
}
