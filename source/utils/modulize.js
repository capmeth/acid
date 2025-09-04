
/**
    Converts a string into a module by way of a data url.

    @param { string } code
      Code for the module.
    @return { module }
      A module "file".
*/
export default async function (code)
{
    return import(`data:text/javascript,${encodeURIComponent(code)}`);
}
