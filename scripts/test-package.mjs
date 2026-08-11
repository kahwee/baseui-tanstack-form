import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const esm = await import('../dist/index.js');
assert.equal(typeof esm.useAppForm, 'function');
assert.equal(typeof esm.createZodFieldValidator, 'function');

const zod = await import('../dist/zod.js');
assert.equal(typeof zod.createZodFieldValidator, 'function');

const require = createRequire(import.meta.url);
const cjs = require('../dist/index.cjs');
assert.equal(typeof cjs.useAppForm, 'function');

const cjsZod = require('../dist/zod.cjs');
assert.equal(typeof cjsZod.createZodFieldValidator, 'function');

console.log('Package ESM/CJS exports are loadable.');
