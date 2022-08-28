# iframe-translator

Translate text for free in the browser with iframe shenanigans

[![View on npm](https://img.shields.io/npm/v/iframe-translator)](https://www.npmjs.com/package/iframe-translator)
[![Publish Package](https://github.com/KentoNishi/iframe-translator/actions/workflows/package.yaml/badge.svg)](https://github.com/KentoNishi/iframe-translator/actions/workflows/package.yaml)
[![Deploy Frontend](https://github.com/KentoNishi/iframe-translator/actions/workflows/pages.yaml/badge.svg)](https://github.com/KentoNishi/iframe-translator/actions/workflows/pages.yaml)

[View on npm](https://www.npmjs.com/package/iframe-translator)

## Demo
[Try `iframe-translator` in an interactive REPL!](https://svelte.dev/repl/3f0ce1ebbe4c4788938fd753fba2255e)


## Installation
```shell
npm i iframe-translator
```

## Usage

### General Usage
```ts
import { getClient, AvailableLanguages } from 'iframe-translator';

async function main() {
  const client = await getClient();
  console.log(AvailableLanguages); // { 'af': 'Afrikaans', ... }
  console.log(await client.translate('こんにちは')); // hello
  console.log(await client.translate('こんにちは', 'ko')); // 안녕하세요
  client.destroy();
}
```

### Type Definitions
```ts
import type { AvailableLanguageCodes, IframeTranslatorClient } from 'iframe-translator';
```
