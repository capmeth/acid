import confine from "#source/utils/confine/index.js";
import { AcidValidateError, AcidROOperationError } from "#source/errors.js"


let array = ({ value }) => Array.isArray(value) || 'is not an array'
let boolean = ({ value }) => typeof value === 'boolean' || 'is not a boolean'
let flavors = ({ value }) => [ 'vanilla', 'chocolate', 'nutty', 'honey' ].includes(value) || 'is not included'
let nonao = ({ value }) => typeof value === 'object' && !Array.isArray(value) && value !== null || 'is not an object'
let number = ({ value }) => typeof value === 'number' || 'is not a number'
let string = ({ value }) => typeof value === 'string' || 'is not a string'
let undef = ({ value }) => typeof value === 'undefined' || 'is not undefined'

let def =
{
    'test': { test: nonao, default: {}, merge: true },
    'test.*': undef,
    'test.data': { test: nonao, default: {}, merge: true },
    'test.data.string': string,
    'test.data.number': number,
    'test.flavors': array,
    'test.flavors.*': undef,
    'test.flavors.0': flavors,
    'test.flavors.1': flavors,    
    'test.users': { test: array, default: [], merge: true },
    'test.users.*': { test: nonao, default: {} },
    'test.users.*.name': string,
    'test.users.*.educated': boolean,
    'test.food': { test: string, default: 'burrito' },
    'test.food<array>': array,
    'test.food<array>.*': string,
    'test.content': { test: array, default: [] },
    'test.content.*': 'test.data',
}


test('makes data verifications', t => 
{
    let { test } = confine(def);
    test.data.number = 400;
    test.data.string = 'bugger';

    let actual = test.data;
    let expect = { string: 'bugger', number: 400 };

    t.deepEqual(actual, expect);
});

test('blocks invalid properties from being set on an object', t => 
{
    let { test } = confine(def);

    let actual = () => test.sugar = 'cane'
    let expect = { instanceOf: AcidValidateError };

    t.throws(actual, expect);
});

test('gets default value when none set', t => 
{
    let { test } = confine(def);

    let actual = test.food;
    let expect = 'burrito';

    t.is(actual, expect);
});

test('merges values into a plain object', t => 
{
    let { test } = confine(def);

    test.data = { string: 'blanket' };
    test.data = { boolean: false };
    test.data = { number: 157 };

    let actual = test.data;
    let expect = { string: 'blanket', boolean: false, number: 157 };

    t.deepEqual(actual, expect);
});

test('appends values into an array', t => 
{
    let { test } = confine(def);

    test.users = [ { name: 'Fran' }, { name: 'Chuck', educated: false } ];
    test.users = [ { name: 'Raymond', age: 24 } ];

    let actual = test.users;
    let expect = [ { name: 'Fran' }, { name: 'Chuck', educated: false }, { name: 'Raymond', age: 24 } ];

    t.deepEqual(actual, expect);
});

test('validates value appended to an array', t => 
{
    let { test } = confine(def);

    let actual = () => test.users.push({ name: 6000 })
    let expect = { instanceOf: AcidValidateError };

    t.throws(actual, expect);
});

test('validates value prepended to an array', t => 
{
    let { test } = confine(def);

    let actual = () => test.users.unshift({ educated: 13 })
    let expect = { instanceOf: AcidValidateError };

    t.throws(actual, expect);
});

test('validates value spliced into an array', t => 
{
    let { test } = confine(def);

    test.users = [ { name: 'Jim' }, { name: 'Pam' } ];
    test.users.splice(0, 1, { name: 'Roy' });

    let actual = test.users
    let expect = [ { name: 'Roy' }, { name: 'Pam' } ];

    t.deepEqual(actual, expect);
});

test('throws on bad array operations', t => 
{
    let { test } = confine(def);

    let actuals =
    [
        () => test.users.copyWithin(),
        () => test.users.fill(),
        () => test.users.pop(),
        () => test.users.reverse(),
        () => test.users.shift(),
        () => test.users.sort(),
    ]

    let expect = { instanceOf: AcidROOperationError };

    actuals.forEach(actual => t.throws(actual, expect));
});

test('allows for type-specific data paths', t => 
{
    let { test } = confine(def);
    test.food = [ 'taco', 'enchilada', 'mulita' ];

    let actual = test.food;
    let expect = [ 'taco', 'enchilada', 'mulita' ];

    t.deepEqual(actual, expect);
});

test('allows for data path reusablity', t => 
{
    let { test } = confine(def);
    test.content.push({ string: 'letters', number: 7 });
    test.content.push({ string: 'symbols' });

    let actual = test.content;
    let expect = [ { string: 'letters', number: 7 }, { string: 'symbols' } ];

    t.deepEqual(actual, expect);

    let actual2 = () => test.content.push('rabbit')
    let expect2 = { instanceOf: AcidValidateError };

    t.throws(actual2, expect2);
});
