---
title: Components
---

This section details all the components used internally by ACID.

Each component page here has structural "pseudo-code" in the example area that details its HTML, CSS class hierarchy, and usage of text labels, if any.

Below are some of the common (brace enclosed) variables used throughout the pseudo-code content.

****`page`****

Each "page-aware" component has CSS class `page-{page}` where `page` is one of

- **home**
- **section**
- **document**
- **component**
- **index**
- **error**

****`region`****

Each "region-aware" component has CSS class `region-{region}` where `region` is one of

- **banner**: docsite header region
- **main**: full content region for the page
  - **leader**: header region for the page
  - **primary**: main content region for the page
  - **trailer**: footer region for the page (currently unused)
- **nav**: navigation region for the page
- **footer**: docsite footer region

Note that `leader`, `primary`, and `trailer` are all sub-regions of main.

****`group`****

The `group` variable always refers to an asset group (or type), which is either "documents" or "components".
