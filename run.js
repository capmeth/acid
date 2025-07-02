#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import path from 'path'
import { is } from '#utils'
import packson from './package.json' with { type: 'json' }
import { generateConfig, startService, verifyConfig } from './source/cli/main.js'


let integerOnly = value =>
{
    let parsed = parseInt(value);

    if (Number.isNaN(parsed))
        throw new InvalidArgumentError('must be a number.');

    return parsed;
}

new Command()
    .name('acid')
    .description('Generates ACID docsite.')
    .option('-c, --config [path]', 'path to configuration file', 'acid.config.js')
    .option('-o, --output-dir <dir>', 'folder to put generated docsite (default: "docs")')
    .option('-m, --make-config', 'generate a starter config; use --config to specify target file')
    .option('-r, --verify', 'check config file for errors; use --config to specify file location')
    .option('-s, --http-server [port]', 'enables docsite server on specified port', integerOnly)
    .option('-t, --title <str>', 'title for the docsite')
    .option('-w, --watch', 'watch files for changes to trigger rebuild')
    .version(`${packson.title} v${packson.version}`, '-v, --version', 'show current version info')
    .action(({ config, makeConfig, verify, ...options }) => 
    {
        let filename = path.resolve(process.cwd(), config);

        // option value adjustments
        if (options.watch) 
            options.watch = { enabled: true };
        if (is.number(options.httpServer)) 
            options = { ...options, httpServer: true, httpServerPort: options.httpServer };
        
        if (makeConfig) 
            return generateConfig(filename, options);

        if (verify) 
            return verifyConfig(filename);

        return startService(filename, options);
    })
    .parse();
