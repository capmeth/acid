import { is } from '#utils'
import confine from '../utils/confine/index.js'
import definition from './definition.js'


/**
    Creates an empty configuration proxy object.

    @return { Proxy }
      Configuration proxy. 
*/
export let make = () => confine(definition)

/**
    Creates a proxy object and assigns configuration.

    @return { Proxy }
      Configuration proxy. 
*/
export let assign = async (...configs) => 
{
    let data = make();

    for (let config of configs)
    {
        if (is.func(config)) 
            await config(data.config);
        else
            data.config = config;
    }

    return data;
}

export { default as defaults } from './defaults.js'
export { default as required } from './required.js'
