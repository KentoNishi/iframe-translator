export interface TranslateRequest {
  type: 'request' | 'response';
  targetLanguage: string;
  text: string;
  messageID: string;
}
