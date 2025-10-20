import router from './router-base'


/**
    Builds and returns a url router.

    Router handles only URL interpretation on page load.  Links make trips to 
    the server as normal.
*/
export default function(routes) 
{
    let base = router(routes);

    let handler = ({ newURL }) =>
    {
        let { pathname } = new URL(newURL);

        if (pathname === '/') pathname = '/home';
        
        base.fire('change', base.toNavData(pathname));
    }

    let running = false;

    let slash = 
    {
        ...base.regs,
        
        start: () => 
        {
            if (!running)
            {
                running = true;
                handler({ newURL: location.href });
            }

            return slash;
        },
        
        stop: () => 
        {
            if (running) running = false;

            return slash;
        },
    
        navTo: (name, params) => location.href = slash.toNavLink(name, params),
    
        toNavLink: base.toNavLink
    };

    return slash;
}
