import { existsSync } from 'node:fs'
import path from 'node:path'
import { proxet, uid } from '#utils'


let lane = root => str => 
{
    let abs = path.resolve(root, str);
    if (existsSync(abs)) return lane.info(abs, root);
}

/**
    Parses information for a given filepath (`str`).

    Returned object will include all data from `path.parse()` plus
    - `hex`: hexadecimal value of the hash of normalized `str`
    - `path`: the normalized `str`
    - `segs`: array of path segments of normalized `str`

    @param { string } str
      Path to parse.
    @return { object }
      Path info.
*/
lane.info = (str, root) =>
{
    str = path.normalize(str);
    root ||= ''

    return proxet(path.parse(str), key =>
    {
        if (key === 'hex') return uid.hex(str);
        if (key === 'path') return str;
        if (key === 'sep') return path.sep;
        if (key === 'sub') return path.relative(root, str);
    });
}

export default lane;
