import equals from "#source/shared/equals.js";


test('compares two strings for equality', t => 
{
    let one = 'happy day';
    let two = 'happy day';
    let three = 'crappy day';

    t.true(equals(one, two));
    t.false(equals(one, three));
});

test('compares two numbers for equality', t => 
{
    let one = 4;
    let two = 4;
    let three = '4';

    t.true(equals(one, two));
    t.false(equals(one, three));
});

test('reports NaN values as equal', t => 
{
    let one = NaN;
    let two = 12 * 'what?';
    let three = 1 / 0;

    t.true(equals(one, two));
    t.false(equals(one, three));
});

test('compares two objects for equality', t => 
{
    let one = { red: 'pill', blue: 'dot', green: [ 'eggs' ] };
    let two = { blue: 'dot', red: 'pill', green: [ 'eggs' ] };
    let three = { blue: 'dot', red: 'eggs', green: [ 'pill' ] };

    t.true(equals(one, two));
    t.false(equals(one, three));
});

test('can compare two arrays for equality', t => 
{
    let one = [ 'pork', 'chicken', 'beef', 'fish', 'eggs' ];
    let two = [ 'pork', 'chicken', 'beef', 'fish', 'eggs' ];
    let three = [ 'beef', 'chicken', 'pork', 'eggs', 'fish' ];

    t.true(equals(one, two));
    t.false(equals(one, three));
});

test('compares two empty objects for equality', t => 
{
    t.true(equals({}, {}));
    t.true(equals([], []));
    t.false(equals([], {}));
    t.false(equals(null, []));
});

test('ensures two objects have the same number of entries', t => 
{
    t.true(equals([ 1, 2, 3 ], [ 1, 2, 3 ]));
    t.false(equals([ 3, 2, 1 ], [ 3, 2 ]));
});

test('ensures two objects have the same keys', t => 
{
    t.true(equals({ one: 1, two: 2 }, { one: 1, two: 2 }));
    t.false(equals({ one: 1, two: 2 }, { one: 1, three: 3 }));
});
