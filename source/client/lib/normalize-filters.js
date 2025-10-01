import { is } from '#utils'


let commaRe = /\s*,\s*/;

export default function (data)
{
    let { deprecated, groups, sects, sections = sects, tags, text } = data || {};
    
    deprecated = is.nullish(deprecated) ? void 0 : !!deprecated;
    groups = toArray(groups);
    sections = toArray(sections);
    tags = toArray(tags);
    text = is.string(text) ? text.toLowerCase() : '';

    return { deprecated, groups, sections, tags, text };
}

let toArray = value =>
{
    if (is.nonao(value)) return Object.keys(value).filter(key => value[key]);
    if (is.string(value)) return value.split(commaRe);

    return value || [];
}
