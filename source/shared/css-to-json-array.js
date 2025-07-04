import uid from './uid.js'


// not escaped
let ne = '(?<=(?<!\\\\)(?:\\\\\\\\)*)';
let quoteRe = new RegExp(`${ne}"((?:${ne}\\\\"|[^"])+)${ne}"`, 'g');
let delimsRe = /[:;{}]/g;

let atRuleRe = /(@\w+)\s+([^;{}]+;)/g;
let commentRe = /\/\*(?:(?<!\*\/).)*\*\//gs;
let endBraceRe = /}(?!\s*$)/g;
let attribRe = /(?<=^|},|[{;])(\s*@?[a-z0-9-]+\s*)(?=:)/g;
let selectRe = /(?<=^|},|[{;])\s*(@\w+|[^@;{}][^;{}]*)(?={)/g;
let valueRe = /:([^;{}]+)(?:;\s*}?|\s*})/g;
let openerRe = /{/g;
let closerRe = /,?\s*}/g;

let jss = val => isNaN(val) ? JSON.stringify(val) : val
/**
    A regex-based CSS-to-JSON "parser".

    This script inserts colons, commas, and brackets and replaces braces with 
    brackets where needed to create a JSON parseable, key-value nested array 
    CSS stylesheet.

    Quoted values are replaced before parsing and then re-inserted afterward if 
    they contain a brace (open or close), a colon, or a semi-colon.

    There may be edge cases where `JSON.parse` errors can occur.

    @param { string } css
      Stylesheet data.
    @return { string }
      JSON-parseable array-based stylesheet.
*/
export default function (css)
{
    let quoteds = {};
    // 1. remove all comments from the css string
    css = css.replace(commentRe, '');
    // 2. temporarily replace all problematic quoted strings
    css = css.replace(quoteRe, (m, one) => 
    {
        let id = `<<==${uid.hex(one)}==>>`;
        return one.match(delimsRe) ? (quoteds[id] = one, `"${id}"`) : m;
    });
    // 3. insert colons for bodyless at-rules
    css = css.replace(atRuleRe, '$1: $2');
    // 4. insert commas after all closing braces
    css = css.replace(endBraceRe, '},');
    // 5. quote at-rules and selectors
    css = css.replace(selectRe, (...a) => `[${jss(a[1].trim())},`);
    // 6. quote attribute keys
    css = css.replace(attribRe, (...a) => `[${jss(a[1].trim())}`);
    // 7. quote attribute values
    css = css.replace(valueRe, (m, one) => 
    {
        let str = jss(one.trim());
        return `,${str}]` + (m.endsWith('}') ? '}' : ',');
    });
    // 8. re-insert removed strings
    Object.keys(quoteds).forEach(q => css = css.replaceAll(q, quoteds[q]));
    // 9. brace replacement
    css = css.replace(openerRe, '[');
    css = css.replace(closerRe, ']]');

    // solo declarations w/o parent selector can have trailing comma
    if (css.endsWith(',')) css = css.slice(0, -1);

    return `[${css}]`;
}
