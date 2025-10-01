import uncomment from "#source/utils/uncomment.js";


test('removes all JsDoc markers from a comment (JS)', t => 
{
    let comment =
    `
        /**
         * This is a description.
         *
         * @name Accordion
         *
         * @param { boolean } open
         *   Is the bellows open?
        */
    `;

    let actual = uncomment(comment);
    let expect = 
    [
        'This is a description.',
        '',
        '@name Accordion',
        '',
        '@param { boolean } open',
        '  Is the bellows open?'
    ];

    t.is(actual, expect.join('\n'));
});

test('removes all JsDoc markers from a comment (HTML)', t => 
{
    let comment =
    `
        <!--*
          * This is a description.
          *
          * @name Accordion
          *
          * @param { boolean } open
          *   Is the bellows open?
        -->
    `;

    let actual = uncomment(comment);
    let expect = 
    [
        'This is a description.',
        '',
        '@name Accordion',
        '',
        '@param { boolean } open',
        '  Is the bellows open?'
    ];

    t.is(actual, expect.join('\n'));
});
