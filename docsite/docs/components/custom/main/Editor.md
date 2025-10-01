
```svelte label="markup/css structure"
<div {id} class="main-editor mode-{mode} lang-{lang} labeled shifted edited copied showing failed">
  if label
    <div class="label">
      <!-- render `label` -->
    </div>
  end if
  <Renbox>
    if [Renbox can render]
      <div class="stage">
        <!-- render Renbox content -->
        if error
          <div class="error">
            <!-- render `error` -->
          </div>
        end if
      </div>
    end if
  </Renbox>
  if mode !== "render"
    <div class="controls">
      if copy
        if copied
          <Button action="copied" disabled />
        else
          <Button action="copy" />        
        end if
      end if
      if toggle
        if showing
          <Button action="hide" />        
        else
          <Button action="show" />        
        end if
      end if
      if update
        <Button action="update" disabled={!edited} />
      end if
      if reset
        <Button action="reset" disabled={!shifted} />
      end if
    </div>
  end if
  <Code>
    if [Code can render]
      <div class="entry hljs">
        <!-- render Code content -->
      </div>
    end if
  </Code>
</div>
```

- `labeled` class is added if `label` is provided
- `shifted` class is added if current code is different from original
- `edited` class is added if current code has not been rendered
- `copied` class is added when current code copied to clipboard
- `showing` class is added when code block is displayed
- `failed` class is added when render failure occurs
