import uid from "#source/utils/uid.js";


test('generates same id for the same input', t => 
{
    let one = uid('fat boy');
    let two = uid('fat boy');      

    t.true(one === two);    
});

test('hex(): generates same id for the same input', t => 
{
    let one = uid.hex({ big: 'girl' });
    let two = uid.hex({ big: 'girl' });

    t.true(one === two);    
});

test('creates different ids for different input', t => 
{
    let one = uid('fat boy');
    let two = uid('big dog');
    
    t.true(one !== two);    
});

test('hex(): creates different ids for different input', t => 
{
    let one = uid.hex(['big', 'girl']);
    let two = uid.hex(['big', 'bear']);
    
    t.true(one !== two);
});

test('next(): returns a unique id on every call', t => 
{
    let one = uid.next();
    let two = uid.next();

    t.true(one !== two);
});

test('rand(): returns a unique id on every call', t => 
{
    let one = uid.rand();
    let two = uid.rand();

    t.true(one !== two);
});
