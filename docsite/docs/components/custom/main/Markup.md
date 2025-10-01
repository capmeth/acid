
```svelte label="markup/css structure"
<[el] {id} class="main-markup type-{type}">
  {#if empty}
    <p class="empty">
      <!-- label: `msg_no_${type}_description` -->
    </p>    
  {:else}
    <!-- render `children` -->
  {/if}
</[el]>
```
