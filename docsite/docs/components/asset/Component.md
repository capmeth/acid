
```html label="Structure"
<main class="asset-component">
  <Title>
    <!-- title goes here -->
  </Title>
  <Crumbs />
  <List what="tags-list">
    <Tag />
    ... <!-- each component tag -->
  </List>
  <div class="description" data-markup>
    <!-- component source file comment -->
  </div>
  <div class="properties">
    <Toggle role="toggle">
      <Label id="label-props" />
    </Toggle>
    <List what="props-list">
      <Property />
      ... <!-- each component prop -->
    </List>
  </div>
</main>
```
