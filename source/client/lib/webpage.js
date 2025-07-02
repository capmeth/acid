import { title } from '#config'


export default
{
    setTitle: theTitle => document.title = theTitle ? `${theTitle} | ${title}` : title
}
