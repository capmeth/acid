/**
    Tag Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite tags.
*/
import { tagLegend } from '#config'
import { cacher, inter, is, proxet, sorter } from '#utils'


let tagKeys = Object.keys(tagLegend);
let tagSort = proxet({}, prop => sorter((a, b, t) => t(tinfo(a)[prop], tinfo(b)[prop])));

let getTag = cacher(id =>
{
    let [ name, info ] = id.split(':');
    let { desc, rank = 0, ...tag } = tagLegend[name] || {};

    let iface = proxet({ name, info, rank }, prop => 
    {
        if (prop === 'desc') return desc ? is.nullish(info) ? desc : inter(desc, { info }) : ''
        if (prop === 'known') return !!tagLegend[name];

        return tag[prop];
    });

    return iface;
});

let tag = ref => 
{
    let tag = ref;

    if (is.nonao(ref))
    {
        let { name, info } = ref;
        tag = info ? `${name}:${info}` : name;
    }

    return getTag(tag);
}

tag.sort = tagSort;

let tinfo = proxet(tag, prop => 
{
    if (prop === 'tags') return tagKeys.sort(tagSort.rank.desc);
});

export default tinfo

