
let jsRe = /^\s*\/\*\*?(.+?)\*\/\s*$/s;
let htmlRe = /^\s*<!--\*?(.+?)-->\s*$/s;
let truncRe = /^(?:\s(?<!\n))*(?:\*(?: |$))?/gm;

/**
    Strips JS block-style and HTML comment markers from a comment string.

    This also includes removing all leading whitespace up to and including one
    asterisk and the first space after it.

    This also works on JsDoc-style comment tags (ones that start with an extra
    asterisk) in both JS and HTML.

    @param { string } source
      The comment to have markers stripped.
    @return { string }
      Raw comment content.
*/
export default function (source)
{
    let adjusted = source;

    if (jsRe.test(adjusted)) 
        adjusted = jsRe.exec(adjusted)[1];
    else if (htmlRe.test(adjusted)) 
        adjusted = htmlRe.exec(adjusted)[1];

    if (truncRe.test(adjusted))
        adjusted = adjusted.replace(truncRe, '');

    return adjusted.trim();
}
