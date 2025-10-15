import chokidar from 'chokidar'
import { debounce } from '#utils'


export default function(config)
{
    let { output, root, watch: { delay, enabled, paths, options } } = config;
    // use `root` if there is not at least one path set
    if (!paths.filter(x => x).length) paths = root;
    
    options.cwd ||= root;
    options.ignoreInitial = true;

    let watcher;
    let fileReporter = (tally, [ path, names ]) => 
    {
        names.forEach(name => log.test(`watching file {:emph:${name}} from {:emph:${path}}...`));
        return tally + names.length;
    }

    let start = async callback =>
    {   
        if (watcher) await close();
        if (!enabled) return;

        let bounce = debounce(callback, delay);
        watcher = chokidar.watch(paths, options);
        // make sure output directory is not watched
        watcher.unwatch(output.dir);

        watcher.on('ready', () => 
        {
            let count = Object.entries(watcher.getWatched()).reduce(fileReporter, 0);
            log.info(`watching {:emph:${count} file(s)} for changes...`);
        });

        watcher.on('all', (event, path) => 
        {
            log.info(`watch event {:emph:${event}} fired for {:emph:${path}}`);
            bounce();
        });

        watcher.on('error', error => 
        {
            log.warn(`watch event error occurred: ${error}`);
        });        
    }

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
