
/**
    Executes `JSON.stringify()` with replacer `options`.

    Options include
    - `re`: convert a RegExp object to an array of `source` and `flags`.

    @param { any } value
      Value to be json-stringified.
    @param { array } options
      Options object.
*/
export default function (value, options)
{
    let replacer = !options ? void 0 : (_, value) => 
    {
        if (options.includes('re') && value instanceof RegExp)
            return [ value.source, value.flags ];

        return value;
    };

    return JSON.stringify(value, replacer);
}
