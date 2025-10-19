import searchReplacer from "#source/utils/search-replacer.js";


let string = "O come to the altar, the Father's arms are open wide."

test('makes a search/replace function based on a string', t => 
{
    let sarf = searchReplacer('the ');

    let actual = sarf(string);
    let expect = "O come to altar, the Father's arms are open wide.";

    t.is(actual, expect);
});

test('makes a search/replace function based on an array', t => 
{
    let sarf = searchReplacer([ "Father's arms are", "arms of Yahweh" ]);

    let actual = sarf(string);
    let expect = "O come to the altar, the arms of Yahweh open wide.";

    t.is(actual, expect);
});

test('makes a search/replace function based on an object with `search` and `replace` properties', t => 
{
    let sarf = searchReplacer({ search: "Father's arms are", replace: "arms of Yahweh" });

    let actual = sarf(string);
    let expect = "O come to the altar, the arms of Yahweh open wide.";

    t.is(actual, expect);
});

test('makes a search/replace function based on a generated regular expression', t => 
{
    let sarf = searchReplacer([ [ 'the ', 'g' ] ]);

    let actual = sarf(string);
    let expect = "O come to altar, Father's arms are open wide.";

    t.is(actual, expect);
});
