/**
    Dependent Project Build (Rollup)
    ---------------------------------------------------------------------------
    This build is for the project using ACID as a dependency.
*/
import pluginAlias from '@rollup/plugin-alias'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginImage from '@rollup/plugin-image'
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
import pluginCustomSwap from './plugin/custom-swap.js'
import pluginEmitAsset from './plugin/emit-asset.js'
import pluginScopedStyles from './plugin/scoped-styles.js'
import pluginByImporter from './plugin/by-importer.js'
import pluginVirtualFile from './plugin/virtual-file.js'


export default function(config, loaded, styles)
{
    let { copy, output, root } = config;
    let { sections, files, blocks } = loaded;
    let outpath = path.join(root, output.dir);

    let main = {};

    main.input = 
    { 
        [`${output.name}-docsite`]: path.join(paths.client, 'app.js'),
        [`${output.name}-examples`]: './examples.json',
        [`${output.name}-svelte-render`]: path.join(paths.extensions, 'svelte.js')
    };

    main.output =
    { 
        dir: outpath, 
        format: 'esm', 
        banner: banner(config.title) 
    };

    main.external = [ /^svelte/ ];

    main.plugins = 
    [
        pluginVirtualFile(
        { 
            'docsite-config': makeConfig(config, sections),
            './examples.json': JSON.stringify(blocks),
            './style/main.css': styles.root || '',
            ...files,
            '../markdown/index.js' : makeExports(Object.keys(files)),
        }),
        pluginAlias(
        {
            entries:
            {
                '#shared': path.join(paths.client, 'components', 'shared'),
            }
        }),
        pluginByImporter(
        {
            paths: [ paths.client ],
            use: pluginAlias(
            {
                entries:
                {
                    '#config': 'docsite-config',
                    '#frend': paths.client, // `#client` conflicts with svelte internals
                    '#utils': paths.utils
                }
            })
        }),
        pluginCustomSwap({ root, map: config.components }),
        pluginNodeResolve({ extensions: [ '.css', '.js', '.json', '.png', '.svelte', '.svt' ], browser: true }),
        pluginJson(),
        pluginCommonjs(),
        pluginImage(),
        pluginScopedStyles({ styles }),
        pluginSvelte({ extensions: [  '.svelte', '.svt' ], emitCss: true }), 
        pluginInject(
        {
            include: path.join('**', '*.{svelte,svt}'),
            ctx: path.join(paths.client, 'lib', 'context.js'),
            t: path.join(paths.client, 'lib', 't.js')
        }),
        pluginPostcss({ minimize: true }),
        pluginEmitAsset({ fileName: `${output.name}.html`, source: makeHtml(config) }),
        pluginCopyStuff({ specs: copy, rootpath: root, outpath }),
        pluginAnalyzer({ onAnalysis: logStats, skipFormatted: true })
    ];

    main.watch = { buildDelay: 50 };

    main.logLevel = 'debug';
    main.onLog = logHandler;

    return [ main ];
}
