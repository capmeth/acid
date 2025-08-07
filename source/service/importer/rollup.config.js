import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import logHandler from '../builder/lib/log-handler.js'
import pluginVirtualFile from '../builder/plugin/virtual-file.js'


/**
    Rollup config for extracting a path from a module specifier.

    @param { string } source
      The source code to be bundled.
    @return { object }
      Rollup config.
*/
export default function (root, name)
{
    let build = {};
    let file = 'export.js';
    
    build.input = file;
    build.output = { format: 'esm' };

    build.plugins = 
    [ 
        pluginVirtualFile(
        { 
            [file]: `import mahjool from '${name}'; export default mahjool;`
        }),
        {
            name: 'capture-path',
            transform: (...args) => 
            {
                if (args[1] !== file) return `export default ${JSON.stringify(args[1])}`;
            }
        },
        pluginNodeResolve({ extensions: [ '.js' ], rootDir: root }),
        pluginCommonjs()
    ];

    // Logging
    build.logLevel = 'debug';
    build.onLog = logHandler;

    return build;
}
