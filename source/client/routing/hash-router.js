import { on } from 'svelte/events'
import Error from '../components/page/Error'
import eventer from '../lib/eventer'


/**
    Builds and returns a hash router.

    Custom-rolled with the help of this article.
    https://dev.to/thedevdrawer/single-page-application-routing-using-hash-or-url-9jh

    Each element of `routes` should contain:
    - `name` (string): route name
    - `path` (string): path to route (starting with '/')
    - `Component` (type): component to render for route.

    @param { array<object> } routes
      Routes for the router
    @return { class }
      - `start` (func): starts the router
      - `stop` (func): stops the router
*/
export default function(routes) 
{
    let running = false;
    let { fire, ...regs } = eventer(); 

    let findByName = sname => routes.find(({ name }) => name === sname)

    let findByPath = spath =>
    {
        let segments = spath.split('/');

        return routes.find(({ path }) => 
        {
            if (spath === path) return true;

            let segs = path.split('/');
            if (segments.length !== segs.length) return false;

            return segs.findIndex((s, i) => !(s === segments[i] || s[0] === ':')) < 0;
        });
    }

    let handler = ({ newURL }) =>
    {
        let [ path ] = newURL.split('#').slice(1);

        if (!path || path === '/') path = '/home';

        fire('change', toNavData(path));
    }

    let toNavData = spath =>
    {
        let route = findByPath(spath);

        if (route)
        {
            let { name, Component, path } = route;
            let segments = spath.split('/');

            let reducer = (o, s, i) => s[0] === ':' ? { ...o, [s.slice(1)]: segments[i] } : o
            let params = path.split('/').reduce(reducer, {});

            return { route: name, Component, ...params };
        }

        let message = `No page found at ${spath}`;
        return { Component: Error, code: 404, message }
    }

    let toNavLink = (name, params) =>
    {
        let route = findByName(name);

        if (route)
        {
            let inject = seg => seg[0] === ':' ? params[seg.slice(1)] : seg
            let segs = route.path.split('/').map(inject);

            return `#${segs.join('/')}`;
        }
    }

    let router = 
    {
        ...regs,
        
        start: () => 
        {
            if (!running)
            {
                running = true;
                on(window, 'hashchange', handler);
                handler({ newURL: location.href });
            }

            return router;
        },
        
        stop: () => 
        {
            if (running)
            {
                running = false;
                window.removeEventListener("hashchange", handler);
            }

            return router;
        },
        
        navTo: (name, params) => location.href = toNavLink(name, params),
        
        // error route data
        toErrorData: errorObj => ({ ...toNavData('/error'), ...errorObj }),

        toNavLink
    };

    return router;
}
