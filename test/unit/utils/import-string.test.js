import importString from "#source/utils/import-string.js"
import vimo from "#test/lib/virtual-module.js"
import default1, * as named1 from '#test/stooges/exports1.js';
import * as named2 from '#test/stooges/exports2.js';


let exports1 = '#test/stooges/exports1.js';
let exports2 = '#test/stooges/exports2.js';

test('allows for import without specifying an export', async t => 
{
    let expect = `import "${exports1}"`;
    let actual = await importString(exports1);
    
    t.is(actual, expect);
    await t.notThrowsAsync(vimo(actual));
});

test('allows for import of the default export', async t => 
{
    let dec = { default: 'imported' };
    let exp = `; export { imported }`;
    let mod = await importString(exports1, dec).then(str => vimo(str + exp));

    t.is(mod.imported, default1);
});

test('allows for import of all named exports as namespace', async t => 
{
    let dec = { default: '* as imported' };
    let exp = `; export { imported }`;
    let mod = await importString(exports1, dec).then(str => vimo(str + exp));

    t.deepEqual(mod.imported, { ...named1 });
});

test('allows for import of all named exports individually', async t => 
{
    let dec = { names: '*' };
    let exp = `; export { array, random }`;
    let mod = await importString(exports2, dec).then(str => vimo(str + exp));

    t.deepEqual(mod.array, named2.array);
    t.true(typeof mod.random === typeof named2.random);
});

test('allows for import of a specific named exports', async t => 
{
    let dec = { names: 'one, color, two' };
    let exp = `; export { one, color, two }`;
    let mod = await importString(exports1, dec).then(str => vimo(str + exp));

    t.is(mod.one, named1.one);
    t.is(mod.color, named1.color);
    t.is(mod.two, named1.two);
});

test('allows for import of named exports filtered by function', async t => 
{
    let dec = { names: n => n === 'one' || n === 'two' ? n : null };
    let exp = `; export { one, two }`;
    let mod = await importString(exports1, dec).then(str => vimo(str + exp));

    t.is(mod.one, named1.one);
    t.is(mod.two, named1.two);
});

test('allows for import of named exports filtered by regular expression', async t => 
{
    let dec = { names: /read/ };
    let exp = `; export { ready, readily }`;
    let mod = await importString(exports1, dec).then(str => vimo(str + exp));

    t.is(mod.ready, named1.ready);
    t.is(mod.readily, named1.readily);
});
