
```svelte mode="static" label="structure"
<When test={true} {use} param={{ assets: __filtered_assets__ }}>
  <List items={__filtered_assets__} {type} {children} />
</When>
```
