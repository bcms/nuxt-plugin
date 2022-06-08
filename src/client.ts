import type { BCMSClient } from '@becomes/cms-client/types';

let bcmsClient: BCMSClient;

export function createBcmsNuxtClient(client: BCMSClient): void {
  bcmsClient = client;
}

export function useBcmsNuxtClient(): BCMSClient {
  return bcmsClient;
}
