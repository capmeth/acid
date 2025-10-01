import test from '../utils/confine/validators.js'


export default
{
    'logger': { test: test.objectOrString('level'), default: {}, merge: true },
    'logger.*': test.unset,
    'logger.colors': { test: test.object, default: {}, merge: true },
    'logger.colors.*': test.unset,
    'logger.colors.*.*': test.unset,
    'logger.colors.*.main': test.stringOrNull,
    'logger.colors.*.emph': test.stringOrNull,
    'logger.colors.fail': { test: test.objectOrStringOrNull('main'), default: {} },
    'logger.colors.info': { test: test.objectOrStringOrNull('main'), default: {} },
    'logger.colors.test': { test: test.objectOrStringOrNull('main'), default: {} },
    'logger.colors.warn': { test: test.objectOrStringOrNull('main'), default: {} },
    'logger.default': test.functionOrNull,
    'logger.fail': test.functionOrNull,
    'logger.info': test.functionOrNull,
    'logger.level': test.logLevel,
    'logger.name': test.string,
    'logger.noChalk': test.boolean,
    'logger.test': test.functionOrNull,
    'logger.warn': test.functionOrNull,
}
