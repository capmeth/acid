import rescape from "#source/shared/rescape.js";


test('escapes regular expression special characters', t => 
{
    let chars = '.*+-?^${}()|[]\\';
    let regex = new RegExp(rescape(chars));

	t.true(regex.test(chars));
});
