import remowned from "#source/shared/remowned.js";


test('removes all owned properties from an object', t => 
{
    let object = { apple: 'green', onion: 'white', berry: 'blue', potato: 'brown' };
    
    remowned(object);
    
    t.true(Object.keys(object).length === 0);
});    

test('returns the target object', t => 
{
    let object = { apple: 'green', onion: 'white', berry: 'blue', potato: 'brown' };
    let result = remowned(object);
    
    t.true(object === result);
});    
