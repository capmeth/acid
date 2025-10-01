
```svelte label="markup/css structure"
<div class="main-prop required">
  <div class="name deprecated">
    <!-- render `name` -->
  </div>
  <div class="type">
    <!-- render `type` -->
  </div>
  if deprecated
    <div class="deprecation">
      <!-- render `deprecated` -->
    </div>
  end if
  <div class="desc">
    <Description type="prop" />
  </div>
  if values
    <div class="values">
      <List items={values} delim #each="item">
        <code>
          <!-- render `item` -->
        </code>
      </List>
    </div>
  end if
  if fallback
    <div class="default">
      <code>
        <!-- render `fallback` -->
      </code>
    </div>
  end if
</div>
```

- `required` class added when prop is mandatory
- `deprecated` class added when prop is deprecated
