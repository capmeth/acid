
```html label="Structure"
<div class="element-filters region-{region}">
  <div class="filter text">
    <Input />
  </div>
  <div class="filter groups">
    <List>
      <Toggle role="checkbox">
        <Label id="label-{group}" />
      </Toggle>
      ... <!-- each asset group -->
    </List>
  </div>
  <div class="filter tags">
    <List>
      <Toggle role="checkbox">
        <Tag {name} /> 
      </Toggle>
      ... <!-- each asset tag -->
    </List>
  </div>
</div> 
```
