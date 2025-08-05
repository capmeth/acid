
```html label="Structure"
<div class="asset-component">
  <Card name="tags" store="document-tags">
    slot:header
      <Label id="label-tags" />          
    /slot:header
    <List what="tags-list">
      <Tag />
      ... <!-- each document tag -->
    </List>
  </Card>
</div>
```
