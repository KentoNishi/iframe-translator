import { TranslateRequest } from './types';

(window as any).googleTranslateElementInit = () => {
  setTimeout(() => {
    const e: HTMLInputElement | null = document.querySelector('.goog-te-combo');
    if (e) {
      e.value = 'en';
      e.dispatchEvent(new Event('change'));
    }
  }, 1000);
  setInterval(() => {
    document.body.scrollTop = document.body.scrollHeight;
  }, 0);
};

window.addEventListener('message', (payload) => {
  const e = document.createElement('div');
  const data: TranslateRequest = JSON.parse(payload.data);
  e.innerText = data.text;
  e.id = Date.now().toString();
  document.body.appendChild(e);
  (window as any).google.translate.TranslateElement({}, e.id);
  const mutationObserver = new MutationObserver(() => {
    const textElem = e.querySelector('font');
    if (textElem && textElem.textContent !== data.text) {
      const response: TranslateRequest = {
        targetLanguage: data.targetLanguage,
        text: textElem.textContent,
        type: 'response'
      };
      console.debug(response);
      window.parent.postMessage(JSON.stringify(response), '*');
    }
  });
  mutationObserver.observe(e, {
    attributes: true, childList: true, characterData: true
  });
});
