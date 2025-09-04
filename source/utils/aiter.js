
/**
    An array "list comprehension" method that returns an iterator.

    Each call to `next()` will return the next transformed item in the array 
    that passes the `filter` check (or `{ done: true }` if no more items pass).


    @param { array } items
      The list to be iterated.
    @param { function } [filter]
      Filters list items.  An item is omitted if falsey value returned.
    @param { function } [xform]
      Transforms list items.
    @return { object }
      Iterator.
*/
export default function (items, xform, filter)
{
    filter ||= () => true
    xform ||= x => x

    let nidx = 0, done = false;

    let iterator =
    {
        [Symbol.iterator]() { return this; },

        next()
        {
            if (!done)
            {
                while (nidx < items.length)
                {
                    let value = xform(items[nidx++]);
                    if (filter(value)) return { value, done };
                }
            }

            return { done: done = true };
        }
    }

    return iterator;
}
