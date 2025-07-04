
let headie = (id, title) => ({ id, title: title || '---', heads: [] })
let headersWithId = lev => Array(lev).fill().map((...a) => `h${a[1]+1}[id]`).join(', ');

/**
    Returns a hierarchy of headers found descending from `node`.

    Starting with the root, each element of the returned tree has:
    - `id`: html id for the header
    - `title`: display value for the header
    - `heads`: sub-headers for the current header (or empty array)


    @param { HTMLElement } element
      Root node from which to search for headers.
    @return { object }
      Hierarchichal header tree.
*/
export default function(element, maxDepth)
{
    let selector = headersWithId(maxDepth ?? 6);
    let nodes = selector && maxDepth > 0 ? element.querySelectorAll(headersWithId(maxDepth)) : [];

    if (nodes.length)
    {
        let stack = [], tree = { heads: [] };
        // select all header nodes in order
        nodes.forEach(node =>
        {
            let { id, tagName, innerText: content } = node, length = parseInt(tagName[1]);
            // abort if
            // get current header id stack
            stack = Array.from({ length })
                .map((_, i) => length === i + 1 ? headie(id, content) : stack[i] || headie());
            // graft `node` onto tree
            let reducer = (trunk, item) => 
            {
                let branch = trunk.heads.find(entry => item.id === entry.id)
                if (!branch) trunk.heads.push(branch = item);
                return branch;
            }

            stack.reduce(reducer, tree);
        });

        return tree;
    }
}
