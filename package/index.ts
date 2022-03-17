import { LoadedPacket, TranslateRequest } from './types';
import { AvailableLanguages, DefaultHost } from './constants';
export { AvailableLanguages } from './constants';

export type IframeTranslatorClient = {
  translate: (
    text: string,
    targetLanguage?: typeof AvailableLanguages[number]
  ) => Promise<string>;
  destroy: () => void;
};

function makeID(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getClient(
  host=DefaultHost
): Promise<IframeTranslatorClient> {
  return new Promise(resolveParent => {
    const iframe: HTMLIFrameElement =
      document.querySelector('#iframe-translator') || document.createElement('iframe');
    iframe.src = host;
    iframe.id = 'iframe-translator';
    iframe.style.position = 'fixed';
    iframe.style.top = '0px';
    iframe.style.left = '0px';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.zIndex = '1000000000';
    iframe.style.pointerEvents = 'none';
    iframe.style.border = 'none';
    iframe.style.filter = 'opacity(0)';
    // iframe.style.backgroundColor = 'red';

    let callbacks: { [key: string]: CallableFunction } = {};

    function translate(
      text: string,
      targetLanguage = 'English',
    ): Promise<string> {
      const id = `iframe-translator-${makeID(69)}`;
      return new Promise(resolve => {
        callbacks[id] = resolve;
        iframe.contentWindow.postMessage(JSON.stringify({
          messageID: id,
          type: 'request',
          targetLanguage,
          text
        } as TranslateRequest), '*');
      });
    }

    function onMessage(event: MessageEvent) {
      try {
        const data = JSON.parse(event.data) as LoadedPacket | TranslateRequest;
        if (data.type === 'loaded') {
          resolveParent({
            translate,
            destroy
          });
          return;
        }
        const {
          messageID,
          type,
          text,
        } = data;
        if (type === 'response') {
          callbacks[messageID](text);
          delete callbacks[messageID];
        }
      } catch (e) {
      }
    }

    window.addEventListener('message', onMessage);

    function destroy() {
      document.body.removeChild(iframe);
      callbacks = {};
      window.removeEventListener('message', onMessage);
    }

    document.body.appendChild(iframe);
  });
}
