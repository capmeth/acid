import globit from '#lib/globit.js'


/**
    Restricts id resolution for the given plugin based on importer.

    Has no effect if the `use` plugin does not do id resolution.
*/
export default function({ paths, use })
{
    let plugin = { ...use };

    plugin.name = `${use.name}-by-importer`;

    plugin.resolveId = async function(id, importer)
    {
        if (!importer || paths.find(path => importer.startsWith(path)))
            return use.resolveId?.call(this, id, importer);
    }
  
    return plugin;
}
