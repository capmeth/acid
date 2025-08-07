
```html label="Structure"
<Card name="{group}">
  slot:header
    <Title>
      <Label id="label-{group}" />
    </Title>
  /slot:header
  <List what="{group}-list">
    <Link to="{group}">
      <!-- asset title -->
    </Link>
  </List>
  ... <!-- each asset group -->
  <List what="sections">
    <Link to="section">
      <!-- section title -->
    </Link>
    <List what="{group}-list">
      <Link to="{group}">
        <!-- asset title -->
      </Link>
    </List>
    ... <!-- each asset group -->
    <!-- child sections (recursive) -->
  </List>  
</Card>
```
