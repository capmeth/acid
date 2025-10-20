import debounce from "#source/utils/debounce.js";


test('queues target function if timeout is not a positive number', async t => 
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

test('calls target function with proper `this` context', async t => 
{
    let object =
    {
        double: debounce(function() { return this.value *= 2; }),
        value: 10
    }

    object.double();
    await new Promise(accept => setTimeout(accept, 0));

    t.is(object.value, 20);
});
