import { cobe } from '#config'
import { importString, is, modulize } from '#utils'


// generate import strings
await Promise.all(Object.keys(cobe).map(async lang => 
{
    let { imports } = cobe[lang];
    imports = await Promise.all(Object.entries({ ...imports }).map(entry => importString(...entry)));
    cobe[lang].imports = imports.join('\n');
}));

export default async function(lang, source, el)
{
    let { imports, use } = cobe[lang];

    if (source && is.func(use?.render))
        return use.render({ source, partition, imports, modulize, el });
}    

let partRe = /(?:^|\n)\s*(?<tmp><.+)$/s;
/**
    Converts source to a string object and attaches `template` and `code`
    partitions (if possible).

    @param { string } source
      The code to partition.
    @param { object }
      The same `source` with properties for split parts.
*/
let partition = source =>
{
    let result = source.match(partRe);
    let template = result ? result.groups.tmp.trim() : '';
    let code = result ? source.replace(template, '').trim() : '';

    return { code, template };
}

