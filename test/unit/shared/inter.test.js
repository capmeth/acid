import inter from "#source/shared/inter.js";


let string = 'The quick brown {animal} jumped over the {adjective} dog.';

test('replaces brace enclosed elements with specified values', t => 
{
    let actual = inter(string, { animal: 'tiger', adjective: 'sleeping' });
    let expect = 'The quick brown tiger jumped over the sleeping dog.';

    t.is(actual, expect);
});

test('leaves brace enclosed elements with nullish values as-is', t => 
{
    let actual = inter(string, { adjective: 'running' });
    let expect = 'The quick brown {animal} jumped over the running dog.';

    t.is(actual, expect);
});
