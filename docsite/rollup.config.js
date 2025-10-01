import pluginAlias from '@rollup/plugin-alias'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import paths from '#paths'
import pluginYaml from '../source/service/builder/plugin/yaml.js'


export default 
{ 
    input: { 'site-bundle': './docsite/entry.js' },

    output: 
    { 
        dir: 'web', 
        format: 'esm', 
    },
    
    plugins:
    [
        pluginAlias(
        {
            entries:
            {
                '#config': paths.config
            }
        }),
        pluginNodeResolve({ extensions: [ '.js', '.yaml' ], browser: true }),
        pluginYaml()
    ]
}
