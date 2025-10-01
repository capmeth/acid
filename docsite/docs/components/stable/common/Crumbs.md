
```svelte label="markup/css structure"
<List {items} {type} {use} delim #each="item">
  <Link to={item}>
    <!-- render `item.title` -->
  </Link>
</List>  
```
