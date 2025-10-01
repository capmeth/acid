import attrsToObject from "#source/utils/attrs-to-object.js";


test('converts an HTML attribute string into an object', t => 
{
    let source = 'type="button" disabled value="Click Me!" data-count=37364'

    let actual = attrsToObject(source);
    let expect = 
    {
        type: 'button',
        disabled: true,
        value: 'Click Me!',
        dataCount: 37364
    }

	t.deepEqual(actual, expect);
});
