
// TODO: make sure this matches only within <style> tag
let injectRe = /\/\*\s*@inject\s+(#[\w-]+)\s*\*\//g;

/*
    Uses transform to add Svelte component CSS (in `<style>`).
*/
export default function ({ styles })
{
    let plugin = {};

    plugin.name = 'scoped-styles';

    plugin.transform = function(source, id)
    {
        if (injectRe.test(source))
        {
            return source.replace(injectRe, (match, sid) => 
            {
                if (styles[sid])
                {
                    log.test(() => 
                    {
                        let temp = id.split('/').slice(-3).join('/');
                        return `injecting styles {:white:${sid}} into {:white:${temp}}...`
                    });
                    return styles[sid];
                }

                return match;
            });
        }

        return null;
    }
  
    return plugin;
}
