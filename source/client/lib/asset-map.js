import { assetGroups, sections } from '#config'


let reducer = (obj, section) =>
{
    let reducer = (obj, group) =>
    {
        let assets = section[group] || [];
        return assets.reduce((obj, asset) => ({ ...obj, [asset.uid]: asset }), obj);
    } 
    return assetGroups.reduce(reducer, obj);
}

export default Object.values(sections).reduce(reducer, {})
