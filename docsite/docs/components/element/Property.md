
```html label="Structure"
<div class="element-property required">
  <div class="name">
    <!-- property name -->
  </div>
  <div class="type">
    <!-- property type or "unknown" -->
  </div>
  <div class="description" data-markup>
    <!-- property description -->
  </div>
  <div class="values">
    <Label id="property-values" />
    <List>
      <code><!-- property enum value --></code>
      ... <!-- each enum value -->
    </List>
  </div>
  <div class="default">
    <Label id="property-default" />
    <span><!-- property default value --></span>
  </div>
</div>
```

- `required` class appears only for mandatory props
