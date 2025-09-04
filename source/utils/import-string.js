import is from './is.js'


/**
    Creates an import statement from the exports of a module.

    @param { string } spec
      Specifier for target module.
    @param { object } declares
      - `default`: name of the default export
      - `named`: filters for named exports
    @return { string }
      Expression that imports exports from `spec`.
*/
export default async function (spec, declares)
{
    let { default: defawlt, names: filter } = declares;
    let promise = import(spec).then(mod => Object.keys(mod));

    return promise.then(names => 
    {
        let named = filter;

        if (filter === '*')
            named = names;
        else if (filter instanceof RegExp)
            named = names.filter(n => filter.test(n));
        else if (is.func(filter))
            named.map(filter).filter(n => !!n);

        if (is.array(named)) named = named.join(', ');

        let imports = [];
        if (defawlt) imports.push(defawlt);
        if (named) imports.push(`{ ${named} }`);
        imports = imports.join(', ');
        if (imports) imports += ' from ';

        return named ? `import ${imports}${JSON.stringify(spec)}` : '';
    });
}
