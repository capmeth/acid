import confine from '../shared/confine/index.js'
import definition from './definition.js'
import defaults from './defaults.js'


/**
    Returns a proxy of default configuration options, optionally merged with
    additional configuration objects.

    @param { array } options
      Addtional configuration option objects.
    @return { Proxy }
      Controlled configuration object.
*/
export default function (...options)
{
    let data = confine(definition);
    
    data.config = defaults;
    options.forEach(option => data.config = option);

    return data;
}
