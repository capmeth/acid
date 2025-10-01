import is from "./is.js";


/**
    Handles the importing of extension module specifiers.

    Each spec must have a `types` array which identifies what the record is
    being defined to support.  Each individual type will then be an entry in 
    the returned mapping object.

    Each spec must also have a `use` array with the module specifier in the
    first position.  The second element is an optional parameter that will be
    passed to the required default function export of the module along with 
    the type.  This config function will be called once for each of the types
    it is configured to support.  The return value will then be associated to
    the record for the given type as `use`.

    If `moreImport` is provided, it will be called for importing extension
    module specifiers rather than the standard ESM `import()` function. The
    exception being specifiers starting with "#exts/", which indicate a 
    built-in extension will be used.


    @param { array } specs
      Object definitions of extensions to process.
    @param { function } [moreImport]
      An importer with alternative module resolution (host project).
    @param { object }
      Map of supported types to specs.
*/
export default async function(specs, moreImport)
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
        return moreImport ? moreImport(name) : import(name);
    }

    await Promise.all(Object.keys(map).map(async type => 
    {   
        let [ name, param ] = map[type].use || [];

        return doImport(name)
            .then(mod => map[type].use = mod.default({ param, type }))
            .catch(() => delete map[type].use);
    }));

    return map;
}
