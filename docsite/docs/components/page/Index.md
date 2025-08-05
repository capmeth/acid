
```html label="Structure"
<region:leader>
  <Title>
    <Label id="page-index-title" />
  </Title>
</region:leader>

<region:primary>
  <Filtered {...filters} sort>
    <Label id="msg-asset-count" />
  </Filtered>
</region:primary>

<region:nav>
  <Card name="filters">
    slot:header
      <Title>
        <Label id="label-filters" />
      </Title>
    /slot:header
    <Filters />
  </Card>
  <Primary />
</region:nav>
```
