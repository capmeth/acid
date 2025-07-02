

/**
    Removes all owned properties from an object.

    @param { object } target
      Object to have all properties removed.
    @return { object }
      Returns `target`.
*/
export default function(target)
{
    Object.getOwnPropertyNames(target).forEach(name => void delete target[name]);

    return target;
}