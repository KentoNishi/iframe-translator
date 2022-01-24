# iframe-translator

Translate text for free in the browser with iframe shenanigans

[![View on npm](https://img.shields.io/npm/v/iframe-translator)](https://www.npmjs.com/package/iframe-translator)
[![Publish Package](https://github.com/KentoNishi/iframe-translator/actions/workflows/package.yaml/badge.svg)](https://github.com/KentoNishi/iframe-translator/actions/workflows/package.yaml)
[![Deploy Frontend](https://github.com/KentoNishi/iframe-translator/actions/workflows/pages.yaml/badge.svg)](https://github.com/KentoNishi/iframe-translator/actions/workflows/pages.yaml)

[View on npm](https://www.npmjs.com/package/iframe-translator)


## Installation
```shell
npm i iframe-translator
```

## Usage

```ts
import { getClient, IframeTranslatorClient } from 'iframe-translator';

async function main() {
  const client: IframeTranslatorClient = await getClient();
  console.log(client.availableLanguages); // ['Afrikaans', 'Albanian', 'Amharic', ...]
  console.log(await client.translate('こんにちは')); // hello
  console.log(await client.translate('こんにちは', 'Korean')); // 안녕하세요
  client.destroy();
}
```
