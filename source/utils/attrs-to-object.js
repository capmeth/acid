import { camelCase } from 'change-case'
import is from './is.js'


let attrsRe = 
    /(?<k>[a-z_:][a-z0-9_.:-]*)(?:=(?:(?<v>[^\s"'<=>`]+)|"(?<v>(?:(?!\\").)*?)"|'(?<v>(?:(?!\\').)*?)'))?(?=\s|$)/gi;

/**
    Converts an attribute string into an object.

    @param { string } string
      String containing HTML attributes.
    @return { object }
      Attributes from `string`.
*/
export default function (string)
{
    let attrs = {};

    if (string)
    {
        let result;

        while (result = attrsRe.exec(string))
        {
            let { k: name, v: value } = result.groups;
            attrs[camelCase(name)] = is(value) ? value : true;
        }
    }

    return attrs;
}
