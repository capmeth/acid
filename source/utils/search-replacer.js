import is from './is.js'


/*
    Raturns a string replacement function based on `spec`.

    Return value takes the form `string => string.replaceAll(search, replace)`,
    where `search` and `replace` are derived from `spec`.

    if `spec` is
    - an array, then `[ search, replace ] = spec`
    - an object, then `{ search, replace } = spec`
    - otherwise, `search = spec, replace = ''`

    `search` is converted to a RegExp instance if it is an array.

    @param { array | object } spec
      Resolved to replacement parameters.
    @param { function }
      Invokes `String.prototype.replaceAll` on a string paraneter.
*/
export default function (spec)
{
    let search = spec, replace;

    if (is.array(spec)) 
        ([ search, replace ] = spec);
    else if (is.plain(spec))
        ({ search, replace } = spec);

    if (is.array(search)) 
        search = new RegExp(...search);
    
    return str => str.replace(search, replace ?? '')
}
