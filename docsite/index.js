import { rollup } from '#utils';
import acid from '../source/entry.js'
import rollConfig from './rollup.config.js'
import config from './acid.config.js'


rollup.write(rollConfig);

acid.logger('test');
acid(config).run(true);
