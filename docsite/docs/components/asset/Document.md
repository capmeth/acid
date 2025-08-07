
```html label="Structure"
<Title>
  <!-- document title goes here -->
</Title>
<Crumbs />
<Card name="tags" store="document-tags">
  slot:header
    <Label id="label-tags" />          
  /slot:header
  <List what="tags-list">
    <Tag />
    ... <!-- each document tag -->
  </List>
</Card>
```
