import { cobeSpecs } from '#config'
import { is, modulize, rollup } from '#utils'
import rollConfig from './rollup.config.js'


export default async function ()
{
    return async function(lang, source, el)
    {
        let { use } = cobeSpecs[lang];

        if (source && is.func(use?.render))
        {
            let build = async code => rollup.gen(rollConfig(code, lang, use.config))           
            return use.render({ source, partition, build, modulize, el });
        }
    }    
}

let partRe = /^\s*(?<tmp><.+>)|(?<tmp><.+>)\s*$/s;
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
    let template = result ? result.groups.tmp : '';
    let code = result ? source.replace(template, '').trim() : '';

    return { code, template };
}

