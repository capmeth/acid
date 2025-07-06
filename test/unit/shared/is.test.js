import is from "#source/shared/is.js";


test('verifies a value as not being null or undefined', t => t.true(is('valid')));
test('verifies a value as being an empty string', t => t.true(is.blank('')));
test('verifies a value as being false', t => t.true(is.false(false)));
test('verifies a value as being null', t => t.true(is.null(null)));
test('verifies a value as being nullish', t => t.true(is.nullish(null) && is.nullish(void 0)));
test('verifies a value as being undefined', t => t.true(is.undef(void 0)));
test('verifies a value as being zero', t => t.true(is.zero(0)));
test('verifies a value as being a big integer', t => t.true(is.bigint(1n)));
test('verifies a value as being a boolean', t => t.true(is.bool(true)));
test('verifies a value as being a function', t => t.true(is.func(() => void 0)));
test('verifies a value as being a number', t => t.true(is.number(1)));
test('verifies a value as being an object', t => t.true(is.object({})));
test('verifies a value as being a string', t => t.true(is.string('value')));
test('verifies a value as being a symbol', t => t.true(is.symbol(Symbol())));
test('verifies a value as being an array', t => t.true(is.array([])));
test('verifies a value as being a non-array object', t => t.true(is.nonao({})));
test('verifies a value as being a plain object', t => t.true(is.plain(Object.create(null))));
test('verifies a value as being an empty object', t => t.true(is.empty({})));
test('verifies a value as being a serializable', t => 
{
    t.true(is.serial(false)) // booleans
    t.true(is.serial('')) // strings
    t.true(is.serial(5)) // numbers
    t.true(is.serial({})) // objects
    t.true(is.serial([])) // arrays
    t.true(is.serial(null)) // nulls
    // not
    t.false(is.serial(() => void 0)) // functions
    t.false(is.serial(Symbol())) // symbols
});
