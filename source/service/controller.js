import fs from 'node:fs'
import path from 'node:path'

import builder from './builder/index.js'
import loader from './loader/index.js'
import server from './server/index.js'
import socketer from './socketer.js'
import styler from './styler/index.js'
import watcher from './watcher.js'

import { is } from '#utils'
import { required } from '../config/index.js'


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
    @return { object }
      Services object.
*/
export default function(config, file)
{
    let isFile = is.string(file) && fs.existsSync(file);
    let omits = isFile ? [ file ] : [];

    required(config);

    let run = async bool =>
    {
        if (bool) config.httpServer = true, config.watch = true;

        let svc = createServices(config, omits);

        let exec = async () => 
        {
            await Promise.all([ svc.bundle(), svc.watch.start(svc.update) ]).then(svc.serve.start);
        }

        let stop = async () => 
        {
            await Promise.all([ svc.serve.stop(), svc.watch.close(), svc.socket.close() ]);
        }
    
        return exec().then(svc.notify).then(() => stop);
    }

    return { run };
}

function createServices(config, watchOmits)
{
    let service = {};

    watchOmits.push(path.join(config.output.dir, '**'));

    service.build = builder(config);
    service.load = loader(config);
    service.serve = server(config);
    service.socket = socketer(config);    
    service.style = styler(config);
    service.watch = watcher(config, watchOmits);

    // derived services
    service.notify = () => service.socket.send('reload')
    service.prepare = () => Promise.all([ service.load(), service.style() ])
    service.bundle = () => service.prepare().then(items => service.build(...items))
    service.update = () => service.bundle().then(service.notify)

    // post initialization ops
    service.serve.onError(err => log.fail(err));

    return service;
}
