
let tagdefRe = /(?:^\s*(?!\s|@)(?<spec>.+?)|(?<=(^|\n)\s*)@(?<tag>\w+)(?:\s+(?<spec>.+?))?)\s*(?=\n\s*@|$)/gsi;

/**
    Splits JsDoc comments by tags.

    All JsDoc tag markings should be removed before calling this.

    Each tag is demarcated by a marker (`@xxx`) that occurs the beginning of a 
    line and includes all lines up until the next tag marker.

    When comment begins without a tag all lines up to the next tag marker are
    tagged as "description".

    When `each` is omitted a function that returns an object with `tag` and 
    `data` is used in its place.

    @param { string } source
      Comment text.
    @param { function } each
      Called with data from each tag found.
    @return { array }
      Results from each call to `each`.
*/
export default function (source, each)
{
    each ||= (tag, data) => ({ tag, data })

    let results = [];

    for (let match of source.matchAll(tagdefRe))
    {
        let { tag = 'description', spec } = match.groups;
        results.push(each(alias[tag] || tag, spec));
    }

    return results;
}

let alias =
{
    arg: 'param',
    argument: 'param',
    defaultvalue: 'default',
    enums: 'values',
    desc: 'description',
    emits: 'fires',
    func: 'function',
    method: 'function',
    return: 'returns'
};
