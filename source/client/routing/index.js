import { routing } from '#config'
import hashRouter from './hash-router'
import routes  from './routes'
import slashRouter from './slash-router'


export default (routing === 'hash' ? hashRouter : slashRouter)(routes);
