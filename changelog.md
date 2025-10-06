# ACID Change Log


## Current Issues

- 10/01/25 - svelte dep currently pinned at **5.35.0** due to some site generation issues at **5.36.0** and up


---
## v0.0.4

- plugin functions can now be async
- `socket` and `server` config options automatically find an open port (via `get-port` dep)
- `confine` utility adds immutable properties
- `root` option is now immutable


## v0.0.3

- renderer extension functions no longer receive `modulize` and `partition` props


## v0.0.2

- build artifacts are minified in production (`NODE_ENV=production`)
- `assign` parameters fixed for `config.tagLegend`
- added tutorial for injecting bundled code in CoBEs


## v0.0.1

- initial release!
