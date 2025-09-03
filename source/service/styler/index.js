import { is, jsToCss, proxet } from '#utils'
import loadCss from './load-css.js'


let commaRe = /\s*,\s*/;
let scopeRe = /^#[\w-]+$/;

export default function(config)
{
    let { root, style } = config;

    let sheetsPromise = loadCss(style, root).then(list => list.reduce((a, x) => [ ...a, ...x ]), []);
    
    /**
        Merge key/value arrays into objects
    */
    let artoo = (target, value) =>
    {
        if (!is.nonao(target)) target = {};
        
        value.forEach(([ key, val ]) => 
        {
            // merge values under same selector (`null` key targets current)
            if (is.array(val)) val = artoo(key ? target[key] : target, val);            
            // CSS directives do not merge
            if (key) target[key] = key.startsWith('@') ? [ ...(target[key] || []), val ] : val;
        });
        
        return target;
    }

    return async () =>
    {
        let data = {};
        let pairs = await sheetsPromise;    

        pairs.forEach(pair => 
        {
            let [ sels, value ] = pair;

            sels.split(commaRe).forEach(key => 
            {
                let [ sid ] = key.match(scopeRe) || [];

                let scope = sid || 'root', sel = sid ? null : key;

                if (sid?.startsWith('#-'))
                {
                    let id = sid.slice(2);
                    // dash-prefixed injectables are part of non-dashed scope
                    scope = `#${id}`; sel = `.${id}`;
                }
                
                log.test(() => 
                {
                    if (scope === 'root')
                        return `merging {:white:${key}} styles into {:white:global} scope...`;
                    else
                        return `merging styles into {:white:${scope}} scope...`;
                });

                data[scope] = artoo(data[scope], [ [ sel, value ] ]);
            });
        });

        return proxet({}, sid => data[sid] ? jsToCss(data[sid], sid === 'root') : null);
    }
}
