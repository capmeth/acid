
```html label="Structure"
<Input />
<List what="groups-list">
  <Toggle role="checkbox">
    <Label id="label-{group}" />
  </Toggle>
  ... <!-- each asset group -->
</List>
<List what="tags-list">
  <Toggle role="checkbox">
    <Tag {name} /> 
  </Toggle>
  ... <!-- each asset tag (from tagLegend) -->
</List>
<Button action="clear-filters" />
```
