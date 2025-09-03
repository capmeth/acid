import { sinfo } from '#frend/lib'
import { is } from '#utils'
import hashRouter from './hash-router'
import routes  from './routes'


export let router = hashRouter(routes);

export let toUrl = param =>
{
    let { sect, to, uid } = is.nonao(param) ? param : { to: param };

    if (uid && !sect)
    {
        let asset = sinfo.asset(uid);
        return router.toNavLink(asset.type, { uid });
    }

    if (sect)
    {
        if (sect === sinfo.root.name)
            return router.toNavLink('home');
        else
            return router.toNavLink('section', { sect });
    }

    return router.toNavLink(to);    
}

