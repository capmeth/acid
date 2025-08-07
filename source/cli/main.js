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

        let file = path.resolve(process.cwd(), config);

        if (!existsSync(file))
        {
            console.error(`File ${file} does not exist`);
            return void 0;
        }

        if (logger) service.logger(logger);

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
        let file = path.resolve(process.cwd(), config);

        return generateConfig(file, options);
    }
});
