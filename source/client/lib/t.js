import { labels } from '#config'
import { inter, proxet } from '#utils'


let label = id => labels[id] ?? id

export default proxet((id, reps) => inter(label(id), reps), label);
