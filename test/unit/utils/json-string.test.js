import jsonString from "#source/utils/json-string.js";


test('can convert regular expressions to array of source and flags', t => 
{
    let data = { name: "test", regex: /jsx?|ya?ml|html?/gi };

    let actual = jsonString(data, [ 're' ]);
    let expect = '{"name":"test","regex":["jsx?|ya?ml|html?","gi"]}';

    t.is(actual, expect);
});
