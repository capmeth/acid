
export default
{
    alphanum: h => h.re(/^[a-z0-9_-]+$/) || h.err('must be alphanumeric (including `_` and `-` characters)'),
    arrayOrFunctionOrStringOrNull: h => h.or(h.null, h.string, h.func, h.array) ? h.toArray() : 
        h.err('must be an array or a function or a string or null'),
    arrayOrObject: h => h.object ? h.toArray() : h.err('must be an array or an object'),
    arrayOrObjectOrString: h => h.or(h.string, h.plain, h.array) ? h.toArray() : 
        h.err('must be an array, object, or a string'),
    arrayOrString: h => h.or(h.string, h.array) ? h.toArray() : h.err('must be an array or a string'),
    arrayOrStringOrNull: h => h.or(h.null, h.string, h.array) ? h.toArray() : 
        h.err('must be an array, a string, or null'),
    boolean: h => h.bool || h.err('must be set to true or false'),
    cobeMode: h => h.in('demo', 'edit', 'live', 'render', 'static') || h.err('must be a valid enumerated value'),
    display: h => h.in('always-hide', 'hide', 'always-show', 'show') || h.err('must be a valid enumerated value'),
    functionOrNull: h => h.or(h.null, h.func) || h.err('must be a function or null'),
    functionOrArrayOrNull: h => h.or(h.null, h.func, h.array) || h.err('must be a function or an array or null'),
    functionOrArrayOrStringOrNull: h => h.or(h.null, h.func, h.string, h.array) || 
        h.err('must be a function or an array or a string or null'),
    functionOrString: h => h.or(h.string, h.func) || h.err('must be a function or a string'),
    zeroPlus: h => h.and(h.number, h.gte(0)) || h.err('must be zero or more'),
    logLevel: h => h.in('fail', 'info', 'off', 'warn', 'test') || h.err('must be a valid enumerated value'),
    objectOrAny: (...args) => h => h.not(h.undef) ? h.toPlain(...args) : 
        h.err('cannot be set undefined'),
    objectOrArrayOrString: (...args) => h => h.or(h.string, h.array, h.plain) ? h.toPlain(...args) : 
        h.err('must be an object, array, or a string'),
    objectOrBoolean: (...args) => h => h.or(h.bool, h.plain) ? h.toPlain(...args) : 
        h.err('must be an object or set to true or false'),
    objectOrNumber: (...args) => h => h.or(h.number, h.plain) ? h.toPlain(...args) : 
        h.err('must be an object or a number'),
    objectOrString: (...args) => h => h.or(h.string, h.plain) ? h.toPlain(...args) : 
        h.err('must be an object or a string'),
    number: h => h.number || h.err('must be an number'),
    object: h => h.plain || h.err('must be an object'),
    port: h => h.and(!h.lt(0), !h.gt(65535)) || h.err('must be a valid port number'),
    regexOrArrayOrString: h => h.or(h.of(RegExp), h.string, h.array) || 
        h.err('must be a regular expression or a string or an array'),
    regexOrArrayOrStringOrFunctionOrNull: h => h.or(h.of(RegExp), h.string, h.array, h.func, h.null) || 
        h.err('must be a regular expression or a string or an array or a function or null'),
    reflags: h => h.or(h.re(/^[dgimsuvy]*$/), h.in(true)) || 
        h.err('must be `true` or contain only regular expression flags'),
    serial: h => h.serial || h.err('must be of serializable type'),
    storage: h => h.in('local', 'session', 'none') || h.err('must be a valid enumerated value'),
    string: h => h.string || h.err('must be a string'),
    stringOrBoolean: h => h.or(h.string, h.boolean) || h.err('must be a string or a boolean'),
    stringOrFunction: h => h.or(h.string, h.func) || h.err('must be a string or a function'),
    stringOrNull: h => h.or(h.string, h.null) || h.err('must be a string or null'),
    stringOrObject: h => h.or(h.string, h.plain) || h.err('must be a string or an object'),
    tag: h => h.re(/^([a-z0-9-]+)(?::([^\s]+))?$/) || h.err('must be a well formed asset tag'),
    unset: h => h.undef || h.err('is not a valid property')
}
