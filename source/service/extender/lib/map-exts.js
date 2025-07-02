
export default async function(specs, exts, kind)
{
    let map = {};

    let types = kind === 'parser' ? 'exts' : 'types';
    
    specs.forEach(data => 
    {
        let { [types]: list, ...rest } = data;
        list.forEach(type => map[type] = { ...rest });
    });

    await Promise.all(Object.keys(map).map(async type => 
    {   
        let [ name, param ] = map[type].use || [];

        let configured = name && typeof exts[name] === 'function' ? exts[name](param, type) : null;
        return Promise.resolve(configured).then(impl => map[type].use = impl);
        
        // if (map[type].use)
        //     log.info(`using ${kind} plugin {:whiteBright:${name}} for "${type}" code`);
        // else if (name)
        //     log.fail(`${kind} plugin ${name} is not properly implemented`);
    }));

    return map;
}
