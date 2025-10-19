/**
    Asset Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite assets.
*/
import { assets, assetTypes, tocDepth } from '#config'
import { cacher, is, proxet, sorter } from '#utils'
import nofi from './normalize-filters'
import tinfo from './tag-info'


let assetKeys = Object.keys(assets);
let assetSort = proxet({}, prop => sorter(x => ainfo(x)[prop]));

let makeFilter = data => 
{
    let { deprecated, groups, sections, tags, text } = nofi.asset(data);
    
    return id =>
    {
        let asset = ainfo(id);
        // asset title must include string
        if (text.length && !asset.title.toLowerCase().includes(text)) return false;
        // asset must be of one of selected types
        if (groups.length && groups.findIndex(grp => asset.group === grp) < 0) return false;
        // asset must be in one of selected sections
        if (sections.length && sections.findIndex(sect => asset.section === sect) < 0) return false;
        // asset must include all of the selected tags
        if (tags.length && tags.findIndex(tag => !asset.hasTag(tag)) >= 0) return false;
        // asset must match deprecated selection
        if (is.bool(deprecated) && !asset.deprecated === deprecated) return false;
        // good to go!
        return true;
    }
}

let getAsset = cacher(uid =>
{
    let { section, tags, tid, ...asset } = assets[uid];

    let iface = proxet({ uid, section }, prop => 
    {
        if (prop === 'group') return assetTypes[tid].plural;
        if (prop === 'hasTag') return name => iface.tagNames.includes(name)
        if (prop === 'tags') return tags ? tags.sort(tinfo.sort.rank.desc) : [];
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
        if (prop === 'type') return assetTypes[tid].singular;

        return asset[prop];
    });

    return iface;
});

let asset = (ref, expectType) => 
{
    let asset = getAsset(ref.uid || ref);

    if (expectType && asset.type !== expectType)
        throw new Error(`A ${asset.type} asset cannot be used where a ${expectType} asset is expected.`);

    return asset;
}

asset.filter = makeFilter;
asset.sort = assetSort;

let ainfo = proxet(asset, prop => 
{
    // if (prop === 'assets') return Object.keys(assets);
    if (prop === 'assets') return ainfo.groups.reduce((a, g) => [ ...a, ...ainfo[g] ], []);
    if (prop === 'groups') return Object.values(assetTypes).map(v => v.plural)
    if (prop === 'types') return Object.values(assetTypes).map(v => v.singular)

    if (ainfo.groups.includes(prop)) 
    {
        let items = assetKeys.filter(makeFilter({ groups: [ prop ] }));
        // documents not auto-sorted as their order might be important
        return prop === 'documents' ? items : items.sort(assetSort.title.asc);
    }
});

export default ainfo
