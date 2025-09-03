import aiter from "#source/shared/aiter.js";


let items = [ 1000, 2000, 3000, 4000, 5000 ];

test('iterates over an array', t => 
{
    let actual = [], count = 0;
    let expect = items;
    let iter = aiter(items);

    for (let item of iter) 
    {
        count++;
        actual.push(item);
    }

    t.deepEqual(actual, expect);
    t.is(count, expect.length);
});

test('iterates while filtering an array', t => 
{
    let filter = item => item < 4500

    let actual = [], count = 0;
    let expect = items.filter(filter);
    let iter = aiter(items, null, filter);

    for (let item of iter) 
    {
        count++;
        actual.push(item);
    }

    t.deepEqual(actual, expect);
    t.is(count, expect.length);
});

test('iterates and transforms items in an array', t => 
{
    let xform = item => item + 100

    let actual = [];
    let expect = items.map(xform);
    let iter = aiter(items, xform);

    for (let item of iter) actual.push(item);

    t.deepEqual(actual, expect);
});

test('iterates while filtering and transforming items in an array', t => 
{
    let filter = item => item > 3500
    let xform = item => item + 100

    let actual = [];
    let expect = items.filter(filter).map(xform);
    let iter = aiter(items, xform, filter);

    for (let item of iter) actual.push(item);

    t.deepEqual(actual, expect);
});
