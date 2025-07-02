
```html label="Structure"
<div class="app-docsite {route}">
  <Region name="banner" tag="header">
    <Title>
      <Link to="home">
        <!-- `config.title` goes here -->
      </Link>
    </Title>
    <div class="version-info">
      <!-- `config.version` goes here -->
    </div>
  </Region>
  <page:component>
    <Region name="nav" tag="nav">
      <!-- page region content goes here -->
    </Region>
    <Region name="leader" tag="header">
      <!-- page region content goes here -->
    </Region>
    <Region name="main" tag="section">
      <!-- page region content goes here -->
    </Region>
    <Region name="trailer" tag="section">
      <!-- page region content goes here -->
    </Region>
  </page:component>
  <Region name="footer" tag="footer">
    <!-- ACID logo/banner -->
  </Region>
</div>
```

- `page:component` is a component from `page` group.
