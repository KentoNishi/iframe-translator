import { LoadedPacket, TranslateRequest } from '../../package/types';

let targetLanguage = 'en';
let wrapper: HTMLDivElement | null = null;

(window as any).googleTranslateElementInit = () => {
  setInterval(() => {
    document.body.scrollTop = document.body.scrollHeight * 2;
  }, 1000);
  wrapper = document.createElement('div');
  wrapper.id = 'parent-wrapper';
  document.body.appendChild(wrapper);
  window.parent.postMessage(JSON.stringify({
    type: 'loaded'
  } as LoadedPacket), '*');
};

const messageCallback = (payload: {
  data: string;
}, calledViaTranslate=false) => {
  if (!wrapper) return;
  const e = document.createElement('div');
  const data: TranslateRequest = JSON.parse(payload.data);
  e.innerText = data.text;
  const randomID = data.messageID.replace(/[^a-zA-Z0-9]/g, '');
  e.id = randomID;
  wrapper.appendChild(e);
  const destroy = () => {
    mutationObserver.disconnect();
    e.outerHTML = '';
    document.querySelectorAll(`#${randomID}`)?.forEach(e => e.remove());
  };
  setTimeout(() => {
    const e: HTMLInputElement | null = document.querySelector('.goog-te-combo');
    if (e) {
      e.value = targetLanguage;
      e.dispatchEvent(new Event('change'));
    }
  }, 1000);
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
      if (!calledViaTranslate) {
        window.parent.postMessage(JSON.stringify(response), '*');
      }
      destroy();
      clearTimeout(eliminator);
    }
  });
  const eliminator = setTimeout(destroy, 5000);
  mutationObserver.observe(e, {
    attributes: true, childList: true, characterData: true
  });
  setTimeout(() => {
    (window as any).google.translate.TranslateElement({}, e.id);
  }, 0);
};

window.addEventListener('message', messageCallback);
(window as any).translate = (data: string) => messageCallback({ data }, true);
