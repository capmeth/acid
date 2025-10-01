import mapComment from "#source/utils/map-comment.js";


test('splits a jsdoc comment by tags', t => 
{
    let comment =
    `
        @tags one, two
        @kind class
        @name Application
        @argument { string } name - Description of parameter.
    `

    let actual = mapComment(comment);
    let expect = 
    [
        { tag: 'tags', data: 'one, two' },
        { tag: 'kind', data: 'class' },
        { tag: 'name', data: 'Application' },
        { tag: 'param', data: '{ string } name - Description of parameter.' }
    ];

    t.deepEqual(actual, expect);
});

test('assigns tagless content as "description"', t => 
{
    let comment =
    `
        This is a description.
    `

    let actual = mapComment(comment);
    let expect = 
    [
        { tag: 'description', data: 'This is a description.' }
    ];

    t.deepEqual(actual, expect);
});
