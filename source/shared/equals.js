
/**
    Compares two values for non-coercive equality.
    
    In objects, only enumerable properties are compared.
    
    @return { boolean }
        True if objects are equal.
*/
export default function equals(object1, object2)
{
    if (object1 === object2) return true;
    // not equal if one is null
    if (object1 === null || object2 === null) return false;
    // equal if both are NaN (non-coercive)
    if (Number.isNaN(object1) && Number.isNaN(object2)) return true;
    // not equal if either one is not an object.
    if (typeof object1 !== 'object' || typeof object2 !== 'object') return false;
    // not equal if array status does not coincide
    if (Array.isArray(object1) !== Array.isArray(object2)) return false;
    
    let keys = Object.keys(object1);
    // not equal if key count different
    if (keys.length !== Object.keys(object2).length) return false;
    // not equal if each key not in other
    if (keys.findIndex(key => !Object.hasOwn(object2, key)) >= 0) return false;
    // not equal if each value not in other
    if (keys.findIndex(key => !equals(object1[key], object2[key])) >= 0) return false;
    // at this point we will have equivalence
    return true;
}
