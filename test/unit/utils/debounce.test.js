import debounce from "#source/utils/debounce.js";


test('calls target function immediately if timeout is negative', t => 
{
    let fake = sinon.fake();
    let timer = debounce(fake, -1);

    timer();

    t.true(fake.called);
});

test('queues target function if timeout is undefined', async t => 
{
    let fake = sinon.fake();
    let timer = debounce(fake);

    Array.from(Array(5)).forEach(timer);
    await new Promise(accept => setTimeout(accept));

    t.true(fake.calledOnce);
});

test('queues target function if timeout is zero or greater', async t => 
{
    let fake = sinon.fake();
    let timer = debounce(fake, 10);

    Array.from(Array(5)).forEach(timer);
    await new Promise(accept => setTimeout(accept, 10));

    t.true(fake.calledOnce);
});

test('allows change to timeout after creation', async t => 
{
    let fake = sinon.fake();
    let timer = debounce(fake);

    timer(); // immediate bounce

    timer.wait(50);

    setTimeout(timer, 30);
    setTimeout(timer, 70); // timeout bounce after
    setTimeout(timer, 130);
    setTimeout(timer, 170); // timeout bounce after
    setTimeout(timer, 240); // timeout bounce after

    await new Promise(accept => setTimeout(accept, 300));

    t.is(fake.callCount, 4);
});

test('calls target function with proper `this` context', t => 
{
    let object =
    {
        double: debounce(function() { return this.value *= 2; }, -1),
        value: 10
    }

    object.double();

    t.is(object.value, 20);
});
