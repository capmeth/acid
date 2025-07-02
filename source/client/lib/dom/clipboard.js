
/**
    Clipboard Access
    ---------------------------------------------------------------------------
*/
export default 
{
    canCopy: await navigator.permissions.query({ name: 'clipboard-write' })
        .then(perms => perms.state === 'granted' || perms.state === 'prompt')
        .catch(() => false),
    copyTo: data => navigator.clipboard.writeText(data)
}
