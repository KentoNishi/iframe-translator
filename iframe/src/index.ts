import { LoadedPacket, TranslateRequest } from '../../package/types';
import { AvailableLanguages } from '../../package/constants';

let wrapper: HTMLDivElement | null = null;
let doc: Document | null = null;
let initialized = false;

const languageSelectorElements = () => Array.from(
  doc ? doc.querySelectorAll('.goog-te-menu2 a .text') : []
);

(window as any).googleTranslateElementInit = async () => {
  setInterval(() => {
    try {
      document.body.scrollTop = document.body.scrollHeight * 2;
      const buttonParent = (
        document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
      ).contentWindow.document.querySelector('.goog-te-button') as HTMLInputElement;
      if (buttonParent.parentElement.parentElement.style.display === 'none') {
        return;
      }
      const button = buttonParent.querySelector('button') as HTMLButtonElement;
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
    doc = (document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement)
      .contentWindow.document;
    window.parent.postMessage(JSON.stringify({
      type: 'loaded'
    } as LoadedPacket), '*');
  }, 500);
};

function refreshTargetLanguage(lang: TranslateRequest['targetLanguage']) {
  try {
    const providedLanguages =
    (window as any).google.translate
      .TranslateElement.getInstance()
      .B as typeof AvailableLanguages;
    const languageCode =
      Object.keys(providedLanguages).find(
        key => providedLanguages[key] === lang
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
    if (!initialized) {
      setTimeout(() => {
        const e: HTMLInputElement | null = document.querySelector('.goog-te-combo');
        if (e) {
          e.value = data.targetLanguage;
          e.dispatchEvent(new Event('change'));
        }
      }, 500);
      initialized = true;
    }
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

