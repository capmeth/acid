
```svelte mode="static" label="structure"
<List items={__asset_options__} {type} #each={option}>
  <Toggle kind="checkbox">
    <!-- render `each(option)` -->
  </Toggle>
</List>
```
