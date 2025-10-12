import { inter, is, sarf } from '#utils'


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
    if (is.func(spec)) return spec;
    if (is.string(spec)) return obj => inter(spec, obj)
    if (is.object(spec)) return (fn => obj => fn(obj.sub))(sarf(spec));
}
