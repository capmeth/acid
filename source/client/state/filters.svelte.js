import { cacher } from '#utils'
import storage from '../lib/storage'


export default cacher(name => 
{
    if (name) name = `filters-${name}`;
    
    let filters = $state(name && storage[name] || {});
    $effect(() => name && (storage[name] = filters));

    return filters;
});
