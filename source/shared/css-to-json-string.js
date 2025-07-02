
let atRuleRe = /(@\w+)\s+([^;{}]+;)/g;
let commentRe = /\/\*(?:(?<!\*\/).)*\*\//gs;
let keyRe = /(?<=[{};])\s*(@\w+|[^@;{}][^;{}]*)[:{]/g;
let valueRe = /(?<=:)[^;{}]+(?=;|\s*})/g;
let semiRe = /(?<="|\d);\s*(?!\s*})/g;
let semiEndRe = /(?<="|\d);\s*(?=\s*})/g;
let braceRe = /}\s*(?!\s*}|\s*$)/g;

let jss = val => isNaN(val) ? JSON.stringify(val) : val
/**
    A naive regex-based CSS-to-JSON "parser".

    Known limitations:
    - duplicate ruleset (object) selectors overwrite previous ones
*/
export default function (css)
{
    // 0. wrap the css string in braces
    css = `{${css}}`;
    // 1. remove all comments from the css string
    css = css.replace(commentRe, '');
    // 2. insert colons for bodyless at-rules
    css = css.replace(atRuleRe, '$1: $2');
    // 3. quote at-rules, selectors, and attribute keys
    css = css.replace(keyRe, (m, one) => jss(one.trim()) + (m.endsWith('{') ? ':{' : ':'));
    // 4. quote values
    css = css.replace(valueRe, m => jss(m.trim()));
    // 5. remove semicolon from last declaration
    css = css.replace(semiEndRe, '');
    // 6. insert commas as necessary
    css = css.replace(semiRe, ',');
    css = css.replace(braceRe, '},');

    return css;
}

