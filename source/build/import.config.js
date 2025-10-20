/**
    Import Build (Rollup)
    ---------------------------------------------------------------------------
    A build for intended for multiple re-imports of the same file.
*/
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginJson from '@rollup/plugin-json'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import pluginReplace from '@rollup/plugin-replace'
import logHandler from './lib/log-handler.js'
import pluginYaml from './plugin/yaml.js'


export default function (root, file)
{
    let build = {};

    build.input = file;
    build.output = { format: 'esm' };

    build.plugins = 
    [
        pluginReplace({ __plugin_dirname: root, preventAssignment: true }),
        pluginNodeResolve(
        { 
            extensions: [ '.js', '.json', '.yaml', '.yml' ], 
            rootDir: root
        }),
        pluginCommonjs(),
        pluginJson(),
        pluginYaml(),
    ];

    build.logLevel = 'debug';
    build.onLog = logHandler;

    return build;
}
