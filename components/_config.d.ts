export interface BCMSImageConfigType {
  localImageProcessing: boolean;
  cmsOrigin: string;
  publicApiKeyId: string;
}

declare const BCMSImageConfig: BCMSImageConfigType;
