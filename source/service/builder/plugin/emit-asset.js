
export default function({ name, fileName, source })
{
    let plugin = {};

    plugin.name = 'emit-asset';

    plugin.generateBundle = function()
    {
        this.emitFile({ name: name || 'ACID Asset', type: 'asset', fileName, source });
    }

    return plugin;
}
