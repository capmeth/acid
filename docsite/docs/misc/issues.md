

# Phantom File Search

Issue found: 05-22-2025 11:54pm

Svelte seems to be looking for a file that does not exist and is not being imported by ACID code.

This issue starts with svelte **5.27.2**.

```bash
node:internal/fs/promises:639
  return new FileHandle(await PromisePrototypeThen(
                        ^

Error: Could not load /Users/captison/Clients/CaptisonMethod/projects/acid/client/constants (imported by ../acid/node_modules/svelte/src/internal/client/dom/blocks/snippet.js): ENOENT: no such file or directory, open '/Users/captison/Clients/CaptisonMethod/projects/acid/client/constants'
    at async open (node:internal/fs/promises:639:25)
    at async readFile (node:internal/fs/promises:1243:14)
    at async file:///Users/captison/Clients/CaptisonMethod/projects/acid/node_modules/rollup/dist/es/shared/node-entry.js:21101:24
    at async Queue.work (file:///Users/captison/Clients/CaptisonMethod/projects/acid/node_modules/rollup/dist/es/shared/node-entry.js:22320:32) {
```

No idea how to fix, so app is pegged to **5.27.1** for now.

---

Issue resolved: 06-19-2025 11:38pm

In rollup `#client` was mapped as an alias for some client-based code utilities.  The same specifier is being used in Svelte (apparently starting at **5.27.2**), so ACID was changed to use `#frend` (front-end) instead.

