import Component from '../components/page/Component'
import Document from '../components/page/Document'
import Error from '../components/page/Error'
import Home from '../components/page/Home'
import Index from '../components/page/Index'
import Section from '../components/page/Section'


export default
[
    { name: 'home', path: '/home', Component: Home },
    { name: 'section', path: '/section/:sect', Component: Section },
    { name: 'document', path: '/document/:uid', Component: Document },
    { name: 'component', path: '/component/:uid', Component: Component },
    { name: 'index', path: '/index', Component: Index },
    { name: 'error', path: '/error', Component: Error },
];
