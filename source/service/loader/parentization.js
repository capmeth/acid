import { is } from '#utils'


/**
    Adds `parent` reference to content sections.

    This starts at 'root' section and works its way down, following `sections`
    list to build a tree. Unconnected sections will be left out.


    @param { object } sections
      Named sections to traverse.
    @param { object } root
      Name of the section representing the root of the hierarchy.
    @return { object }
      Pruned section group with `parent` references.
*/
export default function(sections, root)
{
    let linked = {};

    let parentize = (name, parent) =>
    {
        let section = sections[name];

        log.test(`linking section {:emph:${name}}...`);
    
        if (is.nonao(section))
        {
            if (name !== root && is(linked[name]))
            {
                log.warn(`section {:emph:${name}} already linked to {:emph:${linked[name].parent}}, skipping`);                
            }
            else
            {
                // new object to avoid validation on original proxy
                let { sections: sects } = linked[name] = { ...section, parent };

                if (is.array(sects))
                {
                    // `sections` to omit elements unsuccessfully parentized
                    linked[name].sections = sects.reduce((a, n) => parentize(n, name) ? [ ...a, n ] : a, []);
                }
                
                return true;
            }
        }
        else
        {
            log.warn(`section {:emph:${name}} does not exist or is invalid, skipping`);
        }

        return false;
    }

    parentize(root);

    return linked;
}
