import { BCMSProp, BCMSPropType } from './prop';

export interface BCMSEntryMeta {
  [lng: string]: {
    [key: string]: BCMSProp;
  };
}

export interface BCMSEntryContent {
  [lng: string]: Array<{
    type: BCMSPropType;
    value: BCMSProp;
    name: string;
  }>;
}

export interface BCMSEntry {
  _id: string;
  createdAt: number;
  updatedAt: number;
  templateId: string;
  userId: string;
  status: string;
  meta: BCMSEntryMeta;
  content: BCMSEntryContent;
}
