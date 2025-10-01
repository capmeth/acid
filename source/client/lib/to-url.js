import { is } from '#utils'
import router from '../routing'
import ainfo from './asset-info'
import sinfo from './section-info'


export default function (param)
{
    let { name, to, uid } = is.nonao(param) ? param : { to: param };

    if (name === sinfo.root.name)
        return router.toNavLink('home');
    
    if (name)
        return router.toNavLink('section', { name });

    if (uid)
        return router.toNavLink(ainfo(uid).type, { uid });

    return router.toNavLink(to);
}
