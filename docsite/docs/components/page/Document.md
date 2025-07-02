
```html label="Structure"
<region:leader>
  <Title>
    <!-- page title -->
  </Title>
  <Crumbs />
  <List what="tags-list">
    <Tag {...data} />
    ... <!-- each document tag -->
  </List>
</region:leader>

<region:main>
  <Article />
</region:main>

<region:nav>
  <Primary />
  <Single />
</region:nav>
```
