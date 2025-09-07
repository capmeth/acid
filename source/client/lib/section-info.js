/**
    Section Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite sections.
*/
import { assets, assetTypes, rootSection, sections, tocDepth } from '#config'
import { cacher, proxet } from '#utils'

let assetGroups = Object.values(assetTypes).map(v => v.plural);

let assetSort = proxet({}, prop => 
{
    return (a, b) =>
    {
        a = sinfo.asset(a)[prop];
        b = sinfo.asset(b)[prop];

        return a < b ? -1 : a > b ? 1 : 0;
    }
});

let assetMatch = ({ groups, sects, tags, text }) => id =>
{
    let asset = sinfo.asset(id);
    // asset title must include string
    if (text?.length && !asset.title.toLowerCase().includes(text.toLowerCase())) return false;
    // asset must be of one of selected types
    if (groups?.length && groups.findIndex(grp => asset.group === grp) < 0) return false;
    // asset must be in one of selected sections
    if (sects?.length && sects.findIndex(sect => asset.section === sect) < 0) return false;
    // asset must include all of the selected tags
    if (tags?.length && tags.findIndex(tag => !asset.hasTag(tag)) >= 0) return false;
    // good to go!
    return true;
}
let assetFilter = filters => sinfo.assets.filter(assetMatch(filters))

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
        assetGroups.forEach(g => data[g] = [ ...(data[g] || []), ...(section[g] || []), ...(child[g] || []) ]);
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

        if (assetGroups.includes(prop))
        {
            let items = assets.filter(assetMatch({ groups: [ prop ] }));
            // documents not auto-sorted as their order might be important
            return prop === 'documents' ? items : items.sort(assetSort.title);
        }

        return section[prop];
    });

    return iface;
});

let getAsset = cacher(uid =>
{
    let { section, ...asset } = assets[uid];

    let iface = proxet({ uid, section }, prop => 
    {
        if (prop === 'group') return assetTypes[asset.tid].plural;
        if (prop === 'hasTag') return name => iface.tagNames.includes(name)
        if (prop === 'tags') return asset.tags || [];
        if (prop === 'tagNames') 
        {
            let reducer = (array, tag) => 
            {
                let [ name ] = tag.split(':');
                if (!array.includes(name)) array.push(name);
                return array;
            }
            return iface.tags.reduce(reducer, []);
        }
        if (prop === 'tocDepth') return asset.tocDepth ?? tocDepth;
        if (prop === 'type') return assetTypes[asset.tid].singular;

        return asset[prop];
    });

    return iface;
});


let section = ref => getSection(ref.name || ref)
section.asset = (ref, expectType) => 
{
    let asset = getAsset(ref.uid || ref);

    if (expectType && asset.type !== expectType)
        throw new Error(`A ${asset.type} asset cannot be used where a ${expectType} asset is expected.`);

    return asset;
}

section.asset.filter = assetFilter;
section.asset.groups = assetGroups;
section.asset.sort = assetSort;


let sinfo = proxet(section, prop => 
{
    if (prop === 'assets') return Object.keys(assets);
    if (prop === 'root') return sinfo(rootSection);

    if (assetGroups.includes(prop)) 
    {
        let items = assets.filter(assetMatch({ groups: [ prop ] }));
        // documents not auto-sorted as their order might be important
        return prop === 'documents' ? items : items.sort(assetSort.title);
    }
});

export default sinfo
