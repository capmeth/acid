
```html label="Structure"
<div class="app-docsite page-{page}">
  <Region name="banner" tag="header">
    <Link to="home">
      <img class="logo" />
    </Link>
    <Title>
      <Link to="home">
        <!-- `config.title` goes here -->
      </Link>
    </Title>
    <div class="version-info">
      <!-- `config.version` goes here -->
    </div>
  </Region>
  <@page>
    <Region name="nav" tag="nav">
      <!-- page nav region content goes here -->
    </Region>
    <Region name="main" tag="main">
      <Region name="leader" tag="header">
        <!-- page leader region content goes here -->
      </Region>
      <Region name="primary" tag="section">
        <!-- page main content region content goes here -->
      </Region>
      <Region name="trailer" tag="footer">
        <!-- page footer region content goes here (not currently used) -->
      </Region>
    </Region>
  </@page>
  <Region name="footer" tag="footer">
    <Footer />
  </Region>
</div>
```

- `<@page>` is a component from `page` group.
