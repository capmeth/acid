
```html label="Structure"
<Card name="primary">
  slot:header
    <Title>
      <Label id="label-primary" />
    </Title>
  /slot:header
  <List what="page-list">
    <Link to={name}>
      <Label id="page-{name}-title" />
    </Link>                    
  </List>
</Card> 
```

- `{name}` is a static page name ("index", "home")
