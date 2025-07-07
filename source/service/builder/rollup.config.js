/**
    Dependent Project Build (Rollup)
    ---------------------------------------------------------------------------
    This build is for the project using ACID as a dependency.
*/
import pluginAlias from '@rollup/plugin-alias'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginInject from '@rollup/plugin-inject'
import pluginJson from '@rollup/plugin-json'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import pluginAnalyzer from 'rollup-plugin-analyzer'
import pluginPostcss from 'rollup-plugin-postcss'
import pluginSvelte from 'rollup-plugin-svelte'
import path from 'node:path'
import paths from '#paths'
import banner from './lib/banner.js'
import logHandler from './lib/log-handler.js'
import logStats from './lib/log-stats.js'
import makeConfig from './lib/make-config.js'
import makeExports from './lib/make-exports.js'
import makeHtml from './lib/make-html.js'
import pluginCopyStuff from './plugin/copy-stuff.js'
import pluginEmitAsset from './plugin/emit-asset.js'
import pluginScopedStyles from './plugin/scoped-styles.js'
import pluginVirtualFile from './plugin/virtual-file.js'
import virtualFiles from './lib/virtual-files.js'


export default function(config, loaded, styles)
{
    let { copy, output, root } = config;
    let { sections, files, blocks } = loaded;

    let outpath = path.join(root, output.dir);
    let acid = {};

    // Input/Output
    acid.input = 
    { 
        [`${output.name}-docsite`]: path.join(paths.client, 'app.js'),
        [`${output.name}-examples`]: './examples.json',
        // TODO: make this input a separate build
        'acid-bundle': path.join(paths.client, 'index.js')
    };

    acid.output =
    {
        dir: outpath,
        format: 'esm',
        banner: banner(config.title)
    };

    // External
    acid.external = [ /^https:\/\//, '#bundle' ];

    // Plugins
    acid.plugins = 
    [
        pluginVirtualFile(
        { 
            'docsite-config': makeConfig(config, sections),
            './examples.json': JSON.stringify(blocks),
            './style/main.css': styles.root || '',
            ...files,
            '../markdown/index.js' : makeExports(Object.keys(files)),
            ...virtualFiles
        }),
        pluginAlias(
        {
            entries:
            {
                '#comps': path.join(paths.client, 'components'),
                '#config': 'docsite-config',
                '#frend': paths.client, // `#client` conflicts with svelte internals
                '#temp': paths.temp,
                '#utils': paths.shared,

                // Something is a bit off when compiling svelte components from
                // a string as the compiler seems to look for "svelte/internal" 
                // in the wrong place. This causes rollup to assume it is an 
                // external dependency.  Here, we re-map it correctly to avoid 
                // warnings and runtime errors
                // 'svelte/internal': path.join(paths.root, 'node_modules', 'svelte', 'src', 'internal')
            }
        }),
        pluginNodeResolve({ extensions: [ '.css', '.js', '.json', '.svt' ], browser: true }),
        pluginJson(),
        pluginCommonjs(),
        pluginScopedStyles({ styles }),
        pluginSvelte({ extensions: [ '.svt' ], emitCss: true }), 
        pluginInject(
        {
            include: path.join(paths.client, 'components', '**', '*.svt'),
            ctx: path.join(paths.client, 'lib', 'context.js')
        }),
        pluginPostcss({ minimize: true }),
        pluginEmitAsset({ fileName: `${output.name}.html`, source: makeHtml(config) }),
        pluginCopyStuff({ specs: copy, rootpath: root, outpath }),
        pluginAnalyzer({ onAnalysis: logStats, skipFormatted: true })
    ];

    // Watch Options
    acid.watch = { buildDelay: 50 };

    // Logging
    acid.logLevel = 'debug';
    acid.onLog = logHandler;

    return acid;
}
