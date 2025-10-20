import { on } from 'svelte/events'
import router from './router-base'


/**
    Builds and returns a hash router.

    Custom-rolled with the help of this article.
    https://dev.to/thedevdrawer/single-page-application-routing-using-hash-or-url-9jh

    Each element of `routes` should contain:
    - `name` (string): route name
    - `path` (string): path to route (starting with '/')
    - `component` (string): component to render for route.

    @param { array } routes
      Routes for the router.
    @return { object }
      - `start` (func): starts the router
      - `stop` (func): stops the router
*/
export default function(routes) 
{
    let base = router(routes);

    let handler = ({ newURL }) =>
    {
        let hash = new URL(newURL).hash.slice(1);

        if (!hash || hash === '/') hash = '/home';

        base.fire('change', base.toNavData(hash));
    }

    let toNavLink = (name, params) =>
    {
        let path = base.toNavLink(name, params);
        return path ? `#${path}` : path;
    }

    let running = false;

    let hash =
    {
        ...base.regs,

        start: () => 
        {
            if (!running)
            {
                running = true;
                on(window, 'hashchange', handler);
                handler({ newURL: location.href });
            }

            return hash;
        },
        
        stop: () => 
        {
            if (running)
            {
                running = false;
                window.removeEventListener("hashchange", handler);
            }

            return hash;
        },
                
        navTo: (name, params) => location.href = toNavLink(name, params),
    
        toNavLink
    };

    return hash;
}
