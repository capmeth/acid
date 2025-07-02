import { kebabCase } from 'change-case'
import { namespace } from '#config'


let ns = (...segs) => kebabCase([ namespace, ...segs ].join(' '))

ns.pre = (...args) => (...segs) => ns(...args, ...segs)
// ns.post = (...args) => (...segs) => ns(...segs, ...args)

export default ns;
