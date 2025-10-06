
/**
    Returns an ascending and descending sort functions.

    @param { function } fn
      Resolves the values under comparison.
*/
export default function (fn)
{
    fn ||= (a, b, dir) => dir(a, b)

    let asc = (a, b) => a < b ? -1 : a > b ? 1 : 0
    let desc = (a, b) => a < b ? 1 : a > b ? -1 : 0

    let sorts = 
    {
        asc: (a, b) => fn(a, b, asc),
        desc: (a, b) => fn(a, b, desc)
    }

    return sorts;
}
