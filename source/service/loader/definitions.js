import test from '#source/shared/confine/validators.js'


export let component =
{
    'entity': { test: test.object, default: {}, merge: true },
    'entity.*': test.unset,
    'entity.author': test.object,
    'entity.author.email': test.string,
    'entity.author.name': test.string,
    'entity.content': test.string,
    'entity.deprecated': test.stringOrBoolean,
    'entity.description': test.string,
    'entity.example': test.string,
    'entity.ignore': test.boolean,
    'entity.kind': test.string,
    'entity.name': test.string,
    'entity.props': { test: test.array, default: [] },
    'entity.props.*': test.object,
    'entity.props.*.deprecated': test.stringOrBoolean,
    'entity.props.*.description': test.string,
    'entity.props.*.fallback': test.string,
    'entity.props.*.ignore': test.boolean,
    'entity.props.*.kind': test.string,
    'entity.props.*.name': test.string,
    'entity.props.*.required': test.boolean,
    'entity.props.*.type': test.string,
    'entity.props.*.values': test.array,
    'entity.since': test.string,
    'entity.summary': test.string,
    'entity.tags': { test: test.array, default: [] },
    'entity.tags.*': test.tag,
}
