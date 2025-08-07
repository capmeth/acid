import './style/main.css'

import { mount } from 'svelte';
import { hljsc, hrMode } from '#config';
import App from './components/app/Router'
import composer from './composer'
import wsreload from './lib/ws-reload'


export default async function ()
{
    let { hljs } = window;
    // setup highlightjs language aliases
    if (hljs)
    {
        let aliases = hljsc.aliases || {}
        
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
    await composer().then(compose => mount(App, { target: document.body, props: { compose } }));
}
