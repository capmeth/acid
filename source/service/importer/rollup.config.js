import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import logHandler from '../builder/lib/log-handler.js'
import pluginVirtualFile from '../builder/plugin/virtual-file.js'


/**
    Rollup config for bundling elements extensions defined in docsite config.

    @param { string } source
      The source code to be bundled.
    @return { object }
      Rollup config.
*/
export default function (root, name)
{
    let build = {};
    
    build.input = 'export.js';
    build.output = { format: 'esm' };

    build.plugins = 
    [ 
        pluginVirtualFile(
        { 
            'export.js': `import mahjool from '${name}'; export default mahjool;`
        }),
        pluginNodeResolve({ extensions: [ '.js' ], rootDir: root }),
        pluginCommonjs()
    ];

    // Logging
    build.logLevel = 'debug';
    build.onLog = logHandler;

    return build;
}
