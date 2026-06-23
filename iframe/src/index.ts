import { LoadedPacket, TranslateRequest } from '../../package/types';
import { AvailableLanguages } from '../../package/constants';

const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
const REQUEST_TIMEOUT_MS = 5000;

const languageCodes = Object.keys(
  AvailableLanguages
) as Array<keyof typeof AvailableLanguages>;

function getTargetLanguageCode(
  targetLanguage: TranslateRequest['targetLanguage']
): keyof typeof AvailableLanguages | null {
  if (targetLanguage === 'unset') return null;

  if (targetLanguage in AvailableLanguages) {
    return targetLanguage as keyof typeof AvailableLanguages;
  }

  return languageCodes.find(
    code => AvailableLanguages[code] === targetLanguage
  ) ?? null;
}

function parseTranslatedText(value: unknown): string | null {
  if (!Array.isArray(value) || !Array.isArray(value[0])) return null;

  return value[0]
    .map(part => Array.isArray(part) ? part[0] : '')
    .filter(part => typeof part === 'string')
    .join('');
}

async function translate(data: TranslateRequest): Promise<TranslateRequest> {
  const targetLanguage = getTargetLanguageCode(data.targetLanguage);
  if (!data.text || targetLanguage === null) {
    return {
      ...data,
      type: 'response',
    };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const url = new URL(TRANSLATE_URL);
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', 'auto');
    url.searchParams.set('tl', targetLanguage);
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', data.text);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });
    const result = parseTranslatedText(await response.json()) ?? data.text;

    return {
      ...data,
      targetLanguage,
      type: 'response',
      text: result,
    };
  } catch (e) {
    return {
      ...data,
      type: 'response',
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

async function messageCallback(payload: {
  data: string;
}) {
  const data: TranslateRequest = JSON.parse(payload.data);
  const response = await translate(data);
  window.parent.postMessage(JSON.stringify(response), '*');
}

window.addEventListener('message', messageCallback);

window.parent.postMessage(JSON.stringify({
  type: 'loaded'
} as LoadedPacket), '*');

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
}
