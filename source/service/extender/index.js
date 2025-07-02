import extImports from './lib/ext-imports.js'


export default function (config)
{
    let { cobe } = config;

    let genImports = extImports(config);

    let exts = 
    [
        { name: 'parser', specs: config.parsers },
        { name: 'renderer', specs: [ { types: ['*'], ...cobe }, ...config.cobeSpecs ] }
    ];

    return async () => Promise.all(exts.map(genImports));
}
