
/**
    Parse command-line options for config usage.
*/
export default function (options)
{
    let { httpServer, logLevel, outputDir, outputName, ...rest } = options;

    if (Object.hasOwn(options, 'httpServer'))
    {
        rest.httpServer = true;
        if (httpServer !== true) rest.httpServerPort = httpServer;
    }

    let output = {};

    if (outputDir) output.dir = outputDir;
    if (outputName) output.name = outputName;

    if (Object.keys(output).length) rest.output = output;

    if (logLevel) rest.logger = logLevel;

    return rest;
}
