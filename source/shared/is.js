import equals from './equals.js'


/**
    Returns `true` if `value` is not undefined nor null.

    With the obvious exception of `is.null`, and `is.undef`, all attached
    helper functions will also return `false` if 'value' is undefined or null.

    Some notes:
    - The value `null` is treated as though it is not an object. Keep this in
    mind when using object-related tests, as `null` has it's own separate test.
    - In javascript, an array is also an object, and that consistency is 
    maintained here as all object-related tests will return the same boolean
    value for both arrays and non-array objects.
    - To deal explicitly with Non-Array Objects, use the `nonao` tests.

    
    @param { any } value
      Value to be checked.
    @return { boolean }
      Returns `false` if `value` is undefined or null.
*/
export default function is(value)
{
    return typeof value !== 'undefined' && value !== null;
}
// does not exist
is.null = value => value === null
is.undef = value => typeof value === 'undefined'
// exists as type
is.array = value => Array.isArray(value)
is.bigint = value => typeof value === 'bigint'
is.bool = value => typeof value === 'boolean'
is.func = value => typeof value === 'function'
is.nonao = value => typeof value === 'object' && !Array.isArray(value) && value !== null
is.number = value => typeof value === 'number'
is.object = value => typeof value === 'object' && value !== null
is.plain = value => is(value) && (value.constructor === Object || !value.constructor)
is.string = value => typeof value === 'string'
is.symbol = value => typeof value === 'symbol'
// serialize-able
is.serial = value => is.object(value) || is.string(value) || is.number(value) || is.bool(value) || is.null(value)
// exists as type and/or is empty/blank
is.empty = value => value === '' || equals(value, []) || equals(value, {})
is.blank = value => value === ''
is.array.empty = value => equals(value, [])
is.nonao.empty = value => equals(value, {})
// exists as type not falsey or empty
is.array.notEmpty = value => is.array(value) && !equals(value, [])
is.bigint.notZero = value => is.number(value) && value !== 0n
is.bool.notFalse = value => is.bool(value) && value !== false
is.nonao.notEmpty = value => is.nonao(value) && !equals(value, {})
is.number.notNan = value => is.number(value) && !Number.isNaN(value)
is.number.notZero = value => is.number(value) && value !== 0
is.object.notEmpty = value => is.object(value) && !equals(value, {}) && !equals(value, [])
is.plain.notEmpty = value => is.plain(value) && !equals(value, {})
is.string.notBlank = value => is.string(value) && value !== ''
is.string.notEmpty = value => is.string(value) && value !== ''
// exists and not empty string, object, or array
is.notEmpty = value => is(value) && !(value === '' || equals(value, []) || equals(value, {}))
// exists and not empty type
is.notEmptyArray = value => is(value) && !equals(value, [])
is.notEmptyNonao = value => is(value) && !equals(value, {})
is.notEmptyObject = value => is(value) && !equals(value, {}) && !equals(value, [])
is.notEmptyString = value => is(value) && value !== ''
// exists and not specific falsey value
is.notBlank = value => is(value) && value !== ''
is.notFalse = value => is(value) && value !== false
is.notNan = value => is(value) && !Number.isNaN(value)
is.notZero = value => is(value) && value !== 0 && value !== 0n
// exists and not specific value
is.notInfinite = value => is(value) && value !== Infinity
// exists and array of
is.array.of =
{
    string: value => is.array(value) && value.findIndex(v => !is.string(v)) == -1
}
