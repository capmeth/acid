#!/usr/bin/env node
import { Command, InvalidArgumentError, Option } from 'commander';
import packson from '#packson' with { type: 'json' }


export default function (action)
{
    let cmd = new Command();

    let optionConfig = new Option('-c, --config [path]', 'path to configuration file')
        .default('acid.config.js');
    let optionOutputDir = new Option('-d, --output-dir <dir>', 'folder to put generated docsite');
    let optionExtensions = new Option('-u, --use <ext>', 'extension module specifier and parameters')
        .argParser(collect());
    let optionLogLevel = new Option('-l, --log-level <lvl>', 'logger severity level');
    let optionOutputName = new Option('-n, --output-name <dir>', 'name/prefix for generated files');
    let optionHttpServer = new Option('-s, --http-server [port]', 'enables docsite server on specified port')
        .argParser(integerOnly);
    let optionTitle = new Option('-t, --title <str>', 'title for the docsite');
    let optionWatch = new Option('-w, --watch', 'watch files for changes to trigger rebuild');

    let optionTocDepth = new Option('--toc-depth <num>', 'table-of-contents header depth level')
        .argParser(integerOnly);

    // cmd.name('acid');

    cmd.command('run', { isDefault: true })
        .description('Generate ACID docsite.')
        .addOption(optionConfig)
        .addOption(optionOutputDir)
        .addOption(optionExtensions)
        .addOption(optionLogLevel)
        .addOption(optionOutputName)
        .addOption(optionHttpServer)
        .addOption(optionTitle)
        .addOption(optionWatch)
        .addOption(optionTocDepth)
        .action(action.run);


    cmd.command('make-config')
        .description('Generate an ACID config file.')
        .addOption(optionConfig)
        .addOption(optionOutputDir)
        .addOption(optionOutputName)
        .addOption(optionHttpServer)
        .addOption(optionTitle)
        .addOption(optionWatch)
        .addOption(optionTocDepth)
        .action(action.makeConfig);

    cmd.version(`${packson.title} v${packson.version}`, '-v, --version', 'show current version info');
    
    cmd.parse(process.argv);
}

let integerOnly = value =>
{
    let parsed = parseInt(value);

    if (Number.isNaN(parsed))
        throw new InvalidArgumentError('must be a number.');

    return parsed;
}

let collect = (array = []) => value => (array.push(value), array)
