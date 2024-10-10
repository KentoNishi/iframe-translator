import {
  copyFileSync,
  mkdirSync,
  existsSync
} from 'fs';
import { execSync } from 'child_process';

if (!existsSync('dist')) {
  mkdirSync('dist');
}

const command = 'tsc --target es6 --module esnext --declaration --outDir ./dist index.ts';
try {
  execSync(command);
} catch (error) {
  console.error(error.stdout.toString());
  console.error(error.stderr.toString());
}

[
  ['package.json', 'package.json'],
  ['../README.md', 'README.md'],
  ['../LICENSE', 'LICENSE'],
].forEach(file => {
  copyFileSync(file[0], `dist/${file[1]}`);
});
