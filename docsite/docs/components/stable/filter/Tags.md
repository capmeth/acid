
```svelte mode="static" label="structure"
<List items={__asset_groups__} {type} #each={tag}>
  <Toggle kind="checkbox">
    <Tag {...tag} /> 
  </Toggle>
</List>
```
