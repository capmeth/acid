import merge from 'deepmerge'
import { is, jsToCss, proxet } from '#utils';
import sids from './scopes.js'
import loadCss from './load-css.js'


export default function(config)
{
    let { root, style } = config;
    let sheetsPromise = loadCss(style.sheets, root);

    let assign = (data, val) => style.merge && is.nonao(val) ? merge(data || {}, val) : val

    return async () =>
    {
        let data = { root: {} };
        let sheets = await sheetsPromise;    

        sheets.forEach(sheet => 
        {
            Object.entries(sheet).forEach(([ key, val ]) => 
            {
                let scopeId = sids.find(id => key.startsWith(id));

                if (scopeId)
                {
                    log.test(`adding scoped styles for ${key}...`);

                    data[scopeId] ??= {};
                    data[scopeId][key] = assign(data[scopeId][key], val);
                }
                else
                {
                    data.root[key] = assign(data.root[key], val);
                }
            });
        });

        return proxet({}, sid => data[sid] ? jsToCss(data[sid]) : null);
    }
}
