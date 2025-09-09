import { ainfo, sinfo } from '#frend/lib'
import { is } from '#utils'
import hashRouter from './hash-router'
import routes  from './routes'


export let router = hashRouter(routes);

export let toUrl = param =>
{
    let { name, to, uid } = is.nonao(param) ? param : { to: param };

    if (uid && !name)
    {
        let asset = ainfo(uid);
        return router.toNavLink(asset.type, { uid });
    }

    if (name)
    {
        if (name === sinfo.root.name)
            return router.toNavLink('home');
        else
            return router.toNavLink('section', { name });
    }

    return router.toNavLink(to);    
}

