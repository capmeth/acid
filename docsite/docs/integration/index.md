---
title: Integrations
cobeMode: static
---


This section provides details on how to integrate with ACID.


# Extension Resolution

As you'll see in the documents in this section, extensions are identified using module specifiers in *acid.config.js*.

ACID resolves these specifiers normally as though from within the hosted project. It achieves this by writing files whose names look like (*temp-acid-???.mjs*) to the root directory of the dependent project.  These files import and then export the config dependencies from within the hosted project's module resolution space.

So, when naming an extension it is possible to use an installed dependency name, an `exports` configuration from *package.json*, or even a path relative to the root of the project.

These "temp" files are immediately deleted after usage, but it is probably best to exclude them from version control to be safe.

``` label=".gitignore"
temp-acid-*.mjs
```
