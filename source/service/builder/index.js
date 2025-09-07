import rollup from '#lib/rollup.js'
import rollConfig from './rollup.config.js'


export default function(config)
{
    /**
        Runs the client resource bundling process.
    */
    return async function(loaded, styles)
    {
        log.info('creating web bundle...');

        let builds = rollConfig(config, loaded, styles);

        return Promise.all(builds.map(rollup.write));
    }   
}
