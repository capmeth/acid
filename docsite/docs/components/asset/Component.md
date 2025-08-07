
```html label="Structure"
<Title>
  <!-- component name goes here -->
</Title>
<Deprecated />
<Card name="description" markup>
  slot:header
    <Label id="label-description" />         
  /slot:header
  if description
    <!-- html description content goes here -->
  else
    <p>
      <em><Label id="msg-no-comments" item="component" /></em>
    </p>
  endif  
</Card>
<Card name="tags" markup>
  slot:header
    <Label id="label-tags" />         
  /slot:header
  <List what="tags-list">
    <Tag />
    ... <!-- each component tag -->
  </List>
</Card>
<Card name="props" markup>
  slot:header
    <Label id="label-props" />         
  /slot:header
  <List what="props-list">
    <Property />
    ... <!-- each component prop -->
  </List>
</Card>
```
