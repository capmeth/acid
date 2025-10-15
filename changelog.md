# ACID Change Log


## Current Issues

- 10/01/25 - svelte dep currently pinned at **5.35.0** due to some site generation issues at **5.36.0** and up


---
## v0.1.0

- add `config.configs` option to specify plugins inline 
- fix issues with closing server/sockets
- update file watching to hot-reload entire app including config
- add background color-picker for CoBE render-box
- fix regex serialization bug with `cobe.*.imports` option 
- add `toAssetAccessLine` option for generating access statements for assets
- allow components to be embedded in markdown files via `config.components`
- add Action component for Editor interaction/toggles
- add deprecation messages to documents, sections 

BREAKING CHANGES!
- remove `watch.files` options
- remove `app.use()` API


## v0.0.4

- add fenced block isolation page
- add `updateMarkdown` option to manipulate markdown content before parsing
- add `finalizeAsset` option to update assets before build serialization
- add option to hide watermark logo in docsite
- update documentation for internal components
- add rank for tag ordering in `tagLegend` option
- add `tinfo` client utility for tag details
- filter component props with `@ignore` tags from the build
- add fenced block `file` option to load file content
- allow plugin functions to be async
- update `socket` and `server` config options to automatically find open port
- add immutable properties for `confine` utility
- change `root` option to be immutable


## v0.0.3

- renderer extension functions no longer receive `modulize` and `partition` props


## v0.0.2

- build artifacts are minified in production (`NODE_ENV=production`)
- `assign` parameters fixed for `config.tagLegend`
- added tutorial for injecting bundled code in CoBEs


## v0.0.1

- initial release!
