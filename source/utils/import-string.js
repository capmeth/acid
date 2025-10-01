import is from './is.js'


/**
    Creates an import statement from the exports of a module.

    Results in a side-effect import string when `declares` is empty or omitted.

    @param { string } spec
      Module specifier for the target module.
    @param { object } [declares]
      - `default`: for default or namespace export
      - `named`: ffor named exports
    @return { string }
      Statement that imports exports from `spec`.
*/
export default async function (spec, declares)
{
    let { default: cdef, names: filter } = declares || {};

    return import(spec).then(mod => 
    {
        let named = filter;
        let names = Object.keys(mod).filter(n => n !== 'default');

        if (filter === '*')
            named = names;
        else if (filter instanceof RegExp)
            named = names.filter(n => filter.test(n));
        else if (is.func(filter))
            named = names.map(filter).filter(n => n);

        if (is.array(named)) named = named.join(', ');

        let imports = [];

        if (cdef) imports.push(cdef);
        if (named) imports.push(`{ ${named} }`);

        imports = imports.length ? imports.join(', ') + ' from ' : '';

        return `import ${imports}${JSON.stringify(spec)}`;
    });
}
