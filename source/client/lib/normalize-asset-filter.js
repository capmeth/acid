import { is } from '#utils'
import storage from './storage'


let commaRe = /\s*,\s*/;

export default function (filter)
{
    if (is.string(filter)) filter = storage[filter];

    let { group, groups, sect, sects, tag, tags, text } = { ...storage[filter?.store], ...filter };
    
    if (group) groups ||= group;
    if (sect) sects ||= sect;
    if (tag) tags ||= tag;

    groups = is.string(groups) ? groups.split(commaRe) : groups || [];
    sects = is.string(sects) ? sects.split(commaRe) : sects || [];
    tags = is.string(tags) ? tags.split(commaRe) : tags || [];
    text = is.string(text) ? text.toLowerCase() : '';

    return { groups, sects, tags, text };
}
