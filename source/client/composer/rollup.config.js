import pluginVirtualFile from '../../service/builder/plugin/virtual-file'


/**
    Accepts source content and makes a browser-friendly rollup config
    to "bundle" it.

    @param { string } source
      The source code to be built.
    @param { string } lang
      Language-type specifier for the code.
    @param { string } config
      Additional rollup options.
    @return { object }
      Rollup config.
*/
export default function (source, lang, config)
{
    let { external, plugins } = config || {};

    let build = {};

    build.input = `cobe-example.${lang}`;
    build.output = { format: 'esm' };
    build.external = external;
    build.plugins = 
    [ 
        pluginVirtualFile({ [build.input]: source }), 
        ...(plugins || []) 
    ];

    return build;
}
