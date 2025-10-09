import { is } from '#utils'


let asset = data =>
{
    let { deprecated, groups, sects, sections = sects, tags, text } = data || {};
    
    deprecated = is.nullish(deprecated) ? void 0 : !!deprecated;
    groups = toArray(groups);
    sections = toArray(sections);
    tags = toArray(tags);
    text = is.string(text) ? text.toLowerCase() : '';

    return { deprecated, groups, sections, tags, text };
}

let block = data =>
{
    let { langs, owners, text } = data || {};
    
    langs = toArray(langs);
    owners = toArray(owners);
    text = is.string(text) ? text.toLowerCase() : '';

    return { langs, owners, text };
}

let commaRe = /\s*,\s*/;

let toArray = value =>
{
    if (is.nonao(value)) return Object.keys(value).filter(key => value[key]);
    if (is.string(value)) return value.split(commaRe);

    return value || [];
}

export default { asset, block }
