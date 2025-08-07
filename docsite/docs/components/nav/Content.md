
```html label="Structure"
<Toc {...args}>
  <Card name="content">
    slot:header
      <Title>
        <Label id="label-toc" />
      </Title>
    /slot:header
    {content}
  </Card>
</Toc>
```

- `{content}` comes from **Toc** component
