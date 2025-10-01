import jsToCss from "#source/utils/js-to-css.js";


test('converts a style object to css', t => 
{
    let style =
    {
        ".button":
        {
            backgroundColor: "darkgreen",
            color: "white",
            fontSize: "1.3em",
            width: "120px"
        }
    }

    let actual = jsToCss(style).trim();
    let expect = 
    [
        '.button',
        '{',
            'backgroundColor: darkgreen;',
            'color: white;',
            'fontSize: 1.3em;',
            'width: 120px;',
        '}',
    ];

    t.is(actual, expect.join('\n'));
});

test('converts nested style objects to nested css', t => 
{
    let style =
    {
        ".homepage":
        {
            minHeight: "100vh",
            padding: "24px",

            ".button":
            {
                backgroundColor: "darkgreen",
                color: "white",
                fontSize: "1.3em",
                width: "120px",

                "&:hover":
                {
                    backgroundColor: "black"
                }
            }
        }
    }

    let actual = jsToCss(style).trim();
    let expect = 
    [
        '.homepage',
        '{',
            'minHeight: 100vh;',
            'padding: 24px;',

            '.button',
            '{',
                'backgroundColor: darkgreen;',
                'color: white;',
                'fontSize: 1.3em;',
                'width: 120px;',

                '&:hover',
                '{',
                    'backgroundColor: black;',
                '}',
            '}',
        '}',
    ];

    t.is(actual, expect.join('\n'));
});

test('converts css directives to css', t => 
{
    let style =
    {
        "@import":
        [
            "url(path/to/more/style.css)",
            "'grid.css' supports(display: grid) screen and (width <= 400px)"
        ],
        "@font-face": 
        [
            {
                fontFamily: "'MyWebFont'",
                src: "url('myfont.woff2') format('woff2'), url('myfont.woff') format('woff')"
            },
            {
                fontFamily: "'AnotherFont'",
                src: "url('other.woff2') format('woff2')"
            }
        ]
    }

    let actual = jsToCss(style).trim();
    let expect = 
    [
        '@import url(path/to/more/style.css);',
        '@import \'grid.css\' supports(display: grid) screen and (width <= 400px);',
        '@font-face',
        '{',
            'fontFamily: \'MyWebFont\';',
            'src: url(\'myfont.woff2\') format(\'woff2\'), url(\'myfont.woff\') format(\'woff\');',
        '}',
        '@font-face',
        '{',
            'fontFamily: \'AnotherFont\';',
            'src: url(\'other.woff2\') format(\'woff2\');',
        '}'
    ];

    t.is(actual, expect.join('\n'));
});

test('can add renbox to selectors with declarations/pseudo-classes', t => 
{
    let style =
    {
        ".docsite":
        {
            ".sidebar":
            {
                display: "contents"
            }
        },

        ".homepage":
        {
            minHeight: "100vh",
            padding: "24px",

            ".button":
            {
                "&:hover":
                {
                    backgroundColor: "black"
                }
            }
        }
    }

    let actual = jsToCss(style, true).trim();
    let expect = 
    [
        '.docsite',
        '{',
            '.sidebar:not(.renbox *)',
            '{',
                'display: contents;',
            '}',
        '}',
        '.homepage:not(.renbox *)',
        '{',
            'minHeight: 100vh;',
            'padding: 24px;',

            '.button:not(.renbox *)',
            '{',
                '&:hover',
                '{',
                    'backgroundColor: black;',
                '}',
            '}',
        '}',
    ];

    t.is(actual, expect.join('\n'));
});

// adds renbox protection to selectors starting with ":global"
test('adds renbox protection to ":global" descendants having declarations/pseudo-classes', t => 
{
    let style =
    {
        ".docsite":
        {
            ":global":
            {
                ".sidebar":
                {
                    display: "contents"
                }
            }
        },

        ".homepage":
        {
            ":global":
            {
                ".button":
                {
                    span:
                    {
                        backgroundColor: "black"
                    }
                }
            }
        }
    }

    let actual = jsToCss(style).trim();
    let expect = 
    [
        '.docsite',
        '{',
            ':global',
            '{',
                '.sidebar:not(.renbox *)',
                '{',
                    'display: contents;',
                '}',
            '}',
        '}',
        '.homepage',
        '{',
            ':global',
            '{',
                '.button',
                '{',
                    'span:not(.renbox *)',
                    '{',
                        'backgroundColor: black;',
                    '}',
                '}',
            '}',
        '}',
    ];

    t.is(actual, expect.join('\n'));
});
