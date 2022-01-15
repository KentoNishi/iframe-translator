export interface TranslateRequest {
  type: 'request' | 'response';
  targetLanguage: string;
  text: string;
  messageID: string;
}

export interface LoadedPacket {
  type: 'loaded';
}
