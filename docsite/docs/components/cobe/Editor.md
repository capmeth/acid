
```html label="Structure"
<div {id} class="element-editor mode-{mode} lang-{lang} labeled showing shifted edited copied failed">
  <div class="label">
    <!-- code block label -->
  </div>
  <div class="stage">
    <Renbox />
    if renderingError
      <div class="error-message">
        <Label id="cobe-error-prefix" /> <!-- error message here -->
      </div>
    endif
  </div>
  <div class="controls">
    if copiedToClipboard
      <Button action="copied" />
    else
      <Button action="copy" />
    endif
    if codeIsDisplayed
      <Button action="hide" />
    else
      <Button action="show" />
    endif
    <Button action="update" />
    <Button action="reset" />
  </div>
  <div class="entry hljs">
    <Code>
      <div class="copied">
        <Label id="msg-copied" />
      </div>
    </Code>
  </div>
</div>
```

Boolean state classes and when they appear:
- `copied`: code has been copied to the clipboard
- `edited`: code is different from current render
- `labeled`: code block has a label
- `shifted`: code is different from the original
- `showing`: code is currently displayed
- `failed`: code failed to compile
