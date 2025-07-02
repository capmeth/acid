import { proxet } from '#utils'


let mimeTypes = 
{
    css: 'text/css',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript',
    json: 'application/json',
    // images
    gif: 'image/gif',
    ico: 'image/x-icon',
    jpg: 'image/jpg',
    png: 'image/png',
    svg: 'image/svg+xml',
};

export default proxet(mimeTypes, () => 'application/octet-stream');
