import objectToAttrs from "#source/utils/object-to-attrs.js";


test('converts an object into an HTML attribute string', t => 
{
    let source = 
    {
        type: 'button',
        disabled: true,
        value: 'Click Me!',
        readonly: false,
        dataCount: 37364,
        func: () => void 0,
    };

    let actual = objectToAttrs(source);
    let expect = ' type="button" disabled value="Click Me!" data-count=37364';

	t.is(actual, expect);
});
