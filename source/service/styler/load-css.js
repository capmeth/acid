import fs from 'node:fs/promises'
import path from 'node:path'
import paths from '#paths'
import ctjs from '#source/shared/css-to-json-string.js'


let fileRe = /^#|file:\//;
let jsp = data => JSON.parse(ctjs(data))
/**
    Takes CSS content or loads CSS files and converts them to objects.

    In `files` array:
    - A string starting with `file:/` is a file relative to `root`.
    - A string starting with `#` is the name of a built-in stlesheet.
    - Otherwise assumed to be a stylesheet.

    @param { array } files
      List of CSS files or string content.
    @param { string } root
      Root path for relative paths in `files`.
    @return { array }
      CSS objects.
*/
export default async function (files, root)
{
    return Promise.all(files.map(file => 
    {
        let [ match ] = file.match(fileRe) || [];

        if (match)
        {
            file = file.replace(fileRe, '');
            file = match === '#' ? path.join(paths.themes, `${file}.css`) : path.resolve(root, file);

            return fs.readFile(file, { encoding: 'utf8' }).then(jsp);
        }
        // assumed to already be a CSS string
        return jsp(file);
    }));
}
