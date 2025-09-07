import '#frend/virtual/style.css'

import { mount } from 'svelte';
import { hljsc, hrMode } from '#config';
import App from './components/core/base/Router'
import wsreload from './lib/ws-reload'


export default async function ()
{
    let { hljs } = window, { aliases } = hljsc;
    // setup highlightjs language aliases
    if (hljs && aliases)
    {        
        for (let lang in aliases)
        {
            let def = hljs.getLanguage(lang);            
            def.aliases ||= [];
            // add new alias(es)
            def.aliases.push(...aliases[lang]);
            // register again with updated configuration
            hljs.registerLanguage(lang, () => def);
        }
    }

    // connect hot-reload listener
    if (hrMode) wsreload();

    // render the docsite
    mount(App, { target: document.body });
}
