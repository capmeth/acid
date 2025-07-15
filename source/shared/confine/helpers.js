import is from '../is.js'
import proxet from '../proxet.js'


let help = (name, value) =>
{
    return proxet({ name, value }, attr => 
    {
        switch (attr)
        {
            case 'and': return (...args) => args.findIndex(x => !x) < 0
            case 'or': return (...args) => args.findIndex(x => x) >= 0
            case 'in': return (...args) => args.findIndex(x => value === x) >= 0
            case 'of': return type => value instanceof type
            case 're': return expr => expr.test(value)
            
            // comparison
            case 'gt': return val => value > val
            case 'gte': return val => value >= val
            case 'lt': return val => value < val
            case 'lte': return val => value <= val

            // normalization helpers
            case 'to':
                return func => () => func(value, name)
            case 'toArray': 
                return more => () => is(value) ? is.array(value) ? value : [ value, ...(more || []) ] : []
            case 'toPlain': 
                return (key, more) => () => is(value) ? is.plain(value) ? value : { [key]: value, ...more } : {}
            case 'toObject': 
                return (key, more) => () => is(value) ? is.object(value) ? value : { [key]: value, ...more } : {}
            
            // new helper with modified value 
            case 'mod':
                return fn => help(name, fn())

            // error message helper
            case 'err': return msg => `${name} ${msg}.`
        }
        
        return is[attr](value);
    });
}

export default help
