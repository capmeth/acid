
```svelte mode="static" label="structure"
<List items={__asset_groups__} {type} #each={group}>
  <Toggle kind="checkbox">
    <!-- render `each(group) `-->
  </Toggle>
</List>
```
