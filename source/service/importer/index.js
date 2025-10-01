import rollup from '#lib/rollup.js'
import rollConfig from './rollup.config.js'


/**
    Creates a dynamic importer resolved from `root` path.

    The returned function uses rollup to create a module that exports an 
    absolute path derived from the given module specifier.  That path is
    then used for a dynamic import.

    @param { string } root
      Path from which to resolve imports.
    @return { function }
      Custom importer.
*/
export default function (root)
{
    let mahjools = {};

    return async spec => 
    {
        if (!mahjools[spec])
        {
            log.test(`importing extension {:emph:${spec}}...`);
            mahjools[spec] = await rollup.gen(rollConfig(root, spec)).then(mod => import(mod.default));
        }
        return mahjools[spec];
    }
}
