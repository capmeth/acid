import path from 'node:path'
import paths from '#paths'


let baseRe = /^#custom\//;
let custom = path.join(paths.client, 'components', 'custom');

/*
    Swaps out default Svelte components for custom user defined ones.
*/
export default function ({ root, map })
{
    let plugin = {};

    plugin.name = 'custom-swap';

    plugin.resolveId = async function(id, importer)
    {
        if (baseRe.test(id))
        {
            let cid = id.replace(baseRe, '');
            let file = path.join(custom, cid);

            if (map[cid])
            {
                file = path.resolve(root, map[cid]);
                log.info(`replacing {:emph:${cid}} component with {:emph:${file}}...`);
            }
            
            // additional resolution needed (extension)
            return this.resolve(file, importer);
        }
    }
  
    return plugin;
}
