import { LoadedPacket, TranslateRequest } from '../../package/types';

let targetLanguage = 'en';
let wrapper: HTMLDivElement | null = null;
let initialized = false;

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
  window.parent.postMessage(JSON.stringify({
    type: 'loaded',
    availableLanguages: Array.from(
      (document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement)
        .contentWindow.document
        .querySelectorAll('.goog-te-menu2 .goog-te-menu2-item .text')
    ).map(e => e.textContent)
  } as LoadedPacket), '*');
};

function translate(data: TranslateRequest) {
  return new Promise(resolve => {
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
        targetLanguage = data.targetLanguage;
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

