import sorter from "#source/utils/sorter.js";
import { comps1 } from '#test/data/index.js'


test('can sort ascending without resolution function', t => 
{
    let data = comps1.slice(0, 5).map(item => item.name);
    let sort = sorter();

    let actual = data.sort(sort.asc);
    let expect = data.sort();

    t.deepEqual(actual, expect);
});

test('can sort descending without resolution function', t => 
{
    let data = comps1.slice(0, 5).map(item => item.name);
    let sort = sorter();

    let actual = data.sort(sort.desc);
    let expect = data.sort().reverse();

    t.deepEqual(actual, expect);
});

test('can sort ascending using resolution function', t => 
{
    let data = comps1.slice(0, 5);
    let sort = sorter(x => x.name);

    let actual = data.sort(sort.asc);
    let expect = data.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

    t.deepEqual(actual, expect);
});

test('can sort descending using resolution function', t => 
{
    let data = comps1.slice(0, 5);
    let sort = sorter(x => x.name);

    let actual = data.sort(sort.desc);
    let expect = data.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0).reverse();

    t.deepEqual(actual, expect);
});

