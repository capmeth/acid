import shash from '#source/utils/shash.js'


let obj =
{
    'The quick brown fox': 4220187886,
    'jumped over the lazy dog.': 4086267293,
    'snow fleece lamb': 3607480206
}

Object.keys(obj).forEach(key => 
{
    test(`should hash "${key}" to ${obj[key]}`, t => t.is(shash(key), obj[key])) 
});
