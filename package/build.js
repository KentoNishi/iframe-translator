import {
  copyFileSync
} from 'fs';

[
  'package.json',
  '../README.md',
  '../LICENSE',
].forEach(file => {
  copyFileSync(file, `dist/${file}`);
});
