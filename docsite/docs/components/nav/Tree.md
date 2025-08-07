
```html label="Structure"
<Card name="branch">
  slot:header
    <Title>
      <Label id="label-sections" />
    </Title>
  /slot:header
  <List what="sections">
    <Link to="section">
      <!-- section title -->
    </Link>
    <!-- recursively list sub-sections -->
  </List>  
</Card>
```
