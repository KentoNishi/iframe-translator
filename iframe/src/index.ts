import { LoadedPacket, TranslateRequest } from '../../package/types';

const targetLanguage = 'English';
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
      if (document.querySelector('.goog-te-button').parentElement.parentElement.style.display !== 'none') {
        (document.querySelector('.goog-te-button button') as HTMLButtonElement).click();
      }
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
    text: 'イニシャライズ',
    targetLanguage
  });
  doc = (document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement)
    .contentWindow.document;
  window.parent.postMessage(JSON.stringify({
    type: 'loaded',
    availableLanguages: languageSelectorElements().map(e =>
      e.textContent
    ).sort()
  } as LoadedPacket), '*');
};

function refreshTargetLanguage(lang: string) {
  const selected = languageSelectorElements().find(e =>
    e.textContent === lang
  ) as HTMLInputElement;
  if (selected) {
    selected.click();
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
          e.value = targetLanguage;
          e.dispatchEvent(new Event('change'));
        }
      }, 500);
      initialized = true;
    }
    const mutationObserver = new MutationObserver(() => {
      const textElem = e.querySelector('font');
      if (textElem && textElem.textContent !== data.text) {
        const response: TranslateRequest = {
          targetLanguage,
          text: textElem.textContent,
          type: 'response',
          messageID: data.messageID,
        };
        resolve(response);
        destroy();
        clearTimeout(eliminator);
      }
    });
    const eliminator = setTimeout(() => {
      destroy();
      resolve(undefined);
    }, 5000);
    mutationObserver.observe(e, {
      attributes: true, childList: true, characterData: true
    });
    setTimeout(() => {
      (window as any).google.translate.TranslateElement({}, e.id);
    }, 0);
  });
}

async function messageCallback(payload: {
  data: string;
}) {
  const data: TranslateRequest = JSON.parse(payload.data);
  const response = await translate(data);
  if (response) {
    window.parent.postMessage(JSON.stringify(response), '*');
  }
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
}

