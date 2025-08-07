import { AcidValidateError } from '#source/errors.js'
import { confine, is } from '#utils'
import { component } from './definitions.js'
import { tdComment } from './takedown.js'


/*
    Returns a Proxy for building a component data file.
*/
export default function ()
{
    let data = confine(component, (apply, value, at) => 
    {
        switch (at.path)
        {
            // descriptions parsed as markdown
            case 'entity.description':
            case 'entity.props.*.description':
                value = tdComment.parse(value).doc;
        }
        
        try
        {
            apply(value);
        }
        catch (err)
        {
            if (!(err instanceof AcidValidateError)) throw err;
            log.warn(`${at.name} skipped: ${err.message}`);
        }
    });

    let doxie = new Proxy(data.entity, 
    {
        set(target, prop, value)
        {
            switch (prop)
            {
                case 'self':
                    Object.keys(value).forEach(key => doxie[key] = value[key]);
                    break;

                case 'prop':
                    target.props.push(...(is.array(value) ? value : [ value ]));
                    break;

                case 'tag':
                    target.tags.push(...(is.array(value) ? value : [ value ]));
                    break;
s
                default:
                    if (!is.undef(value)) target[prop] = value;
            }

            return true;
        }
    });

    return doxie;
}
