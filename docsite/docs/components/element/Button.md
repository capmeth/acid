
```html label="Structure"
<button class="element-button page-{page} region-{region} active">
  if action
    <Label id="action-{action}" />
  else
    <!-- child content renders here -->
  endif
</button>
```

- `active` class appears when the button is activated
- when `action` is present a **Label** is used
