import of from "#source/utils/of.js";


test('reports the proper datatypes', t => 
{
    let tests =
    {
        bigint: 3948593847n,
        number: 25,
        string: 'string',
        symbol: Symbol(),

        bool: true,
        func: function () {},
        undef: void 0,

        null: null,
        array: [],
        nonao: new String(),
        plain: {}
    }

    let expect = Object.keys(tests);
    let actual = Object.values(tests).map(of);

	t.deepEqual(actual, expect);
});
