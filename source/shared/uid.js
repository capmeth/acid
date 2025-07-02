import is from './is.js'
import shash from './shash.js'


let counter = Date.now();
/**
    Generates a unique id (string).
    
    Return value will be the same for the same input (including for `NaN`), 
    including evaluating child values in arrays/objects.

    @param { any } value
      Source value from which to generate unique id.
    @return { string }
      A unique id value.
*/
export default function uid(value)
{
    let type = typeof value;
  
    if (is.array(value))
        return 'array' + value.map(uid).join();
    
    if (is.object(value))
        return type + uid(Object.entries(value));

    return type + value;
}

/**
    Generates a unique id (string hash).
    
    @param { any } value
      Source value from which to generate hash.
    @return { string }
      A unique hash value.
*/
uid.hash = value => shash(uid(value))

/**
    Generates a unique id (hashed base16 string).
    
    @param { any } value
      Source value from which to generate hash.
    @return { string }
      A unique hexadecimal value.
*/
uid.hex = value => uid.hash(value).toString(16)

/**
    Generates a unique id (hashed base32 string).
    
    @param { any } value
      Source value from which to generate hash.
    @return { string }
      A unique duotrigesimal? value.
*/
uid.duo = value => uid.hash(value).toString(32)

/**
    Generates a unique (sequential) string on every call.

    @return { string }
      A new hexadecimal string value.
*/
uid.next = () => uid.hex(counter++)

/**
    Generates a unique (random) string on every call.

    @return { string }
      A new hexadecimal string value.
*/
uid.rand = () => uid.hex(Math.floor(Math.random() * counter++))
