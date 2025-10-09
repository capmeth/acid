import { AcidValidateError } from "#source/errors.js";
import help from "#source/utils/confine/helpers.js";


test('wraps a key/value pair', t => 
{
    let h = help('property', 'data');

    t.is(h.name, 'property');
    t.is(h.value, 'data');
});

test('can test `value` to be a certain type', t => 
{
    t.true(help('key', []).array);
    t.true(help('key', {}).nonao);
    t.true(help('key', null).null);
    t.true(help('key', 4).number);
    t.true(help('key', '').string);
    t.true(help('key', Symbol()).symbol);

    t.false(help('key', []).symbol);
    t.false(help('key', {}).string);
    t.false(help('key', null).number);
    t.false(help('key', 4).null);
    t.false(help('key', '').nonao);
    t.false(help('key', Symbol()).array);
});

test('can negate a test against `value` (not)', t => 
{
    let h = help('value', 3000);

    t.true(h.not(h.string));
    t.false(h.not(h.number));
});

test('can test `value` to be a certain value (in)', t => 
{
    let h = help('key', 'string');

    t.true(h.in('number', 'object', 'string'));
    t.false(h.in('ribeye', 'parlor', 'symbol'));
});

test('can test `value` to be an instance of a certain type', t => 
{
    let h = help('key', new Set());

    t.true(h.of(Set));
    t.false(h.of(Map));
});

test('can test `value` to match a regular expression', t => 
{
    let h = help('key', 'the quick brown fox');

    t.true(h.re(/quick/));
    t.false(h.re(/lazy/));
});

test('can compare `value` to another value', t => 
{
    let h = help('key', 7);

    t.true(h.lt(10));
    t.true(h.gt(5));
    t.true(h.lte(12));
    t.true(h.gte(7));

    t.false(h.lt(6));
    t.false(h.gt(9));
    t.false(h.lte(1));
    t.false(h.gte(8));
});

test('can test `value` to pass multiple criteria (and)', t => 
{
    let h = help('key', 'a light in the dark');

    t.true(h.and(h.string, h.re(/light/), h.not(h.re(/blue/))));
    t.false(h.and(h.re(/dark/), h.number));
});

test('can test `value` to pass at least one criteria (or)', t => 
{
    let h = help('key', 500);

    t.true(h.or(h.gte(600), h.in(340, 500, 725), h.gt(400)));
    t.false(h.or(h.symbol, h.not(h.lt(600)), h.of(BigInt)));
});

test('`to()` parameter returns new value on a passed test', t => 
{
    let h = help('key', 'value');
    let h2 = help('key', null);

    let actual1 = h.to(f => f.string(`data ${h.value}`))();
    let expect1 = 'data value';

    let actual2 = h.to(f => f.not(h.array)([ h.value ]))();
    let expect2 = [ 'value' ];

    let actual3 = h2.to('whatever')();
    let expect3 = void 0;

    t.deepEqual(actual1, expect1);
    t.deepEqual(actual2, expect2);
    t.deepEqual(actual3, expect3);
});

test('`to()` parameter returns `undefined` on a failed test', t => 
{
    let h = help('key', 'value');

    let actual1 = h.to(f => f.number(`data ${h.value}`))();
    let expect1 = void 0;

    let actual2 = h.to(f => f.not(h.string)(h.value))();
    let expect2 = void 0;

    t.deepEqual(actual1, expect1);
    t.deepEqual(actual2, expect2);
});

test('can auto-wrap `value` in on array if it is not already an array', t => 
{
    let h = help('key', 'value');
    let h2 = help('key', [ 'value' ]);

    let actual1 = h.to.array()();
    let expect1 = [ 'value' ];

    let actual2 = h.to.array('plus')();
    let expect2 = [ 'value', 'plus' ];

    let actual3 = h2.to.array([ 'skipme' ])();
    let expect3 = [ 'value' ];

    t.deepEqual(actual1, expect1);
    t.deepEqual(actual2, expect2);
    t.deepEqual(actual3, expect3);
});

test('can auto-wrap `value` in on object if it is not already an object', t => 
{
    let h = help('key', 'value');
    let h2 = help('key', { prop: 'value' });

    let actual1 = h.to.plain('data')();
    let expect1 = { data: 'value' };

    let actual2 = h.to.plain('first', { second: 15 })();
    let expect2 = { first: 'value', second: 15 };

    let actual3= h2.to.plain('data')();
    let expect3 = { prop: 'value' };

    t.deepEqual(actual1, expect1);
    t.deepEqual(actual2, expect2);
    t.deepEqual(actual3, expect3);
});

test('can generate the proper error with message prefixed by `name`', t => 
{
    let h = help('key', 'value');
    let err = h.symbol || h.err('is not a symbol');

    t.true(err instanceof AcidValidateError);
    t.true(err.prop === 'key');
    t.true(err.message.indexOf('is not a symbol') >= 0);
});
