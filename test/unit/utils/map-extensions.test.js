import mapExtensions from "#source/utils/map-extensions.js";


test('maps and merges extension specs into an object', async t => 
{
    let specs =
    [
        { types: [ 'jsx', 'vue' ], mode: 'demo', hide: true },
        { types: [ 'emb', 'vue' ], mode: 'edit', imports: true }
    ];

    let actual = await mapExtensions(specs);
    let expect = 
    {
        emb: { mode: 'edit', imports: true },
        jsx: { mode: 'demo', hide: true },
        vue: { mode: 'edit', hide: true, imports: true }
    };

    t.deepEqual(actual, expect);
});

test('calls resolved `spec.use` function with type and parameter and sets `spec.use` to return value', async t => 
{
    let specs =
    [
        { types: [ 'jsx' ], use: [ '#test/stooges/exports3.js' ] },
        { types: [ 'vue' ], use: [ ({ param, type }) => [ param, type ], 'Hello1' ] }
    ];

    let actual = await mapExtensions(specs);
    let expect = 
    {
        jsx: { use: 'Stooge!' },
        vue: { use: [ 'Hello1', 'vue' ] }
    };

    t.deepEqual(actual, expect);
});

test('can use alternative import function', async t => 
{
    let specifier = '#test/stooges/exports3.js';
    let fake = sinon.fake(name => import(name))

    let specs =
    [
        { types: [ 'jsx' ], use: [ specifier ] },
    ];

    let actual = await mapExtensions(specs, fake);
    let expect = 
    {
        jsx: { use: 'Stooge!' },
    };

    t.deepEqual(actual, expect);
    t.is(fake.firstArg, specifier);
});

test('does not use alternative import function for built-in extensions', async t => 
{
    let fake = sinon.fake(name => import(name))

    let specs =
    [
        { types: [ 'jsx' ], use: [ '#exts/jsdoc' ] },
    ];

    await mapExtensions(specs, fake);

    t.true(fake.notCalled);
});
