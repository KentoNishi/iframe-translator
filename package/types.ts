import { AvailableLanguages } from './constants';

export interface TranslateRequest {
  type: 'request' | 'response';
  targetLanguage: typeof AvailableLanguages[keyof typeof AvailableLanguages] | 'unset';
  text: string;
  messageID: string;
}

export interface LoadedPacket {
  type: 'loaded';
}
