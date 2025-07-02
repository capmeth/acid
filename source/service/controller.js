import fs from 'node:fs'
import path from 'node:path'

import builder from './builder/index.js'
import extender from './extender/index.js'
import loader from './loader/index.js'
import logger from './logger.js'
import server from './server/index.js'
import socketer from './socketer.js'
import styler from './styler/index.js'
import watcher from './watcher.js'

import { is } from '#utils'


/**
    Backend application entry point.

    Configuration `options` can be passed as
    - a configuration object
    - or a pathname to a configuration file.

    When `options` is a path, the file will be watched in order to reinitiate 
    the whole system when the file is changed.

    Note that most things happening in this file are sensitive to _where_ they
    are happening.  Refactor with care as getting things out of order will 
    cause issues.

    @param { object } config
      Configuration options.
    @param { string } file
      Configuration filename (for watch exclusion).
    @param { function } callback
      Called when the config file changes.
    @return { object }
      Services object.
*/
export default function(config, file, callback)
{
    let isFile = is.string(file) && fs.existsSync(file);

    callback ??= () => void 0

    global.log = logger(config);

    /*
        Initializes the backend application and returns a promise that resolves
        to functions that start and stop the app.
    */
    let controller = () =>
    {
        let cwatch = null;

        let { bundle, extend, notify, serve, socket, update, watch } = createServices();

        let start = async () =>
        {
            if (config.watch.enabled && isFile)
            {
                log.info(`watching config file ({:whiteBright:${file}}) for changes...`);
                cwatch = fs.watch(file, callback);
            }

            return extend()
                .then(() => Promise.all([ bundle(), watch.start(update) ]).then(serve.start).then(notify));
        }

        let stop = async () => Promise.all([ serve.stop(), cwatch?.close(), watch.close(), socket.close() ])
        
        let isActive = () => serve.serving() || watch.watching()

        return { isActive, start, stop };
    }

    let createServices = () =>
    {
        let service = {};

        service.build = builder(config);
        service.extend = extender(config);
        service.load = loader(config);
        service.serve = server(config);
        service.socket = socketer(config);    
        service.style = styler(config);
        service.watch = watcher(config,
        [ 
            // omit config file (its looked after separately)
            ...(isFile ? [ file ] : []),
            // always omit `outputDir`, of course
            path.join(config.outputDir, '**'),
        ]);

        // derived services
        service.notify = () => service.socket.send('reload')
        service.prepare = () => Promise.all([ service.load(), service.style() ])
        service.bundle = () => service.prepare().then(items => service.build(...items))
        service.update = () => service.bundle().then(service.notify)

        // post initialization ops
        service.serve.onError(err => log.fail(err));

        return service;
    }

    return controller();
}
