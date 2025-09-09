/**
    Section Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite sections.
*/
import { assets, assetTypes, tocDepth } from '#config'
import { cacher, is, proxet } from '#utils'
import nofi from './normalize-filters'


let assetGroups = Object.values(assetTypes).map(v => v.plural);

let assetSort = proxet({}, prop => (a, b) => (a = ainfo(a)[prop], b = ainfo(b)[prop], a < b ? -1 : a > b ? 1 : 0));

let makeFilter = data => 
{
    let { deprecated, groups, sects, tags, text } = nofi(data);
    
    return id =>
    {
        let asset = ainfo(id);
        // asset title must include string
        if (text.length && !asset.title.toLowerCase().includes(text)) return false;
        // asset must be of one of selected types
        if (groups.length && groups.findIndex(grp => asset.group === grp) < 0) return false;
        // asset must be in one of selected sections
        if (sects.length && sects.findIndex(sect => asset.section === sect) < 0) return false;
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


let asset = (ref, expectType) => 
{
    let asset = getAsset(ref.uid || ref);

    if (expectType && asset.type !== expectType)
        throw new Error(`A ${asset.type} asset cannot be used where a ${expectType} asset is expected.`);

    return asset;
}

asset.filter = makeFilter;
asset.groups = assetGroups;
asset.sort = assetSort;


let ainfo = proxet(asset, prop => 
{
    if (prop === 'assets') return Object.keys(assets);

    if (assetGroups.includes(prop)) 
    {
        let items = assets.filter(makeFilter({ groups: [ prop ] }));
        // documents not auto-sorted as their order might be important
        return prop === 'documents' ? items : items.sort(assetSort.title);
    }
});

export default ainfo
