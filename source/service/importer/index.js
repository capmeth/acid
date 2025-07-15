import { rollup } from '#utils'
import rollConfig from './rollup.config.js'


/**
    Creates a dynamic importer resolved from `root` path.

    This uses rollup to create a module.  As such, it is limited to basic esm
    and commonjs resolution (js only).

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
            log.test(`importing extension ${spec}...`);
            mahjools[spec] = await rollup.gen(rollConfig(root, spec));
        }
        return mahjools[spec];
    }
}
