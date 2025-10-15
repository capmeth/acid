import chokidar from 'chokidar'
import path from 'node:path'
import { debounce } from '#utils'


export default function(config)
{
    let { output, root, watch: { delay, enabled, paths, options } } = config;
    let outpath = path.join(root, output.dir);
    // use `root` if there is not at least one path set
    if (!paths.filter(x => x).length) paths = root;
    
    options.cwd = root;
    options.ignoreInitial = true;

    let watcher;
    let fileReporter = (tally, [ path, names ]) => 
    {
        names.forEach(name => log.test(`watching file {:emph:${path}/${name}}...`));
        return tally + names.length;
    }

    let start = ({ notify, restart }) => new Promise(async accept => 
    {   
        if (watcher) await close();
        if (!enabled) return;

        let bounceNotify = debounce(notify, delay);
        let bounceRestart = debounce(restart, delay);

        watcher = chokidar.watch(paths, options);

        watcher.on('ready', () => 
        {
            let count = Object.entries(watcher.getWatched()).reduce(fileReporter, 0);
            log.info(`watching {:emph:${count} file(s)} for changes...`);
            accept();
        });

        watcher.on('all', (event, fspath) => 
        {
            let newpath = path.join(root, fspath);

            if (newpath.startsWith(outpath))
            {
                log.info(`watch event {:emph:${event}} on {:emph:${fspath}}: refreshing...`);
                bounceNotify();
            }
            else
            {
                log.info(`watch event {:emph:${event}} on {:emph:${fspath}}: restarting...`);
                bounceRestart();
            }
        });

        watcher.on('error', error => 
        {
            log.warn(`watch event error occurred: ${error}`);
        });        
    });

    let close = async () => 
    {
        return watcher?.close().then(() => 
        {
            log.info('the file watcher has stopped');
            watcher = void 0;
        });
    }

    return { close, start };
}
