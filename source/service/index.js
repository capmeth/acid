import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads'
import fs from 'node:fs'
import parseFile from '#node/parse-file.js'
import { is } from '#utils'
import createConfig from '../config/index.js'
import controller from './controller.js'


/**
    Common application entry point for programmatic and cli access.

    Configuration `options` can be passed as
    - a configuration object
    - or a pathname to a configuration file.

    The return value is a Promise when `options` is a string path.  But this
    really only happens internally when a worker thread initiates on this file.

    Externally, this method should always be returning an object.

    @param { string | object } options
      Configuration filename or configuration object.
    @param { object } cliopts
      Additional Configuration options (usually from CLI).
    @return { object | Promise }
      Is or resolves to an object with
      - `start` (func): start the app
      - `stop` (func): stop the app
*/
let service = (options, cliopts, notify) =>
{
    let merge = data => createConfig(data, cliopts).config;
    let serve = config => controller(merge(config), options, notify)
    
    // run config file in worker thread
    if (is.string(options) && fs.existsSync(options)) 
        return isMainThread ? mainline(options, cliopts) : parseFile(options).then(serve);

    return is.nonao(options) ? serve(options) : serve();
}

export default service


/*
    Worker Threads
    ---------------------------------------------------------------------------
*/

/**
    Sends a `command` to `worker` and waits for expected `response`.
*/
let tasker = worker => async (command, response) =>
{
    return new Promise(accept => 
    {
        // callback on first expected `response`
        let listener = res => res === response && (remove(), accept())
        // remove listener
        let remove = () => worker.off('message', listener)
        // add listener
        worker.on('message', listener);
        // send command and wait for response
        worker.postMessage(command);
    });
}


let mainline = (options, cliopts) =>
{
    let app = {};

    let reload = () =>
    {
        let appWorker = new Worker(import.meta.filename, { workerData: [ options, cliopts ] });
        let task = tasker(appWorker);

        app.start = async () => task('start', 'app:started')
        app.stop = async () => task('stop', 'app:stopped')

        appWorker.on('message', async message => 
        {
            // message sent for app config update
            if (message === 'app:updated')
                app.stop().then(() => reload(options, cliopts).start());
            else if (message === 'app:stopped')
                appWorker.terminate();
        }) 
    
        return app;  
    }

    return reload();
}

if (!isMainThread)
{
    let app = null;
    let send = msg => parentPort.postMessage(msg)
    // messages from parent thread
    let receive = async message => 
    {
        switch (message)
        {
            case 'init':
                app = await service(...workerData, () => send('app:updated'));
                send('app:ready');
                break;

            case 'start':
                if (!app) await receive('init');
                await app.start();
                send('app:started');
                if (!app.isActive()) send('app:stopped');
                break;
    
            case 'stop':
                await app.stop();
                send('app:stopped');
                break;
        }
    }

    parentPort.on('message', receive);
}
