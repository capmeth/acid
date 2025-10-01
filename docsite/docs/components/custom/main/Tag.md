
```svelte label="markup/css structure"
<span class="main-tag {name}">
  <span class="name">
    <!-- render `name` -->
  </span>
  {#if info}
    <span class="info">
      <!-- render `info` -->
    </span>
  {/if}
</span>
```
