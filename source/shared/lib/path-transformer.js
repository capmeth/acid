import path from 'node:path'
import { inter, is, uid } from '#utils'


/**
    Returns a function that takes a filepath and transforms based on a 
    specification.

    if `spec` is a function, it is simply returned.

    if `spec` is a string, an interpolation function is returned where:
    - `[dir]`: is the original file path
    - `[name]`: is the original file name (w/o extension)
    - `[ext]`: is the original file extension

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
    
    if (is.string(spec)) 
    {        
        return str => 
        {
            let dir = path.dirname(str);
            let ext = path.extname(str);
            let name = path.basename(str, ext);
            let hex = uid.hex(str);

            return inter(spec, { dir, ext, name, hex });
        }
    }
    
    if (is.array(spec))
    {
        let [ search, replace ] = spec;

        if (is.array(search)) search = new RegExp(...[].concat(search));
        
        return str => str.replace(search, replace || '')
    }
}
