import { rollup } from 'rollup'
import { modulize } from '#utils'


/**
    Executes a rollup build based on `config` and returns a module (for first 
    output only).

    @param { object } config
      Rollup configuration options (including output).
    @return { promise }
      Resolves to a module.
*/
let gen = async config =>
{
    let bundle = await rollup(config);
    let { output: [ first ] } = await bundle.generate(config.output);                    

    bundle.close();
    
    return modulize(first.code);
}

/**
    Executes a rollup build based on `config` and writes files to disk.

    @param { object } config
      Rollup configuration options (including output).
    @return { promise }
      Resolves to a module.
*/
let write = async config => 
{
    let bundle = await rollup(config);
    let output = await bundle.write(config.output);

    bundle.close();

    return output;
}

export default { gen, write };
