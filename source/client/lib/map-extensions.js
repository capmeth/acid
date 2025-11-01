
/**
    Handles the importing of extension module specifiers in the browser.

    Each spec must have a `types` array which identifies what the record is
    being defined to support.  Each individual type will then be an entry in 
    the returned mapping object.

    Each spec must also have a `use` array with the module specifier in the
    first position.  The second element is an optional parameter that will be
    passed to the required default function export of the module along with 
    the type.  This config function will be called once for each of the types
    it is configured to support.  The return value will then be associated to
    the record for the given type as `use`.


    @param { array } specs
      Object definitions of extensions to process.
    @param { object }
      Map of supported types to specs.
*/
export default async function(specs)
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

        delete map[type].use;

        return name && import(name)
            .then(mod => map[type].use = mod.default({ param, type }))
            .catch(console.error);
    }));

    return map;
}
