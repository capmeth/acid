
```html label="Structure"
<div {id} class="element-editor mode-{mode} lang-{lang} shifted edited copied error">
  <div class="label">
    <!-- code block label -->
  </div>
  <div class="stage">
    <Renbox />
    :if error
      <div class="error-message">
        <Label id="cobe-error-prefix" /> <!-- error message here -->
      </div>
    :endif
  </div>
  <div class="controls">
    <Button>
      <Label id="cobe-button-{'copied' || 'copy'}" />
    </Button>
    <Button>
      <Label id="cobe-button-{'hide' || 'show'}" />
    </Button>
    <Button>
      <Label id="cobe-button-update" />
    </Button>
    <Button>
      <Label id="cobe-button-reset" />
    </Button>
  </div>
  <div class="entry">
    <Code />
  </div>
</div>
```