# iframe-translator

Translate text for free in the browser with iframe shenanigans

[![Publish Package](https://github.com/KentoNishi/iframe-translator/actions/workflows/package.yaml/badge.svg)](https://github.com/KentoNishi/iframe-translator/actions/workflows/package.yaml)
[![Deploy Frontend](https://github.com/KentoNishi/iframe-translator/actions/workflows/pages.yaml/badge.svg)](https://github.com/KentoNishi/iframe-translator/actions/workflows/pages.yaml)


## Installation
```shell
npm i iframe-translator
```

## Usage

```ts
import { getClient } from 'iframe-translator';

async function main() {
  const client = await getClient();
  const translation = await client.translate('こんにちは'); // hello
  // translation to non-english languages are not supported yet.
}
```
