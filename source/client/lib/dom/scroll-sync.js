/* eslint-disable */
import { on } from 'svelte/events'

/*
    Sync scroll positions between two or more elements.

    This works for mouse

    Adapted from a stack-overflow answer
    https://stackoverflow.com/questions/9236314/how-do-i-synchronize-the-scroll-position-of-two-divs
*/
export default function (selector) 
{
    // currently active element
    let active = null, setActive = evt => active = evt.target
    // scroll syncing targets
    let targets = document.querySelectorAll(selector);

    let handleScroll = evt =>
    {
        if (evt.target !== active) return;

        targets.forEach(target => 
        {
            if (active === target) return;

            target.scrollTop = active.scrollTop;
            target.scrollLeft = active.scrollLeft;
        });
    }

    targets.forEach(elem => 
    {
        elem.addEventListener("mouseenter", setActive);
        elem.addEventListener("scroll", handleScroll);
    });
    // return a teardown function
    return () =>
    {
        targets.forEach(elem => 
        {
            elem.removeEventListener("mouseenter", setActive);
            elem.removeEventListener("scroll", handleScroll);
        });
    }
}
