
```svelte label="markup/css structure"
<When {use}>
  if [can render]
    <List items={items} {type} #each="item">
      <!-- render children(item) -->
    </List>
  end if
</When>
```

- `items` is the filtered list of assets
