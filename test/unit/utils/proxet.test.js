import proxet from "#source/utils/proxet.js";


test('getters cache generated values', t => 
{
    let getter = sinon.fake(prop => prop);
    let proxie = proxet({}, getter);

    proxie.one
    proxie.two
    proxie.one 
    
    t.is(getter.callCount, 2);
});

test('getters do not cache undefined values', t => 
{
    let getter = sinon.fake(prop => void 0);
    let proxie = proxet({}, getter);

    proxie.one
    proxie.two
    proxie.one 
    proxie.two
    
    t.is(getter.callCount, 4);
});

test('getters set generated values on target object', t => 
{
    let actual = {};
    let expect = { one: 'one', two: 'two' };
    let proxie = proxet(actual, prop => prop);

    proxie.one
    proxie.two

    t.deepEqual(actual, expect);
});

test('getters do not set undefined values on target object', t => 
{
    let actual = {};
    let expect = {};
    let proxie = proxet(actual, prop => void 0);

    proxie.one
    proxie.two

    t.deepEqual(actual, expect);
});


test('does not permit setters (silent fail)', t => 
{
    let actual = {};
    let expect = {};
    let proxie = proxet(actual, prop => prop);

    proxie.one = 1;
    proxie.two = 2;

    t.deepEqual(actual, expect);
});
