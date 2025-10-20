/**
    Code Block Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite fenced code blocks.
*/
import { cobe } from '#config'
import blocks from '#blocks'
import { cacher, proxet, sorter } from '#utils'
import ainfo from './asset-info'
import nofi from './normalize-filters'
import sinfo from './section-info'


let blockKeys = blocks.map(block => block.id);
let blockSort = proxet({}, prop => sorter(x => binfo(x)[prop]));

let getOwner = uid => (ainfo.assets.includes(uid) ? ainfo : sinfo)(uid)

let makeFilter = data => 
{
    let { langs, owners, text } = nofi.block(data);
    
    return id =>
    {
        let block = binfo(id);
        // block must be owned by one of selected owners
        if (owners.length && owners.findIndex(owner => block.owner === owner) < 0) return false;
        // block must be of one of selected languages
        if (langs.length && langs.findIndex(lang => block.lang === lang) < 0) return false;
        // block label must include string
        if (text.length && !block.label.toLowerCase().includes(text)) return false;
        // good to go!
        return true;
    }
}

let makeBlock = ({ code, color, lang, mode, ...block }) =>
{
    let iface = { ...binfo.cobe(lang), ...block };

    iface.code = code.trim();
    iface.color = color || iface.color;
    iface.mode = iface.use && (mode || iface.mode) || 'static';

    iface[iface.mode] = true;

    return iface;
}

let getBlock = cacher(id =>
{
    let { uid, ...base } = blocks.find(block => block.id === id);

    let owner = getOwner(uid);
    base.color ||= owner.cobeColor;
    base.mode ||= owner.cobeMode;

    return proxet({ ...makeBlock(base), id, owner: uid });
});

let block = ref => getBlock(ref.id || ref)
let owner = ref => getOwner(ref.id || ref)

block.filter = makeFilter;
block.make = makeBlock;
block.sort = blockSort;
block.blocks = blockKeys;
block.owner = owner;

let binfo = proxet(block, prop => 
{
    if (prop === 'owner') return cacher(owner => blockKeys.filter(makeFilter({ owners: [ owner ] })));
    if (prop === 'cobe') return cacher(lang => (lang ||= 'default', { ...cobe['*'], ...cobe[lang], lang }))
});

export default binfo
