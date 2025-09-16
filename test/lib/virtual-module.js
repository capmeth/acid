import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import paths from '#paths'
import rollup from '#source/lib/rollup.js'


/**
    Bundles string ES `code` into an ES module.

    Module specifiers used in `code` are based on `rootDir`.

    @param { string } code
      Script to transform into module.
    @param { string } rootDir
      Absolute path for the root directory.
*/
export default async function (code, rootDir)
{
    rootDir ||= paths.root;

    let file = 'virtile.js';

    return rollup.gen(
    {
        input: file,
        output: { format: 'esm' },
        plugins:
        [
            {
                resolveId: id => id === file ? id : null,
                load: id => id === file ? code : null
            },
            pluginNodeResolve({ extensions: [ '.js' ], rootDir }),
            pluginCommonjs()
        ],
        onLog: (lvl, data, exec) => data.code !== 'EMPTY_BUNDLE' && exec(lvl, data)
    });
}
