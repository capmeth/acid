import eventer from '../lib/eventer'


/**
    Router base code.

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
    let { fire, ...regs } = eventer(); 

    let router = { fire, regs };

    router.findByName = sname => routes.find(({ name }) => name === sname)

    router.findByPath = spath =>
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

    router.toNavData = spath =>
    {
        let route = router.findByPath(spath);

        if (route)
        {
            let { name, component, path } = route;
            let segments = spath.split('/');

            let reducer = (o, s, i) => s[0] === ':' ? { ...o, [s.slice(1)]: segments[i] } : o
            let params = path.split('/').reduce(reducer, {});

            return { route: name, component, ...params };
        }
    }

    router.toNavLink = (name, params) =>
    {
        let route = router.findByName(name);

        if (route)
        {
            let inject = seg => seg[0] === ':' ? params[seg.slice(1)] : seg
            return route.path.split('/').map(inject).join('/');
        }
    }

    return router;
}
