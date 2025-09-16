import modulize from "#source/utils/modulize.js";


test('converts an ESM code string to a module', async t => 
{
    let string = 
    `
        export let hello = "world";
        export default new Date();
    `

    let { default: def, hello } = await modulize(string);

    t.is(hello, 'world');
    t.true(def instanceof Date);
});
