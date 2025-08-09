#!/usr/bin/env node
import { existsSync } from 'node:fs'
import path from 'node:path'
import service from '../service/index.js'
import commander from './commander.js'
import generateConfig from './generate-config.js'
import parseOptions from './parse-options.js'


commander(
{
    run: data => 
    {
        let { config, use, logger, ...options } = parseOptions(data);

        if (logger) service.logger(logger);

        let fname = config || 'acid.config.js';
        let file = path.resolve(process.cwd(), fname);
        // if specified file does not exist it is an error
        if (config && !existsSync(file))
        {
            console.error(`File ${file} does not exist`);
            return void 0;
        }

        let applyExts = app => Promise.all((use || []).map(ext => 
        {
            let [ spec, param ] = ext.split('::');
            return app.use(spec, JSON.parse(param || null));
        }));

        return service(file, options).then(app => applyExts(app).then(() => app.run()));
    },

    makeConfig: data =>
    {
        let { config, ...options } = parseOptions(data);
        let file = path.resolve(process.cwd(), config || 'acid.config.js');

        return generateConfig(file, options);
    }
});
