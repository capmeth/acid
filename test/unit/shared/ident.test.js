import ident from "#source/utils/ident.js";


test('returns the same value passed', t => {

    let expect = 736835;
    let actual = ident(expect);

	  t.is(actual, expect);
});
