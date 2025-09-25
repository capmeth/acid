---
title: Stable Components
---

Stable (or non-customizable) components are the gateway to most of the docsite's built-in functionality.  

They cannot be replaced, but some of them can be styled.  These components are accessible to **custom** components via the `#stable/cid` module specifier, where `cid` is the component id.

For example, in a custom component you can import **Article** via

```svelte
<script module>
import Article from '#stable/common/Article'
</script>
```

You can find the `cid` for a component in the *cid* tag on its docpage.

Components that can be re-styled will have the *inject* tag attached with the associated stylesheet ID.
