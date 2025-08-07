import is from "./is.js";


export default async function(specs, importExt)
{
    let map = {};
    
    specs.forEach(data => 
    {
        let { types, ...rest } = data;
        types.forEach(type => map[type] = { ...map[type], ...rest });
    });

    let doImport = async name =>
    {
        if (is.func(name)) return { default: name };
        if (name.startsWith('#exts/')) return import(name);
        return importExt ? importExt(name) : import(name);
    }

    await Promise.all(Object.keys(map).map(async type => 
    {   
        let [ name, param ] = map[type].use || [];

        return doImport(name)
            .then(mod => map[type].use = mod.default(param, type))
            .catch(() => map[type].use = null);
    }));

    return map;
}
