
/**
    Parse command-line options for config usage.
*/
export default function (options)
{
    let { logLevel, outputDir, outputName, server, use, ...rest } = options;

    if (rest.config === true) rest.config = 'acid.config.js';

    if (Object.hasOwn(options, 'server'))
    {
        rest.server = { enabled: true };
        if (server !== true) rest.server.port = server;
    }

    let output = {};

    if (outputDir) output.dir = outputDir;
    if (outputName) output.name = outputName;

    if (Object.keys(output).length) rest.output = output;

    if (use)
    {
        rest.configs = use.map(item => 
        {
            let [ spec, param ] = item.split('::');
            return param ? [ spec, JSON.parse(param || null) ] : spec;
        });
    }

    if (logLevel) rest.logger = logLevel;

    return rest;
}
