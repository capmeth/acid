
```svelte mode="static" label="structure"
<List items={__section_ancestors__} {type} {use} #each={section}>
  <Link to={section}>
    <!-- render `section.title` -->
  </Link>
</List>  
```
