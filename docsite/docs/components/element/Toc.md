
```html label="Structure"
<aside class="element-toc">
  <List {region}>
    :if headerId
      <Link>
        <!-- header text goes here -->
      </Link>
    :else
      <span>
        <!-- header text goes here -->
      </span>
    :endif
    ... <!-- each header (nested hierarchy) -->
  </List>
</aside>
```
