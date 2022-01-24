import { getClient } from './index';

(window as any).getClient  = getClient;


/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept([
    './index.ts',
  ]);
}
