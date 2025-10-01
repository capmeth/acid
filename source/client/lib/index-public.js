import { logo, title, version } from '#config'
import toUrl from './to-url'


export let site = { logo, title, toUrl, version };

export { default as ainfo } from './asset-info'
export { default as page } from './webpage'
export { default as sinfo } from './section-info'
