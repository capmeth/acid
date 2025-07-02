import { toScopeId } from '#source/service/styler/scopes.js'


let styleRe = /<style>(.+?)<\/style>/s;

/*
    Uses transform to add Svelte component CSS (in `<style>`).
*/
export default function ({ styles })
{
    let plugin = {};

    plugin.name = 'scoped-styles';

    plugin.transform = function(source, id)
    {
        let scopeId = toScopeId(id), style = styles[scopeId];
        // don't change styles for already styled components
        if (style && !styleRe.test(source))
        {
            log.info(`injecting styles for scope ${scopeId}...`);
            return source + `<style>\n${style}</style>\n`;                
        }

        return null;
    }
  
    return plugin;
}
