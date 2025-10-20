
/**
    Returns an ascending and descending sort functions.

    @param { function } [fn]
      Resolves a value under comparison.
    @returns { object }
      - `asc`: ascending sort function using `fn` for item resolution
      - `desc`: descending sort function using `fn` for item resolution
*/
export default function (fn)
{
    fn ||= x => x

    let asc = (a, b) => a < b ? -1 : a > b ? 1 : 0
    let desc = (a, b) => a < b ? 1 : a > b ? -1 : 0

    let sorts = 
    {
        asc: (a, b) => asc(fn(a), fn(b)),
        desc: (a, b) => desc(fn(a), fn(b))
    }

    return sorts;
}
