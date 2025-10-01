
```svelte label="markup/css structure"
<When {use}>
  if [can render]
    <Markup id={mcid} el="article" type="article">
      <!-- render markdown content -->
    </Markup>
  end if
</When>
```
