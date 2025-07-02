import pluginAlias from '@rollup/plugin-alias'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginJson from '@rollup/plugin-json'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import path from 'node:path'
import paths from '#paths'
import logHandler from '../builder/lib/log-handler.js'
import pluginVirtualFile from '../builder/plugin/virtual-file.js'
import makeConfig from './lib/make-config.js'


/**
    Rollup config to bundling extensions defined in docsite config.

    @param { string } source
      The source code to be bundled.
    @return { object }
      Rollup config.
*/
export default function (config, spec)
{
    let build = {};

    build.input = spec.file;

    build.output = 
    { 
        format: 'esm', 
        dir: paths.temp
    };

    build.external = [ /^https:\/\// ],

    build.plugins = 
    [ 
        pluginVirtualFile(
        { 
            [spec.file]: spec.code,
            './config': makeConfig(config)
        }),
        pluginAlias(
        {
            entries:
            {
                '#config': './config',
                '#extend': path.join(paths.service, 'extender'),
                '#importer': spec.importFile
            }
        }),
        pluginNodeResolve({ extensions: [ '.js' ], browser: true }),
        pluginJson(),
        pluginCommonjs()
    ];

    // Logging
    build.logLevel = 'debug';
    build.onLog = logHandler;

    return build;
}
