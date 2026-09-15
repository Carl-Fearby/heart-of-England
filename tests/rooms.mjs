import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync('app/rooms.ts', 'utf8')
  .replace('import data from "./data/rooms.json";', `const data = ${fs.readFileSync('app/data/rooms.json', 'utf8')};`);
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { capacity, filterRooms } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

assert.equal(filterRooms('100', '', 'Theatre').length, 3);
assert.deepEqual(filterRooms('100', '', 'Theatre').map(room => room.slug), ['birchley-suite', 'the-marquee', 'the-big-dome-2']);
assert.equal(filterRooms('61', 'Meeting', '').length, 0);
assert.equal(filterRooms('30', 'Meeting', 'Boardroom').length, 2);
assert.equal(capacity(filterRooms('', 'Conference', '')[0], 'Theatre'), 650);
console.log('Passed: room filters use the published capacities and never invent an unpublished layout capacity.');
