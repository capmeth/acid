import pluginNodeResolve from '@rollup/plugin-node-resolve'
import pluginVirtualFile from '#source/service/builder/plugin/virtual-file.js'
import scopes from '#source/service/styler/scopes.js'


export default 
{ 
    input: { 'site-bundle': './index.js' },

    output: 
    { 
        dir: 'web', 
        format: 'esm', 
    },
    
    plugins:
    [
        pluginVirtualFile(
        {
            './index.js': 
            `
                export let scopes = ${JSON.stringify(scopes)};
            `
        }),
        pluginNodeResolve({ extensions: [ '.js' ], browser: true }),
    ]
}
