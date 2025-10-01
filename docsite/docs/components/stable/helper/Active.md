
```svelte label="markup/css structure"
<div class="helper-active type-{kind} active hover">
  if header
    <Toggle kind="switch">
      <!-- render `header` -->
    </Toggle>
  end if
  <div class="content">
    <!-- render `children` -->
  </div>
</div>
```

- `active` class applied when **Toggle** is active
- `hover` class applied when **Toggle** is hovered
