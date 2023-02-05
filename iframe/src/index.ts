import { LoadedPacket, TranslateRequest } from '../../package/types';
import { AvailableLanguages } from '../../package/constants';

let wrapper: HTMLDivElement | null = null;
let doc: Document | null = null;
// let initialized = false;

const languageSelectorElements = () => Array.from(
  doc ? Array.from(doc.querySelectorAll('div')).find(item => item.id === ':2.menuBody').querySelectorAll('a .text') : []
);

(window as any).googleTranslateElementInit = async () => {
  setInterval(() => {
    try {
      document.body.scrollTop = document.body.scrollHeight * 2;
      const button = Array.from((
        Array.from(document.querySelectorAll('iframe')).find(item => item.id === ':1.container') as HTMLIFrameElement
      ).contentWindow.document.querySelectorAll('button')).find(item => item.id === ':1.confirm') as HTMLButtonElement;
      button.click();
    } catch (e) {
    }
  }, 1000);
  wrapper = document.createElement('div');
  wrapper.id = 'parent-wrapper';
  document.body.appendChild(wrapper);
  window.addEventListener('message', messageCallback);
  await translate({
    type: 'request',
    messageID: 'init',
    text: '',
    targetLanguage: 'unset'
  });
  setTimeout(() => {
    doc = (document.querySelectorAll('iframe')[1] as HTMLIFrameElement)
      .contentWindow.document;
    window.parent.postMessage(JSON.stringify({
      type: 'loaded'
    } as LoadedPacket), '*');
  }, 500);
};

function refreshTargetLanguage(lang: TranslateRequest['targetLanguage']) {
  try {
    const instance =(window as any).google.translate
      .TranslateElement.getInstance();
    const key = Object.keys(instance).sort().find(key => {
      return typeof instance[key] === 'object' && 'en' in instance[key];
    });
    const providedLanguages = instance[key] as typeof AvailableLanguages;
    const languageCode =
      Object.keys(AvailableLanguages).find(
        key => AvailableLanguages[key] === lang
      ) as keyof typeof AvailableLanguages;
    const selected = languageSelectorElements()[
      Object.keys(providedLanguages).indexOf(languageCode)
    ] as HTMLInputElement;
    selected.click();
  } catch (e) {
  }
}

function translate(data: TranslateRequest) {
  return new Promise(resolve => {
    refreshTargetLanguage(data.targetLanguage);
    const e = document.createElement('div');
    e.innerText = data.text;
    const randomID = data.messageID.replace(/[^a-zA-Z0-9]/g, '');
    e.id = randomID;
    wrapper.appendChild(e);
    const destroy = () => {
      mutationObserver.disconnect();
      e.remove();
      document.querySelectorAll(`#${randomID}`)?.forEach(e => e.remove());
    };
    // if (!initialized) {
    //   setTimeout(() => {
    // eslint-disable-next-line max-len
    //     const e: HTMLInputElement | null = document.querySelector('.goog-te-combo');
    //     if (e) {
    //       e.value = data.targetLanguage;
    //       e.dispatchEvent(new Event('change'));
    //     }
    //   }, 500);
    //   initialized = true;
    // }
    const mutationObserver = new MutationObserver(() => {
      const textElem = e.querySelector('font');
      if (textElem && textElem.textContent !== data.text) {
        const response: TranslateRequest = {
          targetLanguage: data.targetLanguage,
          text: textElem.textContent,
          type: 'response',
          messageID: data.messageID,
        };
        resolve(response);
        destroy();
        clearTimeout(eliminator);
      }
    });
    const respondEmpty = () => {
      destroy();
      resolve({
        type: 'response',
        targetLanguage: data.targetLanguage,
        text: data.text,
        messageID: data.messageID,
      } as TranslateRequest);
    };
    const eliminator = setTimeout(respondEmpty, 5000);
    mutationObserver.observe(e, {
      attributes: true, childList: true, characterData: true
    });
    setTimeout(() => {
      (window as any).google.translate.TranslateElement({}, e.id);
      if (!data.text) {
        respondEmpty();
      }
    }, 0);
  });
}

async function messageCallback(payload: {
  data: string;
}) {
  const data: TranslateRequest = JSON.parse(payload.data);
  const response = await translate(data);
  window.parent.postMessage(JSON.stringify(response), '*');
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
}

