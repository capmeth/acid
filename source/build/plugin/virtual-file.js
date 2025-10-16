import path from 'node:path'


export default function(files)
{
    let plugin = {};

    plugin.name = 'virtual-file';

    plugin.resolveId = async function(id, importer)
    {
        // resolve configured importee
        if (id in files) return id;
        // resolve relative imports for configured importer
        if (importer in files && path.isAbsolute(importer) && id.charAt(0) === '.')
            return this.resolve(path.resolve(path.dirname(importer), id), importer);
    }

    plugin.load = function(id)
    {
        return id in files ? files[id] : null;
    }
  
    return plugin;
}
