import is from '../is.js'
import proxet from '../proxet.js'


let help = (name, value) =>
{
    let helper = proxet({ name, value }, attr => 
    {
        switch (attr)
        {
            case 'and': return (...args) => args.findIndex(x => !x) < 0
            case 'or': return (...args) => args.findIndex(x => x) >= 0
            case 'not': return arg => !arg
            case 'in': return (...args) => args.findIndex(x => value === x) >= 0
            case 'of': return type => value instanceof type
            case 're': return expr => expr.test(value)
            
            // comparison
            case 'gt': return val => value > val
            case 'gte': return val => value >= val
            case 'lt': return val => value < val
            case 'lte': return val => value <= val

            // normalizer
            case 'to':
                let to = use => () => is(value) ? is.func(use) ? use(former) : use : void 0
                to.array = (...more) => to(is.array(value) ? value : [ value, ...more ])
                to.plain = (key, more) => to(is.plain(value) ? value : { [key]: value, ...more })
                return to;
            
            // error message helper
            case 'err': return msg => `${name} ${msg}.`
        }

        return is[attr](value);
    });

    let unsup = [ 'to', 'err' ];

    let former = proxet({ name, value }, attr => 
    {
        if (!unsup.includes(attr))
        {
            let oper = helper[attr];

            if (is.func(oper))
                return (...args) => form => oper(...args) ? form : void 0
            else
                return form => oper ? form : void 0
        }
    });

    return helper;
}

export default help
