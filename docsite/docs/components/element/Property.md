
```html label="Structure"
<div class="element-property required deprecated">
  <div class="name">
    <!-- property name -->
  </div>
  <div class="type">
    <!-- property type or "unknown" -->
  </div>
  if deprecated
    <div class="deprecated">
      <!-- deprecation message -->
    </div>
  endif
  <div class="description markup">
    if description
      <!-- property description -->
    else
      <p>
        <em><Label id="msg-no-comments" item="property" /></em>
      </p>
    endif 
  </div>
  <div class="values">
    <Label id="label-accept-values" />
    <List what="values-list">
      <code>
        <!-- property enum value -->
      </code>
      ... <!-- each enum value -->
    </List>
  </div>
  <div class="default">
    <Label id="label-default-value" />
    <span>
      <!-- property default value -->
    </span>
  </div>
</div>
```

- `required` class appears for mandatory prop
- `deprecated` class appears for deprecated prop
