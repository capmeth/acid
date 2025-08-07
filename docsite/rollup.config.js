import pluginNodeResolve from '@rollup/plugin-node-resolve'
import pluginVirtualFile from '#source/service/builder/plugin/virtual-file.js'
import pluginYaml from '#source/service/builder/plugin/yaml.js'
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
                export { default as labels } from '#source/config/labels.yaml'
            `
        }),
        pluginNodeResolve({ extensions: [ '.js', '.yaml' ], browser: true }),
        pluginYaml()
    ]
}
