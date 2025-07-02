
export default function(files)
{
    let plugin = {};

    plugin.name = 'virtual-file';

    plugin.resolveId = async function(id)
    {
        return id in files ? id : null;
    }

    plugin.load = function(id)
    {
        return id in files ? files[id] : null
    }
  
    return plugin;
}
