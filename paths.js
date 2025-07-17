import path from 'path'


let paths = { root: import.meta.dirname };

paths.coverage = path.join(paths.root, 'coverage');
paths.extensions = path.join(paths.root, 'extensions');
paths.modules = path.join(paths.root, 'node_modules');
paths.source = path.join(paths.root, 'source');
paths.test = path.join(paths.root, 'test');

// source paths
paths.client = path.join(paths.source, 'client');
paths.config = path.join(paths.source, 'config');
paths.node = path.join(paths.source, 'node');
paths.shared = path.join(paths.source, 'shared');
paths.service = path.join(paths.source, 'service');

// additional paths
paths.themes = path.join(paths.service, 'styler', 'themes');

export default paths;
