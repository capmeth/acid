
```svelte mode="static" label="structure"
<When test={__valid_mcid__} {use}>
  <Article id={mcid} {type}>
    <!-- render markdown content component -->
  </Article>
</When>
```
