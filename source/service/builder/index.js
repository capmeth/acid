import { rollup } from 'rollup'
import rollConfig from './rollup.config.js'


export default function(config)
{
    /**
        Runs the client resource bundling process.
    */
    return async function(loaded, styles)
    {    
        let build = rollConfig(config, loaded, styles);
    
        log.info('creating web bundle...');
    
        return rollup(build)
            .then(bundle => bundle.write(build.output)
            .finally(() => bundle.close()));
    }   
}
