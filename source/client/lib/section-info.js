/**
    Section Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite sections.
*/
import { rootSection, sections, tocDepth } from '#config'
import { cacher, proxet } from '#utils'
import ainfo from './asset-info'


let getParents = section => 
{
    let list = [];

    let parent = section.parent;
    while (parent) 
    {
        list.unshift(parent);
        parent = sections[parent].parent;
    }

    return list;
}

let getDescendantData = (section, prop) =>
{
    prop ??= 'sections';

    let reducer = (array, name) =>
    {
        let sect = sinfo(name);
        return [ ...array, ...[].concat(sect[prop] ?? []), ...sect.descendant[prop] ];
    }

    return section.sections?.reduce(reducer, []) || [];
}

let getSection = cacher(name =>
{
    let { assets, parent, ...section } = sections[name];

    let iface = proxet({ name, parent }, prop => 
    {
        if (prop === 'assets') return ainfo.groups.reduce((a, g) => [ ...a, ...iface[g] ], []);
        if (prop === 'descendant') return proxet({ descendant: [] }, prop => getDescendantData(iface, prop));
        if (prop === 'parents') return getParents(iface);
        if (prop === 'path') return [ ...iface.parents, iface.name ];
        if (prop === 'sect') return name;
        if (prop === 'titlePath') return iface.path.map(parent => sinfo(parent).title);
        if (prop === 'tocDepth') return section.tocDepth ?? tocDepth;

        if (ainfo.groups.includes(prop))
        {
            let items = assets.filter(ainfo.filter({ groups: [ prop ] }));
            // documents not auto-sorted as their order might be important
            return prop === 'documents' ? items : items.sort(ainfo.sort.title);
        }

        return section[prop];
    });

    return iface;
});


let section = ref => getSection(ref.name || ref)

let sinfo = proxet(section, prop => 
{
    if (prop === 'root') return sinfo(rootSection);
    if (prop === 'sections') return Object.keys(sections);
});

export default sinfo
