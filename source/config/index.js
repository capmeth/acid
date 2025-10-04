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
export let assign = (...configs) => 
    configs.reduce((m, c) => (is.func(c) ? c(m.config) : m.config = c || {}, m), make())


export { default as defaults } from './defaults.js'
export { default as required } from './required.js'
