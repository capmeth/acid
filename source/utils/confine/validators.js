
export default
{
    alphanum: h => h.re(/^[a-z0-9_-]+$/) || 
        h.err('must be alphanumeric (including `_` and `-` characters)'),
    array: h => h.array || 
        h.err('must be an array'),
    arrayOrFunctionOrStringOrNull: h => h.or(h.null, h.string, h.func, h.array) ? h.to.array() : 
        h.err('must be an array or a function or a string or null'),
    arrayOrObject: h => h.object ? h.to.array() : 
        h.err('must be an array or an object'),
    arrayOrObjectOrRegexOrStringWithFunctionOrNull: h => 
        h.or(h.string, h.of(RegExp), h.plain, h.array) ? h.to.array() : h.or(h.func, h.null) ||
        h.err('must be an array or an object or a regular expression or a string or a function or null'),
    arrayOrObjectOrString: h => h.or(h.string, h.plain, h.array) ? h.to.array() : 
        h.err('must be an array, object, or a string'),
    arrayOrString: h => h.or(h.string, h.array) ? h.to.array() : 
        h.err('must be an array or a string'),
    arrayOrStringOrNull: h => h.or(h.null, h.string, h.array) ? h.to.array() : 
        h.err('must be an array, a string, or null'),
    boolean: h => h.bool || 
        h.err('must be set to true or false'),
    cobeMode: h => h.in('demo', 'edit', 'live', 'render', 'static') || 
        h.err('must be a valid enumerated value'),
    display: h => h.in('always-hide', 'hide', 'always-show', 'show') || 
        h.err('must be a valid enumerated value'),
    func: h => h.func || 
        h.err('must be a function'),
    functionOrNull: h => h.or(h.null, h.func) || 
        h.err('must be a function or null'),
    functionOrArrayOrNull: h => h.or(h.null, h.func, h.array) || 
        h.err('must be a function or an array or null'),
    functionOrArrayOrStringOrNull: h => h.or(h.null, h.func, h.string, h.array) || 
        h.err('must be a function or an array or a string or null'),
    functionOrString: h => h.or(h.string, h.func) || 
        h.err('must be a function or a string'),
    logLevel: h => h.in('fail', 'info', 'off', 'warn', 'test') || 
        h.err('must be a valid enumerated value'),
    object: h => h.plain || 
        h.err('must be an object'),
    objectOrAny: (...args) => h => h.not(h.undef) ? h.to.plain(...args) : 
        h.err('cannot be set undefined'),
    objectOrArrayOrString: (...args) => h => h.or(h.string, h.array, h.plain) ? h.to.plain(...args) : 
        h.err('must be an object, array, or a string'),
    objectOrBoolean: (...args) => h => h.or(h.bool, h.plain) ? h.to.plain(...args) : 
        h.err('must be an object or set to true or false'),
    objectOrNull: h => h.or(h.plain, h.null) || 
        h.err('must be an object or null'),
    objectOrNumber: (...args) => h => h.or(h.number, h.plain) ? h.to.plain(...args) : 
        h.err('must be an object or a number'),
    objectOrString: (...args) => h => h.or(h.string, h.plain) ? h.to.plain(...args) : 
        h.err('must be an object or a string'),
    objectOrStringOrNull: (...args) => h => h.or(h.null, h.string, h.plain) ? h.to.plain(...args) : 
        h.err('must be an object or a string or null'),
    number: h => h.number || 
        h.err('must be an number'),
    portOrObjectOrNull: h => h.or(h.and(!h.lt(0), !h.gt(65535)), h.plain, h.null) || 
        h.err('must be a valid port number or an object or null'),
    regexOrArrayOrObjectOrString: h => h.or(h.of(RegExp), h.array, h.plain, h.string) || 
        h.err('must be a regular expression or an array or an object or a string'),
    regexOrArrayOrString: h => h.or(h.of(RegExp), h.string, h.array) || 
        h.err('must be a regular expression or a string or an array'),
    regexOrArrayOrStringOrFunctionOrNull: h => h.or(h.of(RegExp), h.string, h.array, h.func, h.null) || 
        h.err('must be a regular expression or a string or an array or a function or null'),
    reflags: h => h.or(h.re(/^[dgimsuvy]*$/), h.in(true)) || 
        h.err('must be `true` or contain only regular expression flags'),
    serial: h => h.serial || 
        h.err('must be of serializable type'),
    storage: h => h.in('local', 'session', 'none') || 
        h.err('must be a valid enumerated value'),
    string: h => h.string || 
        h.err('must be a string'),
    stringOrBoolean: h => h.or(h.string, h.bool) || 
        h.err('must be a string or a boolean'),
    stringOrFunction: h => h.or(h.string, h.func) || 
        h.err('must be a string or a function'),
    stringOrNull: h => h.or(h.string, h.null) || 
        h.err('must be a string or null'),
    stringOrNullish: h => h.or(h.string, h.nullish) || 
        h.err('must be a string or null or undefined'),
    stringOrObject: h => h.or(h.string, h.plain) || 
        h.err('must be a string or an object'),
    tag: h => h.re(/^([a-z0-9-]+)(?::([^\s]+))?$/) || 
        h.err('must be a well formed asset tag'),
    unset: h => h.undef || 
        h.err('is not a valid property'),
    zeroPlus: h => h.and(h.number, h.gte(0)) || 
        h.err('must be zero or more')
}
