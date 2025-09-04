import test from '../utils/confine/validators.js'


export default
{
    'logger': { test: test.objectOrString('level'), default: {}, merge: true },
    'logger.*': test.unset,
    'logger.default': test.functionOrNull,
    'logger.fail': test.functionOrNull,
    'logger.info': test.functionOrNull,
    'logger.level': test.logLevel,
    'logger.name': test.string,
    'logger.noChalk': test.boolean,
    'logger.test': test.functionOrNull,
    'logger.warn': test.functionOrNull,
}
