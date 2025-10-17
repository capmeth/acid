import moduleImporter from '#lib/module-importer.js'
import builder from './builder.js'
import loader from './loader/index.js'
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
    let make = configure(moduleImporter(root));

    let run = async bool =>
    {
        let data = await make({ ...defaults, root, configs: [ ...options, required ] });

        if (bool) data.config = { server: true, watch: true };

        let svc = {}, { config } = data;

        svc.build = builder(config);
        svc.load = loader(config);
        svc.serve = server(config);
        svc.socket = socketer(config);    
        svc.style = styler(config);
        svc.watch = watcher(config);

        // derived services
        svc.notify = () => svc.socket.send('reload')
        svc.prepare = () => Promise.all([ svc.load(), svc.style() ])
        svc.bundle = () => svc.prepare().then(items => svc.build(...items))
        svc.restart = () => svc.stop().then(() => run(bool))
        svc.run = () => svc.bundle().then(svc.start)
        svc.start = () => svc.watch.start(svc).then(() => Promise.all([svc.serve.start(), svc.socket.start()]))
        svc.stop = () => Promise.all([ svc.serve.stop(), svc.watch.close(), svc.socket.close() ])
        svc.update = () => svc.bundle().then(svc.notify)

        // post initialization ops
        svc.serve.onError(err => log.fail(err));
    
        return svc.run().then(svc.notify).then(() => svc.stop);
    }

    return { run };
}
