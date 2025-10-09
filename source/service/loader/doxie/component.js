import { AcidValidateError } from '#source/errors.js'
import { confine, test } from '#utils'


/*
    Validation criteria.
*/
let definition =
{
    'asset': { test: test.object, default: {}, merge: true },
    'asset.*': test.unset,
    'asset.author': test.object,
    'asset.author.email': test.string,
    'asset.author.name': test.string,
    'asset.content': test.string,
    'asset.deprecated': test.stringOrBoolean,
    'asset.description': test.string,
    'asset.example': test.string,
    'asset.ignore': test.boolean,
    'asset.kind': test.string,
    'asset.name': test.stringOrNullish,
    'asset.props': { test: test.array, default: [] },
    'asset.props.*': test.object,
    'asset.props.*.*': test.unset,
    'asset.props.*.deprecated': test.stringOrBoolean,
    'asset.props.*.description': test.string,
    'asset.props.*.fallback': test.string,
    'asset.props.*.ignore': test.boolean,
    'asset.props.*.kind': test.string,
    'asset.props.*.name': test.string,
    'asset.props.*.required': test.boolean,
    'asset.props.*.type': test.string,
    'asset.props.*.values': test.array,
    'asset.since': test.string,
    'asset.summary': test.string,
    'asset.tags': { test: test.array, default: [] },
    'asset.tags.*': test.tag,
}


/*
    Returns a Proxy for building a component data file.

    @param { string } id
      Identifier for validation error reporting.
    @param { function } mdparse
      Parses markdown content.
*/
export default function (id, mdparse)
{
    return confine(definition, ({ apply, spec, value, verify }) => 
    {
        value = verify(spec, value);

        switch (spec.at.path)
        {
            // descriptions parsed as markdown
            case 'asset.description':
            case 'asset.props.*.description':
                value = mdparse(value).doc;
                break;

            // filter out ignored props
            case 'asset.props':
                value = value.filter(val => val && !val.ignore)
                break;
        }
        
        try
        {
            apply(value);
        }
        catch (err)
        {
            if (!(err instanceof AcidValidateError)) throw err;
            log.warn(`component data from {:emph:${id}} was skipped: {:emph:${err.message}}`);
        }
    });
}


