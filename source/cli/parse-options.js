
/**
    Parse command-line options for config usage.
*/
export default function (options)
{
    let { logLevel, outputDir, outputName, server, ...rest } = options;

    if (Object.hasOwn(options, 'server'))
    {
        rest.server = { enabled: true };
        if (server !== true) rest.server.port = server;
    }

    let output = {};

    if (outputDir) output.dir = outputDir;
    if (outputName) output.name = outputName;

    if (Object.keys(output).length) rest.output = output;

    if (logLevel) rest.logger = logLevel;

    return rest;
}
