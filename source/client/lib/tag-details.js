import { tagLegend } from '#config'
import { inter, is } from '#utils'


export default function (tag)
{
    let [ name, info ] = tag.split(':');
    let { desc } = tagLegend[name]

    if (!is.nullish(info)) desc = inter(desc, { info });

    return { name, info, desc };
}
