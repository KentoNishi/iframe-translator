import { TranslateRequest } from './types';

let targetLanguage = 'en';

(window as any).googleTranslateElementInit = () => {
  setInterval(() => {
    document.body.scrollTop = document.body.scrollHeight;
    const e: HTMLInputElement | null = document.querySelector('.goog-te-combo');
    if (e) {
      e.value = targetLanguage;
      e.dispatchEvent(new Event('change'));
    }
  }, 1000);
};

const messageCallback = (payload: {
  data: string;
}, calledViaTranslate=false) => {
  const e = document.createElement('div');
  const data: TranslateRequest = JSON.parse(payload.data);
  e.innerText = data.text;
  e.id = data.messageID;
  document.body.appendChild(e);
  (window as any).google.translate.TranslateElement({}, e.id);
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
      console.debug(response);
      if (!calledViaTranslate) {
        window.parent.postMessage(JSON.stringify(response), '*');
      }
      document.querySelectorAll(`#${data.messageID}`).forEach(e => e.remove());
      mutationObserver.disconnect();
      e.remove();
    }
  });
  mutationObserver.observe(e, {
    attributes: true, childList: true, characterData: true
  });
};

window.addEventListener('message', messageCallback);
(window as any).translate = (data: string) => messageCallback({ data }, true);
