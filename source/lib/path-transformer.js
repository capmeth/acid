import path from 'node:path'
import { inter, is, proxet, uid } from '#utils'


/**
    Returns a function that takes a filepath and transforms based on a 
    specification.

    if `spec` is a function it will be wrapped in a function that will pass it
    the filepath and the `path.parse()` function.

    if `spec` is a string, an interpolation function is returned where any 
    property of the object returned by `path.parse()` can be used by enclosing
    the name in braces.  Additionally `{hex}` is available as the hexadecimal
    value of the hash of the original path.

    if `spec` is an array, a function is returned that uses it as parameters 
    in a call to String.prototype.replace against the original path.  If the 
    first element of `spec` is an array it will first be used to create a
    RegExp instance.

    @param { function | string | array } spec
      Transformation specification.
    @return { function }
      Filepath transformer or `undefined` if `spec` is invalid.
*/
export default function (spec)
{
    if (is.func(spec)) return str => spec(chop(str))
    
    if (is.string(spec)) return str => inter(spec, chop(str));
    
    if (is.array(spec))
    {
        let [ search, replace ] = spec;

        if (is.array(search)) search = new RegExp(...[].concat(search));
        
        return str => str.replace(search, replace || '')
    }
}

let chop = str => proxet(path.parse(str), key =>
{
    if (key === 'hex') return uid.hex(str);
    if (key === 'path') return str;
    if (key === 'segs') return str.split(path.sep);
})
