import { is } from '#utils'


let commaRe = /\s*,\s*/;

export default function (data)
{
    let { deprecated, groups, sects, tags, text } = data || {};
    
    deprecated = is.nullish(deprecated) ? void 0 : !!deprecated;
    groups = toArray(groups);
    sects = toArray(sects);
    tags = toArray(tags);
    text = is.string(text) ? text.toLowerCase() : '';

    return { deprecated, groups, sects, tags, text };
}

let toArray = value =>
{
    if (is.nonao(value)) return Object.keys(value).filter(key => value[key]);
    if (is.string(value)) return value.split(commaRe);

    return value || [];
}
