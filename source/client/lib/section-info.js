/**
    Section Info
    ---------------------------------------------------------------------------
    Derived information interface for docsite sections.
*/
import { rootSection, sections, tocDepth } from '#config'
import { cacher, proxet } from '#utils'
import ainfo from './asset-info'


let ancestor = section =>
{
    if (section.parent)
    {
        let sect = sinfo(section.parent);
        return [ ...sect.ancestor.name, sect.name ];
    }

    return [];
}

let descendant = section =>
{
    if (section.sections)
    {
        let reducer = (array, name) =>
        {
            let sect = sinfo(name);
            return [ ...array, sect.name, ...sect.descendant.name ];
        }

        return section.sections.reduce(reducer, []);
    }

    return [];
}

let getSection = cacher(name =>
{
    let { assets, cobe, parent, ...section } = sections[name];

    let iface = proxet({ name, parent }, prop => 
    {
        if (prop === 'ancestor') return proxet({}, prop => ancestor(iface).map(sect => sinfo(sect)[prop]));
        if (prop === 'assets') return ainfo.groups.reduce((a, g) => [ ...a, ...iface[g] ], []);
        if (prop === 'cobe') return { ...(parent && sinfo(parent).cobe), ...cobe };
        if (prop === 'descendant') return proxet({}, prop => descendant(iface).map(sect => sinfo(sect)[prop]));
        if (prop === 'lineage') return proxet({}, prop => [ ...iface.ancestor[prop], iface[prop] ]);
        if (prop === 'tocDepth') return section.tocDepth ?? tocDepth;

        if (ainfo.groups.includes(prop))
        {
            let items = assets.filter(ainfo.filter({ groups: [ prop ] }));
            // documents not auto-sorted as their order might be important
            return prop === 'documents' ? items : items.sort(ainfo.sort.title.asc);
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
