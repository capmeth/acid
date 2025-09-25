
```svelte label="markup/css structure"
<ul class="main-list type-{type}">
  each items
    <li class="listitem">
      <!-- render `children` -->
    </li>
    if delim
      <li class="delimiter">
        <!-- render `delim` -->
      </li>
    end if
  end each
</ul>  
```
