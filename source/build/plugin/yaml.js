import fs from 'node:fs/promises'
import path from 'node:path'
import jsyaml from 'js-yaml'


export default function(params)
{
    let plugin = {};

    let { exts = [ '.yaml', '.yml' ] } = { ...params };

    plugin.name = 'yaml';

    plugin.load = async function(id)
    {
        let ext = path.extname(id);

        if (exts.includes(ext))
        {
            let data = await fs.readFile(id, 'utf8').then(jsyaml.load);            
            return `export default ${JSON.stringify(data)}`;
        }
    }
  
    return plugin;
}
