import jsyaml from 'js-yaml'
import fs from 'node:fs/promises'


let jsonRe = /\.json$/;
let yamlRe = /\.ya?ml$/;

/**
    Parses a file as JSON, YAML, or just plain JS.

    @param { any }
      Parsed file contents.
    @return { Promise }
      Resolves to the default export of the file provided.
*/
export default async function (file)
{
    // json
    if (jsonRe.test(file))
        return import(file, { with: { type: 'json' } }).then(mod => mod.default);
    
    // yaml
    else if (yamlRe.test(file))
        return fs.readFile(file, 'utf8').then(data => jsyaml.load(data));
    
    // assume js
    return import(file).then(mod => mod.default);
}
