/**
    Section Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite sections.
*/
import { assetGroups, rootSection, sections, tocDepth } from '#config'
import { cacher, proxet } from '#utils'
import assets from './asset-map'


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
    if (!asset.title.toLowerCase().includes(text)) return false;
    // asset must be of one of selected types
    if (groups.length && groups.findIndex(grp => asset.group === grp) < 0) return false;
    // asset must be in one of selected sections
    if (sects.length && sects.findIndex(sect => asset.section.name === sect) < 0) return false;
    // asset must include all of the selected tags
    if (tags.findIndex(tag => !asset.hasTag(tag)) >= 0) return false;
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
    
    section.sections?.forEach(sect =>
    {
        let section = sections[sect], child = getDescendants(section);
        data.sections = [ ...(data.sections || []), sect, ...(child.sections || []) ];
        assetGroups.forEach(g => data[g] = [ ...(data[g] || []), ...(section[g] || []), ...(child[g] || []) ]);
    });

    return data;
}

let getSection = cacher(name =>
{
    let sect = sections[name];

    if (!sect) return void 0;

    let iface = proxet({ name }, prop => 
    {
        if (prop === 'assets') return assetGroups.reduce((a, g) => [ ...a, ...iface[g] ], []);
        if (prop === 'descendants') return getDescendants(sect);
        if (prop === 'parents') return getParents(sect);
        if (prop === 'path') return [ ...iface.parents, iface.name ];
        if (prop === 'sect') return name;
        if (prop === 'titlePath') return iface.path.map(parent => sinfo(parent).title);
        if (prop === 'tocDepth') return sect.tocDepth ?? tocDepth;

        if (assetGroups.includes(prop))
        {
            let assets = sect[prop] || [];
            // documents not auto-sorted as their order might be important to user
            return prop === 'documents' ? assets : assets.sort(assetSort.title);
        }

        return sect[prop];
    });

    return iface;
});

let getAsset = cacher(uid =>
{
    let asset = assets[uid];

    if (!asset) return void 0;

    let iface = proxet({ uid }, prop => 
    {
        if (prop === 'section') return sinfo(asset.section);
        if (prop === 'hasTag') return name => iface.tagNames.includes(name)
        if (prop === 'parents') return iface.section.path;
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

        return asset[prop];
    });

    return iface;
});


let section = ref => getSection(ref.name || ref)
section.asset = ref => getAsset(ref.uid || ref)
section.asset.filter = assetFilter;
section.asset.groups = assetGroups;
section.asset.sort = assetSort;


let skeys = Object.keys(sections);

let sinfo = proxet(section, prop => 
{
    if (prop === 'assets') return assetGroups.reduce((a, g) => [ ...a, ...sinfo[g] ], []);
    if (prop === 'root') return sinfo(rootSection);

    if (assetGroups.includes(prop))
    {
        let assets = skeys.reduce((a, k) => [ ...a, ...sinfo(k)[prop] ], []);
        // documents not auto-sorted as their order might be important to user
        return prop === 'documents' ? assets : assets.sort(assetSort.title);
    }
});

section.asset.ids = sinfo.assets.map(a => a.uid); // deprecate

export default sinfo
