import path from 'node:path'
import rollup from '../build/rollup.js'
import rollPather from '../build/pather.config.js'
import rollImport from '../build/import.config.js'


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
    return async spec => 
    {
        // get file name for import
        let { default: file } = await rollup.gen(rollPather(root, spec));
        // import the data
        return rollup.gen(rollImport(path.dirname(file), file));
    }
}
