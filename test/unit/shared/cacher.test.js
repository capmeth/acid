import cacher from "#source/shared/cacher.js";


test('calls target for every new parameter set', t => 
{
    let spy = sinon.fake(x => x * 17);
    let test = cacher(spy);

    test(56);
    test(43);
    test(25);

    t.is(spy.callCount, 3);
});

test('calls target function only once for same parameters', t => 
{
    let spy = sinon.fake((a, b, c) => a + b + c);
    let test = cacher(spy);

    let one = test(53, 69, 45);
    let two = test(53, 69, 45);

    t.true(one === two);
    t.is(spy.callCount, 1);
});

test('clearCache(): clears saved value', t => 
{
    let fake = sinon.fake();
    let test = cacher(fake);

    test(300);
    test(300);
    test.clearCache();
    test(300);

    t.is(fake.callCount, 2);
});
