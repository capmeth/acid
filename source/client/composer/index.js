import { rollup } from 'https://unpkg.com/@rollup/browser/dist/es/rollup.browser.js';
import { cobeSpecs } from '#config'
import { is } from '#utils'
import rollConfig from './rollup.config.js'


export default async function ()
{
    // importing the bundle (if it exists) ahead of CoBEs
    let hasBundle = await import('#bundle').then(() => true).catch(() => false)
    let imports = hasBundle ? `import * as bundle from '#bundle'` : 'let bundle;';

    return async function(lang, source, el)
    {
        let { use } = cobeSpecs[lang];

        if (source && is.func(use?.render))
        {
            let build = async code =>
            {
                let build = rollConfig(code, lang, use.config);
                
                return rollup(build).then(async bundle => 
                {
                    let { output: [ first ] } = await bundle.generate(build.output);                    
                    bundle.close();
                    return modulize(first.code);
                });
            }

            source = partition(source);
            return use.render({ source, imports, build, modulize, el });
        }
    }    
}

let modulize = async code => import(`data:text/javascript,${encodeURIComponent(code)}`)

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
    source = new String(source);

    let result = source.match(partRe);
    source.template = result ? result.groups.tmp : '';
    source.code = result ? source.replace(source.template, '').trim() : '';

    return source;
}

