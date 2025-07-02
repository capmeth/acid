import cssToJs from '#source/shared/css-to-js.js'


test('converts CSS from bare properties', t => 
{
    let actual = cssToJs(
    `
        background: #4CAF50;
        color: white;
        padding: 10px 0;
    `);

    let expect = 
    {
        background: "#4CAF50",
        color: "white",
        padding: "10px 0"
    }

    t.deepEqual(actual, expect);
});

test('handles rulesets and nested CSS', t => 
{
    let actual = cssToJs(
    `
        /* Base styles */
        body 
        {
            font-family: Arial, sans-serif;
            line-height: 1.6;

            /* Nested styles for links within the body */
            a 
            {
                color: #4CAF50;
                text-decoration: none;

                &:hover 
                {
                    text-decoration: underline
                }
            }
        }
    `);

    let expect = 
    {
        body: 
        {
            "font-family": "Arial, sans-serif",
            "line-height": 1.6,

            a: 
            {
                color: "#4CAF50",
                "text-decoration": "none",

                "&:hover": 
                { 
                    "text-decoration": "underline" 
                }
            }
        }
    }

    t.deepEqual(actual, expect);
});

test('handles @-rule values and rulesets', t => 
{
    let actual = cssToJs(
    `
        @import url(https://cdn.js/cool/npm/library@1.0/index.js);

        /* Keyframes for a fade-in animation */
        @keyframes fadeIn 
        {
            from { opacity: 0; }
            to { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `);

    let expect = 
    {
        "@import": "url(https://cdn.js/cool/npm/library@1.0/index.js)",

        /* Keyframes for a fade-in animation */
        "@keyframes fadeIn": 
        {
            "from": { opacity: 0 },
            "to": { opacity: 1 },
            "50%": { opacity: 0.5 },
        }
    }

    t.deepEqual(actual, expect);
});
