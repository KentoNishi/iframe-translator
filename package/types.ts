import { AvailableLanguages } from './constants';

export interface TranslateRequest {
  type: 'request' | 'response';
  targetLanguage: AvailableLanguageCodes | typeof AvailableLanguages[AvailableLanguageCodes] | 'unset';
  text: string;
  messageID: string;
}

export interface LoadedPacket {
  type: 'loaded';
}

export type AvailableLanguageCodes = keyof typeof AvailableLanguages;
