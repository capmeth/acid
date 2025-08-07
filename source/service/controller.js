import fs from 'node:fs'
import path from 'node:path'

import builder from './builder/index.js'
import loader from './loader/index.js'
import importer from './importer/index.js'
import server from './server/index.js'
import socketer from './socketer.js'
import styler from './styler/index.js'
import watcher from './watcher.js'

import { is } from '#utils'
import { assign, required } from '../config/index.js'


/**
    Returns the application interface.

    The interface returned has:
    - `run`: executes a docsite build
    - `use`: adds a function used to extend configuration

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

    let run = async bool =>
    {
        let data = assign(config, ...users, required);

        if (bool) data.config = { server: true, watch: true };

        let svc = createServices(data.config, omits);

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

    let users = [];
    let importExt = importer(config.root);

    let use = async (update, param) =>
    {
        if (is.string(update)) return importExt(update).then(mod => use(mod.default, param));
        if (is.func(update)) return (users.push(config => update(config, param)), void 0);
        
        throw new Error('extension parameter must be a module specifier or a function');
    }

    return { run, use };
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
