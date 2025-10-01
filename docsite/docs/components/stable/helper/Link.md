
```svelte label="markup/css structure"
<a class="helper-link type-${kind}">
  if children
    <!-- render `children` -->
  else
    <span>{ value }</span>
  end if
</a>
```
