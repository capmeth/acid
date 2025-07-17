import { cobe } from '#config'
import { importString, is, modulize, rollup } from '#utils'
import rollConfig from './rollup.config.js'


export default async function ()
{
    // generate import strings
    await Promise.all(Object.keys(cobe).map(async lang => 
    {
        let { imports } = cobe[lang];
        imports = await Promise.all(Object.entries({ ...imports }).map(entry => importString(...entry)));
        cobe[lang].imports = imports.join('\n');
    }));

    return async function(lang, source, el)
    {
        let { imports, use } = cobe[lang];

        if (source && is.func(use?.render))
        {
            let build = async code => rollup.gen(rollConfig(code, lang, use.config))           
            return use.render({ source, partition, imports, build, modulize, el });
        }
    }    
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

