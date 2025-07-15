
export default async function(specs, doImport)
{
    let map = {};
    
    specs.forEach(data => 
    {
        let { types, ...rest } = data;
        types.forEach(type => map[type] = { ...map[type], ...rest });
    });

    await Promise.all(Object.keys(map).map(async type => 
    {   
        let [ name, param ] = map[type].use || [];

        return (!doImport || name.startsWith('#exts/') ? import(name) : doImport(name))
            .then(mod => map[type].use = mod.default(param, type))
            .catch(() => map[type].use = null);
    }));

    return map;
}
