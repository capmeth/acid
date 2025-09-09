
let chopRe = /[^\w-]+/;

export default (value, pre = 'type') => 
{
    value = (value || '').split(chopRe)[0];
    return value ? `${pre}-${value}` : '';
}
