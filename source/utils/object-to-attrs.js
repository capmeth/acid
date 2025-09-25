import { kebabCase } from 'change-case'
import is from './is.js'


/**
    Converts an object into an HTML attribute string.

    @param { object } object
      Data to be converted. 
    @return { string }
      HTML attribute string.
*/
export default function (object)
{
    let reducer = (string, key) => 
    {
        let value = object[key];
        
        if (is.bool(value)) 
            return value ? `${string} ${kebabCase(key)}` : string;

        if (is(value))
            return `${string} ${kebabCase(key)}=${JSON.stringify(value)}`;

        return string;
    }

    return Object.keys(object).reduce(reducer, '');
}
