import builder from './builder/index.js'
import loader from './loader/index.js'
import importer from './importer/index.js'
import server from './server/index.js'
import socketer from './socketer.js'
import styler from './styler/index.js'
import watcher from './watcher.js'

import { configure, defaults, required } from '../config/index.js'


/**
    Returns the application interface.

    The interface returned has:
    - `run`: executes a docsite build

    @param { array } options
      Configuration options elements.
    @return { object }
      Services object.
*/
export default function(options, root)
{
    let make = configure(importer(root));

    let run = async bool =>
    {
        let data = await make({ ...defaults, configs: [ ...options, required ] });

        if (bool) data.config = { server: true, watch: true };

        let svc = createServices(data.config);

        let exec = () => Promise.all([ svc.bundle(), svc.watch.start(restart) ]).then(svc.serve.start)
        let stop = () => Promise.all([ svc.serve.stop(), svc.watch.close(), svc.socket.close() ])
        let restart = () => stop().then(() => (log.info('restarting application...'), run(bool)))
    
        return exec().then(svc.notify).then(() => stop);
    }

    return { run };
}

function createServices(config)
{
    let service = {};

    service.build = builder(config);
    service.load = loader(config);
    service.serve = server(config);
    service.socket = socketer(config);    
    service.style = styler(config);
    service.watch = watcher(config);

    // derived services
    service.notify = () => service.socket.send('reload')
    service.prepare = () => Promise.all([ service.load(), service.style() ])
    service.bundle = () => service.prepare().then(items => service.build(...items))
    service.update = () => service.bundle().then(service.notify)

    // post initialization ops
    service.serve.onError(err => log.fail(err));

    return service;
}
