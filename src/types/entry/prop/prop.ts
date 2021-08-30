import { BCMSEntry } from '../main';
import { BCMSPropEntryPointer } from './entry-pointer';
import { BCMSPropEnum } from './enum';
import { BCMSPropGroupPointer } from './group-pointer';
import { BCMSPropWidget } from './widget';

// eslint-disable-next-line no-shadow
export enum BCMSPropType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',

  DATE = 'DATE',
  ENUMERATION = 'ENUMERATION',
  MEDIA = 'MEDIA',

  GROUP_POINTER = 'GROUP_POINTER',
  ENTRY_POINTER = 'ENTRY_POINTER',

  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  HEADING_4 = 'HEADING_4',
  HEADING_5 = 'HEADING_5',

  PARAGRAPH = 'PARAGRAPH',

  LIST = 'LIST',
  EMBED = 'EMBED',
  CODE = 'CODE',
  WIDGET = 'WIDGET',

  RICH_TEXT = 'RICH_TEXT',
}

export type BCMSProp =
  | string
  | string[]
  | boolean
  | boolean[]
  | number
  | number[]
  | BCMSPropEnum
  | BCMSEntry
  | BCMSEntry[]
  | BCMSPropEntryPointer
  | BCMSPropGroupPointer
  | BCMSPropGroupPointer[]
  | BCMSPropWidget
  | {
      type: BCMSPropType;
      value: BCMSProp;
    };
