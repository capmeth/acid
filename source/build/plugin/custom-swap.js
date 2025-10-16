import path from 'node:path'
import paths from '#paths'


let baseRe = /^#custom\//;
let custom = path.join(paths.client, 'components', 'custom');

/*
    Swaps out default Svelte components for custom user defined ones.
*/
export default function ({ root, map })
{
    let cache = {};

    let plugin = {};

    plugin.name = 'custom-swap';

    plugin.resolveId = async function(id)
    {
        if (cache[id]) return cache[id];
    
        if (baseRe.test(id))
        {
            let cid = id.replace(baseRe, ''), file;
            let hasDefault = defaults.includes(cid);

            if (map[cid])
            {
                file = path.resolve(root, map[cid]);
                
                if (hasDefault)
                    log.test(`replacing {:emph:${cid}} component with {:emph:${file}}...`);
                else
                    log.test(`importing {:emph:${cid}} component from {:emph:${file}}...`);
            }
            else if (hasDefault)
            {
                file = path.join(custom, cid);
            }
            
            // additional resolution needed (extension)
            if (file) return cache[id] = this.resolve(file);

            log.error(`unable to resolve {:emph:${cid}} custom component import`);
        }
    }
  
    return plugin;
}

// list of default custom components
let defaults =
[
    'page/Home',         'main/Branch',
    'page/Section',      'main/Editor',
    'page/Document',     'main/Leaf',
    'page/Component',    'main/List',
    'page/Catalog',      'main/Markup',
    'page/Isolate',      'main/Node',
    'page/Error',        'main/Tag',
];
