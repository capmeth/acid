import chokidar from 'chokidar'
import globit from '#lib/globit.js'
import { debounce } from '#utils'


export default function(config, omits = [])
{
    let { root, watch: { delay, enabled, files } } = config;
    // add extra excluded files
    (files.exclude ??= []).push(...omits);

    let watchers = [];

    let start = async callback =>
    {
        if (!enabled) return;
        
        return globit(files, root).then(files => 
        {
            let bounce = debounce(callback, delay);
            
            files.forEach(file => 
            {
                let watcher = chokidar.watch(file);

                watcher.on('change', bounce);
                watchers.push(watcher);

                log.test(`watching file ${file}`);
            });

            log.info(`watching ${files.length} files for changes...`);
        });
    }

    let close = async () => 
    {
        if (watchers.length)
        {
            log.info('closing all file watchers...');
            await Promise.all(watchers.map(w => w.close())); 
            watchers = [];
        }
    }

    let watching = () => watchers.length > 0

    return { close, enabled, start, watching };
}
