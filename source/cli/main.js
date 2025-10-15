#!/usr/bin/env node
import { existsSync } from 'node:fs'
import path from 'node:path'
import service from '../service/index.js'
import commander from './commander.js'
import generateConfig from './generate-config.js'
import parseOptions from './parse-options.js'


let defaultFilename = './acid.config.js';

commander(
{
    run: data => 
    {
        let { config, logger, ...options } = parseOptions(data);

        if (logger) service.logger(logger);

        return service(config || defaultFilename, options).run();
    },

    makeConfig: data =>
    {
        let { config, ...options } = parseOptions(data);
        return generateConfig(config || defaultFilename, options);
    }
});
