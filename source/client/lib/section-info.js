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

let getDescendants = section =>
{
    let data = {};
    
    section.sections?.forEach(name =>
    {
        let section = sinfo(name), child = getDescendants(section);
        data.sections = [ ...(data.sections || []), name, ...(child.sections || []) ];
        ainfo.groups.forEach(g => data[g] = [ ...(data[g] || []), ...(section[g] || []), ...(child[g] || []) ]);
    });

    return data;
}

let getSection = cacher(name =>
{
    let { assets, parent, ...section } = sections[name];

    let iface = proxet({ name, assets, parent }, prop => 
    {
        if (prop === 'descendants') return getDescendants(iface);
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
