// import merge from 'deepmerge'
import { is, jsToCss, proxet } from '#utils';
import sids from './scopes.js'
import loadCss from './load-css.js'


export default function(config)
{
    let { root, style } = config;

    let sheetsPromise = loadCss(style, root)
        .then(list => list.reduce((a, x) => [ ...a, ...x ]), []);
        // TODO: might need to sort here (for at-rules)
    
    /**
        Merge key/value arrays into objects
    */
    let artoo = (target, value) =>
    {
        if (!is.nonao(target)) target = {};
        value.forEach(([ key, val ]) => target[key] = is.array(val) ? artoo(target[key], val) : val);
        return target;
    }

    return async () =>
    {
        let data = {};
        let pairs = await sheetsPromise;    

        pairs.forEach(pair => 
        {
            let [ key ] = pair;
            let scope = sids.find(id => key.startsWith(id)) || 'root';
            
            log.test(`adding ${scope} scope styles: "${key}" ...`);
            data[scope] = artoo(data[scope], [ pair ]);
        });

        return proxet({}, sid => data[sid] ? jsToCss(data[sid]) : null);
    }
}
